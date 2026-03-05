/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare" />

declare global {
	namespace App {
		interface Platform {
			env?: {
				TURNSTILE_SECRET_KEY?: string;
				SENDPULSE_ID?: string;
				SENDPULSE_SECRET?: string;
				ADMIN_EMAIL?: string;
				SENDPULSE_INQUIRY_LIST_ID?: string;
				SENDPULSE_BOOKING_LIST_ID?: string;
			};
		}
	}
}

export {};
