import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getAdminContext } from '$lib/server/admin';

export const load: LayoutServerLoad = async (event) => {
	if (event.url.pathname === '/admin/login') {
		const { session } = await event.locals.safeGetSession();
		if (session) {
			try {
				await getAdminContext(event);
				throw redirect(303, '/admin/submissions');
			} catch {
				// Allow non-admin users to remain on the login page.
			}
		}

		return {};
	}

	const admin = await getAdminContext(event);

	return { admin };
};
