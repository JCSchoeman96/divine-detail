/// <reference types="@sveltejs/kit" />
/// <reference types="@sveltejs/adapter-cloudflare" />
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
		}

		interface Platform {
			env?: {
				TURNSTILE_SECRET_KEY?: string;
				SENDPULSE_ID?: string;
				SENDPULSE_SECRET?: string;
				SENDPULSE_CLIENT_ID?: string;
				SENDPULSE_CLIENT_SECRET?: string;
				ADMIN_EMAIL?: string;
				SENDPULSE_INQUIRY_LIST_ID?: string;
				SENDPULSE_BOOKING_LIST_ID?: string;
				SUPABASE_URL?: string;
				SUPABASE_SERVICE_ROLE_KEY?: string;
			};
		}
	}
}

export {};
