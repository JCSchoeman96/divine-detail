import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export type AdminContext = {
	userId: string;
	email: string | null;
};

export const getAdminContext = async (event: RequestEvent): Promise<AdminContext> => {
	const { session, user } = await event.locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, `/admin/login?next=${encodeURIComponent(event.url.pathname)}`);
	}

	const { data, error } = await event.locals.supabase
		.from('admin_users')
		.select('user_id')
		.eq('user_id', user.id)
		.maybeSingle();

	if (error) {
		console.error('[Admin Auth Error]', error);
		throw redirect(303, '/admin/login?reason=role_check_failed');
	}

	if (!data) {
		throw redirect(303, '/admin/login?reason=unauthorized');
	}

	return {
		userId: user.id,
		email: user.email ?? null,
	};
};
