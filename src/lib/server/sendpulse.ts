type ContactNotificationInput = {
	adminEmail: string;
	notificationEmails: string[];
	date: string;
	email: string;
	fromEmail: string;
	intent: 'inquiry' | 'booking';
	intentLabel: string;
	message: string;
	name: string;
	service: string;
	venue: string;
};

type SendPulseSmtpPayload = {
	email: {
		subject: string;
		from: { name: string; email: string };
		to: Array<{ name: string; email: string }>;
		reply_to: { name: string; email: string };
		html: string;
	};
};

function encodeBase64(value: string): string {
	const bytes = new TextEncoder().encode(value);
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary);
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export function createContactNotificationPayload(
	input: ContactNotificationInput,
): SendPulseSmtpPayload {
	const html = `
		<h2>${escapeHtml(input.intentLabel)}</h2>
		<p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
		<p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
		<p><strong>Service:</strong> ${escapeHtml(input.service || 'Not specified')}</p>
		<p><strong>Event Date:</strong> ${escapeHtml(input.date || 'Not specified')}</p>
		${input.venue ? `<p><strong>Venue:</strong> ${escapeHtml(input.venue)}</p>` : ''}
		<p><strong>Message:</strong></p>
		<p>${escapeHtml(input.message).replace(/\n/g, '<br>')}</p>
	`;

	const recipients = [
		{ name: 'Megan', email: input.adminEmail },
		...input.notificationEmails
			.filter((notificationEmail) => notificationEmail !== input.adminEmail)
			.map((notificationEmail) => ({
				name: 'Notification Recipient',
				email: notificationEmail,
			})),
	];

	return {
		email: {
			subject: `[${input.intentLabel}] ${input.name}`,
			from: { name: 'Divine Detail Website', email: input.fromEmail },
			to: recipients,
			reply_to: { name: input.name, email: input.email },
			html: encodeBase64(html),
		},
	};
}
