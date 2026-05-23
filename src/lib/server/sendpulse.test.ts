import { describe, expect, test } from 'bun:test';
import { createContactNotificationPayload } from './sendpulse';

describe('createContactNotificationPayload', () => {
	test('encodes the HTML body as Base64 for SendPulse SMTP', () => {
		const payload = createContactNotificationPayload({
			adminEmail: 'megan@divinedetail.co.za',
			notificationEmails: ['meganuys2000@gmail.com'],
			date: '2026-07-06',
			email: 'jc@carpediem.co.za',
			fromEmail: 'megan@divinedetail.co.za',
			intent: 'inquiry',
			intentLabel: 'General Inquiry',
			message: 'Casual',
			name: 'JC Schoeman',
			service: 'Bridal Makeup',
			venue: '',
		});

		expect(payload.email.html).not.toContain('<h2>');
		expect(Buffer.from(payload.email.html, 'base64').toString('utf8')).toContain(
			'<h2>General Inquiry</h2>',
		);
	});

	test('uses the configured sender and keeps the submitter as reply-to', () => {
		const payload = createContactNotificationPayload({
			adminEmail: 'megan@divinedetail.co.za',
			notificationEmails: [],
			date: '',
			email: 'jc@carpediem.co.za',
			fromEmail: 'forms@divinedetail.co.za',
			intent: 'inquiry',
			intentLabel: 'General Inquiry',
			message: 'Hello',
			name: 'JC Schoeman',
			service: '',
			venue: '',
		});

		expect(payload.email.from).toEqual({
			name: 'Divine Detail Website',
			email: 'forms@divinedetail.co.za',
		});
		expect(payload.email.reply_to).toEqual({
			name: 'JC Schoeman',
			email: 'jc@carpediem.co.za',
		});
	});

	test('sends notifications to the admin and additional recipients', () => {
		const payload = createContactNotificationPayload({
			adminEmail: 'megan@divinedetail.co.za',
			notificationEmails: ['meganuys2000@gmail.com'],
			date: '',
			email: 'jc@carpediem.co.za',
			fromEmail: 'noreply@divinedetail.co.za',
			intent: 'inquiry',
			intentLabel: 'General Inquiry',
			message: 'Hello',
			name: 'JC Schoeman',
			service: '',
			venue: '',
		});

		expect(payload.email.to).toEqual([
			{ name: 'Megan', email: 'megan@divinedetail.co.za' },
			{ name: 'Notification Recipient', email: 'meganuys2000@gmail.com' },
		]);
	});
});
