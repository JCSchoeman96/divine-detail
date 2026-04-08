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
	if (!data.access_token) throw new Error('SendPulse auth failed');
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
		// #region agent log
		fetch('http://127.0.0.1:7289/ingest/56c587ad-bf21-4b45-b64c-958ae56e2365',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41a93a'},body:JSON.stringify({sessionId:'41a93a',runId:'pre-fix',hypothesisId:'H1',location:'contact/+page.server.ts:action:start',message:'Server env presence snapshot',data:{hasPlatformEnv:!!env,hasTurnstileSecret:!!(env?.TURNSTILE_SECRET_KEY ?? dynamicEnv.TURNSTILE_SECRET_KEY),hasSendpulseId:!!(env?.SENDPULSE_ID ?? dynamicEnv.SENDPULSE_ID),hasSendpulseSecret:!!(env?.SENDPULSE_SECRET ?? dynamicEnv.SENDPULSE_SECRET),hasSupabaseServiceRole:!!(env?.SUPABASE_SERVICE_ROLE_KEY ?? dynamicEnv.SUPABASE_SERVICE_ROLE_KEY),hasPublicSupabaseAnon:!!(env?.PUBLIC_SUPABASE_ANON_KEY ?? dynamicEnv.PUBLIC_SUPABASE_ANON_KEY)},timestamp:Date.now()})}).catch(()=>{});
		// #endregion

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
			// #region agent log
			fetch('http://127.0.0.1:7289/ingest/56c587ad-bf21-4b45-b64c-958ae56e2365',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41a93a'},body:JSON.stringify({sessionId:'41a93a',runId:'pre-fix',hypothesisId:'H2',location:'contact/+page.server.ts:validation:fail',message:'Validation fail payload safety',data:{errorKeys:Object.keys(errors),valueKeys:Object.keys(values),containsSecretLikeKeys:Object.keys(values).some((k)=>/secret|token|key/i.test(k))},timestamp:Date.now()})}).catch(()=>{});
			// #endregion
			return fail(400, { errors, values });
		}

		// ── Verify Turnstile ─────────────────────────────────────────────
		const turnstileSecret = env?.TURNSTILE_SECRET_KEY;
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
				return fail(403, {
					errors: { form: 'Security verification failed. Please try again.' } as Record<string, string>,
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
		const spId = env?.SENDPULSE_ID ?? dynamicEnv.SENDPULSE_ID ?? '';
		const spSecret = env?.SENDPULSE_SECRET ?? dynamicEnv.SENDPULSE_SECRET ?? '';
		const adminEmail = env?.ADMIN_EMAIL ?? 'megan@divinedetail.co.za';
		const listId = intent === 'booking'
			? (env?.SENDPULSE_BOOKING_LIST_ID ?? '597823')
			: (env?.SENDPULSE_INQUIRY_LIST_ID ?? '597820');

		const intentLabel = intent === 'booking' ? 'Booking Request' : 'General Inquiry';

		try {
			const token = await getSendPulseToken(spId, spSecret);
			// #region agent log
			fetch('http://127.0.0.1:7289/ingest/56c587ad-bf21-4b45-b64c-958ae56e2365',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41a93a'},body:JSON.stringify({sessionId:'41a93a',runId:'pre-fix',hypothesisId:'H3',location:'contact/+page.server.ts:sendpulse:start',message:'Outbound sendpulse request safety',data:{hasOAuthToken:!!token,listIdType:typeof listId,variableKeys:['Name','message','service','event_date','venue','intent'],phoneIncluded:!!phone},timestamp:Date.now()})}).catch(()=>{});
			// #endregion
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
				return fail(500, {
					errors: { form: 'Could not send your message. Please try again or WhatsApp us.' } as Record<string, string>,
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
			return fail(500, {
				errors: { form: 'Something went wrong. Please try again or WhatsApp us.' } as Record<string, string>,
				values,
			});
		}
		// #region agent log
		fetch('http://127.0.0.1:7289/ingest/56c587ad-bf21-4b45-b64c-958ae56e2365',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41a93a'},body:JSON.stringify({sessionId:'41a93a',runId:'pre-fix',hypothesisId:'H4',location:'contact/+page.server.ts:success:return',message:'Success response safety',data:{returnsOnlySuccess:true,includesSensitivePayload:false},timestamp:Date.now()})}).catch(()=>{});
		// #endregion

		return { success: true };
	},
} satisfies Actions;
