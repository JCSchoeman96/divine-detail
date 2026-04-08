import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 20;

export const load: PageServerLoad = async ({ url, locals }) => {
	const page = Math.max(parseInt(url.searchParams.get('page') ?? '1', 10), 1);
	const intent = url.searchParams.get('intent');
	const status = url.searchParams.get('status');
	const email = url.searchParams.get('email')?.trim();

	const query = locals.supabase
		.from('contact_submissions')
		.select(
			'id, created_at, intent, name, email, phone, service, event_date, venue, message, status, sendpulse_status, sendpulse_error',
			{ count: 'exact' },
		)
		.order('created_at', { ascending: false })
		.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

	if (intent && intent !== 'all') query.eq('intent', intent);
	if (status && status !== 'all') query.eq('status', status);
	if (email) query.ilike('email', `%${email}%`);

	const { data, error, count } = await query;

	if (error) {
		console.error('[Admin Submissions Load Error]', error);
		return {
			items: [],
			page,
			pageSize: PAGE_SIZE,
			total: 0,
			filters: { intent: intent ?? 'all', status: status ?? 'all', email: email ?? '' },
			loadError: 'Could not load submissions.',
		};
	}

	return {
		items: data ?? [],
		page,
		pageSize: PAGE_SIZE,
		total: count ?? 0,
		filters: { intent: intent ?? 'all', status: status ?? 'all', email: email ?? '' },
		loadError: null,
	};
};

export const actions: Actions = {
	signout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	},
	updateStatus: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';
		const status = formData.get('status')?.toString() ?? '';

		if (!id || !status) {
			return fail(400, { actionError: 'Missing submission ID or status.' });
		}

		const { error } = await locals.supabase.from('contact_submissions').update({ status }).eq('id', id);

		if (error) {
			console.error('[Admin Submission Update Error]', error);
			return fail(500, { actionError: 'Could not update status.' });
		}

		return { actionSuccess: true };
	},
};
