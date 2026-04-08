import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { env as dynamicPublicEnv } from '$env/dynamic/public';

const getPublicEnvValue = (key: string): string => {
	const runtimeValue = dynamicPublicEnv[key as keyof typeof dynamicPublicEnv];
	if (typeof runtimeValue === 'string' && runtimeValue.trim().length > 0) return runtimeValue;

	return '';
};

export const handle: Handle = async ({ event, resolve }) => {
	const supabaseUrl = getPublicEnvValue('PUBLIC_SUPABASE_URL');
	const supabaseAnonKey = getPublicEnvValue('PUBLIC_SUPABASE_ANON_KEY');

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			'Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY for auth session handling.',
		);
	}

	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			},
		},
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		},
	});
};
