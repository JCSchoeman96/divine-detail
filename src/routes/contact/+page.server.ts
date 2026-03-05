import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env as dynamicEnv } from '$env/dynamic/private';

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

export const actions = {
	default: async ({ request, platform }) => {
		const env = platform?.env;

		const data = await request.formData();
		const name = data.get('name')?.toString().trim() ?? '';
		const email = data.get('email')?.toString().trim() ?? '';
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
		const values = { name, email, service, date, message, venue, intent };
		const errors: Record<string, string> = {};
		if (!name) errors.name = 'Please enter your name.';
		if (!email) {
			errors.email = 'Please enter your email address.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Please enter a valid email address.';
		}
		if (!message) errors.message = 'Please include a message.';
		if (intent === 'booking' && !date) {
			errors.date = 'Please select your event date.';
		}

		if (Object.keys(errors).length > 0) {
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
							name,
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
				return fail(500, {
					errors: { form: 'Could not send your message. Please try again or WhatsApp us.' } as Record<string, string>,
					values,
				});
			}
		} catch (err) {
			console.error('[Contact Form Error]', err);
			return fail(500, {
				errors: { form: 'Something went wrong. Please try again or WhatsApp us.' } as Record<string, string>,
				values,
			});
		}

		return { success: true };
	},
} satisfies Actions;
