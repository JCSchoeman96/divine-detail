import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env as dynamicEnv } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';

type ContactSubmissionInsert = {
	intent: 'inquiry' | 'booking';
	name: string;
	email: string;
	phone: string | null;
	service: string | null;
	event_date: string | null;
	venue: string | null;
	message: string;
	source: string;
	status: string;
	sendpulse_status: string;
	sendpulse_error: string | null;
};

/** Fetch a fresh SendPulse OAuth token. */
async function getSendPulseToken(clientId: string, clientSecret: string): Promise<string> {
	const res = await fetch('https://api.sendpulse.com/oauth/access_token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret,
		}),
	});

	const data = await res.json();
	if (!res.ok) {
		throw new Error(`SendPulse auth request failed (${res.status})`);
	}
	if (!data.access_token) throw new Error('SendPulse auth failed (no access token returned)');
	return data.access_token as string;
}

async function ensureSendPulseVariables(
	token: string,
	listId: string,
	variableNames: string[],
): Promise<void> {
	for (const variableName of variableNames) {
		const res = await fetch(`https://api.sendpulse.com/addressbooks/${listId}/variables`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: variableName,
				type: 'string',
			}),
		});

		// Ignore failures here to avoid blocking lead capture if variable already exists
		// or if the account doesn't allow dynamic variable creation via API.
		if (!res.ok) {
			const errBody = await res.text();
			console.warn('[SendPulse Variable Ensure Warning]', variableName, res.status, errBody);
		}
	}
}

export const actions = {
	default: async ({ request, platform }) => {
		const env = platform?.env;
		const getPrivateEnv = (...keys: string[]): string => {
			for (const key of keys) {
				const platformValue = env?.[key as keyof typeof env];
				if (typeof platformValue === 'string' && platformValue.trim().length > 0) return platformValue;

				const runtimeValue = dynamicEnv[key as keyof typeof dynamicEnv];
				if (typeof runtimeValue === 'string' && runtimeValue.trim().length > 0) return runtimeValue;
			}
			return '';
		};

		const data = await request.formData();
		const name = data.get('name')?.toString().trim() ?? '';
		const email = data.get('email')?.toString().trim() ?? '';
		const phone = data.get('phone')?.toString().trim() ?? '';
		const service = data.get('service')?.toString().trim() ?? '';
		const date = data.get('date')?.toString().trim() ?? '';
		const message = data.get('message')?.toString().trim() ?? '';
		const venue = data.get('venue')?.toString().trim() ?? '';
		const intent = data.get('intent')?.toString() === 'booking' ? 'booking' : 'inquiry';
		const turnstileResponse = data.get('cf-turnstile-response')?.toString() ?? '';
		const honeypot = data.get('user_website')?.toString() ?? '';
		const loadTime = parseInt(data.get('load_time')?.toString() ?? '0', 10);

		// ── Spam checks (silent success so bots think they won) ──────────
		if (honeypot.length > 0) {
			console.warn('[Spam] Honeypot triggered');
			return { success: true };
		}
		const secondsToFill = (Date.now() - loadTime) / 1000;
		if (loadTime > 0 && secondsToFill < 2) {
			console.warn(`[Spam] Fast submit: ${secondsToFill.toFixed(1)}s`);
			return { success: true };
		}

		// ── Validate fields ──────────────────────────────────────────────
		const values = { name, email, phone, service, date, message, venue, intent };
		const errors: Record<string, string> = {};
		if (!name) errors.name = 'Please enter your name.';
		if (!email) {
			errors.email = 'Please enter your email address.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Please enter a valid email address.';
		}
		if (!message) errors.message = 'Please include a message.';
		if (intent === 'booking' && !phone) {
			errors.phone = 'Please enter your phone number for booking requests.';
		}
		if (intent === 'booking' && !date) {
			errors.date = 'Please select your event date.';
		}

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		// ── Verify Turnstile ─────────────────────────────────────────────
		const turnstileSecret = env?.TURNSTILE_SECRET_KEY ?? dynamicEnv.TURNSTILE_SECRET_KEY;
		if (turnstileSecret) {
			const verifyRes = await fetch(
				'https://challenges.cloudflare.com/turnstile/v0/siteverify',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: new URLSearchParams({
						secret: turnstileSecret,
						response: turnstileResponse,
					}),
				},
			);
			const verifyData = await verifyRes.json();
			if (!verifyData.success) {
				console.error('[Turnstile Verify Error]', {
					errorCodes: verifyData['error-codes'] ?? [],
					action: verifyData.action ?? null,
					hasResponse: turnstileResponse.length > 0,
				});
				return fail(403, {
					errors: { form: 'Security verification failed. Please try again. [TS_VERIFY]' } as Record<string, string>,
					values,
				});
			}
		}

		const supabaseUrl = env?.SUPABASE_URL ?? dynamicEnv.SUPABASE_URL ?? '';
		const supabaseServiceRoleKey = env?.SUPABASE_SERVICE_ROLE_KEY ?? dynamicEnv.SUPABASE_SERVICE_ROLE_KEY ?? '';
		const supabase = supabaseUrl && supabaseServiceRoleKey
			? createClient(supabaseUrl, supabaseServiceRoleKey)
			: null;
		let submissionId: string | null = null;

		if (supabase) {
			const payload: ContactSubmissionInsert = {
				intent,
				name,
				email,
				phone: phone || null,
				service: service || null,
				event_date: date || null,
				venue: venue || null,
				message,
				source: 'website_contact_form',
				status: 'received',
				sendpulse_status: 'pending',
				sendpulse_error: null,
			};

			const { data: inserted, error: insertError } = await supabase
				.from('contact_submissions')
				.insert(payload)
				.select('id')
				.single();

			if (insertError) {
				console.error('[Supabase Insert Error]', insertError);
			} else {
				submissionId = inserted.id;
			}
		}

		// ── SendPulse ────────────────────────────────────────────────────
		const spId = getPrivateEnv('SENDPULSE_ID', 'SENDPULSE_CLIENT_ID');
		const spSecret = getPrivateEnv('SENDPULSE_SECRET', 'SENDPULSE_CLIENT_SECRET');
		const adminEmail = env?.ADMIN_EMAIL ?? dynamicEnv.ADMIN_EMAIL ?? 'megan@divinedetail.co.za';
		const listId = intent === 'booking'
			? (env?.SENDPULSE_BOOKING_LIST_ID ?? dynamicEnv.SENDPULSE_BOOKING_LIST_ID ?? '597823')
			: (env?.SENDPULSE_INQUIRY_LIST_ID ?? dynamicEnv.SENDPULSE_INQUIRY_LIST_ID ?? '597820');

		const intentLabel = intent === 'booking' ? 'Booking Request' : 'General Inquiry';
		const persisted = Boolean(submissionId);
		let listSubscriptionSucceeded = false;

		if (!spId || !spSecret) {
			console.warn(
				'[Contact Form] SendPulse credentials missing (expected SENDPULSE_ID/SENDPULSE_SECRET or SENDPULSE_CLIENT_ID/SENDPULSE_CLIENT_SECRET). Submission will not be forwarded.',
			);
			if (supabase && submissionId) {
				await supabase
					.from('contact_submissions')
					.update({
						status: 'sendpulse_unconfigured',
						sendpulse_status: 'skipped',
						sendpulse_error: 'Missing SENDPULSE_ID or SENDPULSE_SECRET',
					})
					.eq('id', submissionId);
			}

			if (persisted) return { success: true };
			return fail(500, {
				errors: { form: 'Message service is temporarily unavailable. Please WhatsApp us directly.' } as Record<string, string>,
				values,
			});
		}

		try {
			const token = await getSendPulseToken(spId, spSecret);
			await ensureSendPulseVariables(token, listId, [
				'Name',
				'service',
				'event_date',
				'venue',
				'intent',
				'message',
			]);

			// 1. Add subscriber to the appropriate mailing list
			const listRes = await fetch(`https://api.sendpulse.com/addressbooks/${listId}/emails`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					emails: [{
						email,
						variables: {
							Name: name,
							message,
							service: service || 'Not specified',
							event_date: date || 'Not specified',
							venue: venue || 'Not specified',
							intent,
						},
					}],
				}),
			});

			if (!listRes.ok) {
				const errBody = await listRes.text();
				console.error('[SendPulse List Error]', listRes.status, errBody);
				if (supabase && submissionId) {
					await supabase
						.from('contact_submissions')
						.update({
							status: 'sendpulse_partial_failure',
							sendpulse_status: 'list_failed',
							sendpulse_error: `List API failed (${listRes.status})`,
						})
						.eq('id', submissionId);
				}
			}
			if (listRes.ok) {
				listSubscriptionSucceeded = true;
			}
			if (listRes.ok && phone) {
				const phoneRes = await fetch(
					`https://api.sendpulse.com/addressbooks/${listId}/emails/phone`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							email,
							phone,
						}),
					},
				);

				if (!phoneRes.ok) {
					const errBody = await phoneRes.text();
					console.error('[SendPulse Phone Update Error]', phoneRes.status, errBody);
				}
			}

			// 2. Send immediate SMTP notification to admin
			const emailPayload = {
				email: {
					subject: `[${intentLabel}] ${name}`,
					from: { name: 'Divine Detail Website', email: 'noreply@divinedetail.co.za' },
					to: [{ name: 'Megan', email: adminEmail }],
					html: `
						<h2>${intentLabel}</h2>
						<p><strong>Name:</strong> ${name}</p>
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Service:</strong> ${service || 'Not specified'}</p>
						<p><strong>Event Date:</strong> ${date || 'Not specified'}</p>
						${venue ? `<p><strong>Venue:</strong> ${venue}</p>` : ''}
						<p><strong>Message:</strong></p>
						<p>${message.replace(/\n/g, '<br>')}</p>
					`,
				},
			};

			const sendRes = await fetch('https://api.sendpulse.com/smtp/emails', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(emailPayload),
			});

			if (!sendRes.ok) {
				const errBody = await sendRes.text();
				console.error('[SendPulse SMTP Error]', sendRes.status, errBody);
				if (supabase && submissionId) {
					await supabase
						.from('contact_submissions')
						.update({
							status: 'sendpulse_failed',
							sendpulse_status: 'smtp_failed',
							sendpulse_error: `SMTP API failed (${sendRes.status})`,
						})
						.eq('id', submissionId);
				}
				// If we already captured the lead (Supabase or SendPulse list), do not block the user.
				if (persisted || listSubscriptionSucceeded) return { success: true };
				return fail(500, {
					errors: {
						form: `Could not send your message. Please try again or WhatsApp us. [SP_SMTP_${sendRes.status}]`,
					} as Record<string, string>,
					values,
				});
			}

			if (supabase && submissionId) {
				await supabase
					.from('contact_submissions')
					.update({
						status: 'processed',
						sendpulse_status: 'sent',
						sendpulse_error: null,
					})
					.eq('id', submissionId);
			}
		} catch (err) {
			console.error('[Contact Form Error]', err);
			if (supabase && submissionId) {
				await supabase
					.from('contact_submissions')
					.update({
						status: 'sendpulse_failed',
						sendpulse_status: 'error',
						sendpulse_error: err instanceof Error ? err.message : 'Unknown error',
					})
					.eq('id', submissionId);
			}
			if (persisted || listSubscriptionSucceeded) return { success: true };
			return fail(500, {
				errors: { form: 'Something went wrong. Please try again or WhatsApp us. [CONTACT_RUNTIME]' } as Record<string, string>,
				values,
			});
		}

		return { success: true };
	},
} satisfies Actions;
