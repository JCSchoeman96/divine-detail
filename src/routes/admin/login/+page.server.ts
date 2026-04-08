import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { session } = await locals.safeGetSession();
	if (session) {
		throw redirect(303, '/admin/submissions');
	}

	return {
		next: url.searchParams.get('next') ?? '/admin/submissions',
		reason: url.searchParams.get('reason'),
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const next = formData.get('next')?.toString() ?? '/admin/submissions';

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required.',
				values: { email, next },
			});
		}

		const { error } = await locals.supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return fail(401, {
				error: 'Invalid login details.',
				values: { email, next },
			});
		}

		throw redirect(303, next.startsWith('/admin') ? next : '/admin/submissions');
	},
};
