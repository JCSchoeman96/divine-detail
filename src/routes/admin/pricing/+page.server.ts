import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serviceList } from '$lib/data/services';
import { getAdminContext } from '$lib/server/admin';

const serviceSlugs = new Set(serviceList.map((service) => service.slug));

const clean = (value: FormDataEntryValue | null) => value?.toString().trim() ?? '';

const requireServiceSlug = (value: string) => {
	if (serviceSlugs.has(value)) return value;
	return serviceList[0]?.slug ?? '';
};

const nextSortOrder = async (
	locals: App.Locals,
	table: 'service_pricing_groups' | 'service_pricing_rows',
	filterColumn: 'service_slug' | 'group_id',
	filterValue: string,
	isAddOn?: boolean,
) => {
	let query = locals.supabase
		.from(table)
		.select('sort_order')
		.eq(filterColumn, filterValue)
		.order('sort_order', { ascending: false })
		.limit(1);

	if (table === 'service_pricing_groups' && typeof isAddOn === 'boolean') {
		query = query.eq('is_add_on', isAddOn);
	}

	const { data } = await query;
	return ((data?.[0]?.sort_order as number | undefined) ?? 0) + 10;
};

export const load: PageServerLoad = async (event) => {
	await getAdminContext(event);

	const selectedServiceSlug = requireServiceSlug(event.url.searchParams.get('service') ?? '');

	const { data, error } = await event.locals.supabase
		.from('service_pricing_groups')
		.select(
			'id, service_slug, label, note, sort_order, is_add_on, service_pricing_rows(id, item, price, sort_order)',
		)
		.eq('service_slug', selectedServiceSlug)
		.order('sort_order', { ascending: true })
		.order('sort_order', { referencedTable: 'service_pricing_rows', ascending: true });

	if (error) {
		console.error('[Admin Pricing Load Error]', error);
		return {
			services: serviceList.map(({ slug, shortTitle, title }) => ({ slug, shortTitle, title })),
			selectedServiceSlug,
			groups: [],
			loadError: 'Could not load pricing.',
		};
	}

	return {
		services: serviceList.map(({ slug, shortTitle, title }) => ({ slug, shortTitle, title })),
		selectedServiceSlug,
		groups: data ?? [],
		loadError: null,
	};
};

export const actions: Actions = {
	signout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	},
	createGroup: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const serviceSlug = requireServiceSlug(clean(formData.get('service_slug')));
		const label = clean(formData.get('label'));
		const note = clean(formData.get('note'));
		const isAddOn = clean(formData.get('is_add_on')) === 'true';

		if (!serviceSlug || !label) {
			return fail(400, { actionError: 'Choose a service and enter a group label.' });
		}

		const sortOrder = isAddOn
			? 1000 + (await nextSortOrder(event.locals, 'service_pricing_groups', 'service_slug', serviceSlug, true))
			: await nextSortOrder(event.locals, 'service_pricing_groups', 'service_slug', serviceSlug, false);

		const { error } = await event.locals.supabase.from('service_pricing_groups').insert({
			service_slug: serviceSlug,
			label,
			note: note || null,
			is_add_on: isAddOn,
			sort_order: sortOrder,
		});

		if (error) {
			console.error('[Admin Pricing Group Create Error]', error);
			return fail(500, { actionError: 'Could not add pricing group.' });
		}

		return { actionSuccess: 'Pricing group added.' };
	},
	updateGroup: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const id = clean(formData.get('id'));
		const label = clean(formData.get('label'));
		const note = clean(formData.get('note'));
		const isAddOn = clean(formData.get('is_add_on')) === 'true';

		if (!id || !label) {
			return fail(400, { actionError: 'Missing group ID or label.' });
		}

		const { error } = await event.locals.supabase
			.from('service_pricing_groups')
			.update({ label, note: note || null, is_add_on: isAddOn, updated_at: new Date().toISOString() })
			.eq('id', id);

		if (error) {
			console.error('[Admin Pricing Group Update Error]', error);
			return fail(500, { actionError: 'Could not update pricing group.' });
		}

		return { actionSuccess: 'Pricing group saved.' };
	},
	deleteGroup: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const id = clean(formData.get('id'));

		if (!id) {
			return fail(400, { actionError: 'Missing group ID.' });
		}

		const { error } = await event.locals.supabase.from('service_pricing_groups').delete().eq('id', id);

		if (error) {
			console.error('[Admin Pricing Group Delete Error]', error);
			return fail(500, { actionError: 'Could not delete pricing group.' });
		}

		return { actionSuccess: 'Pricing group deleted.' };
	},
	createRow: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const groupId = clean(formData.get('group_id'));
		const item = clean(formData.get('item'));
		const price = clean(formData.get('price'));

		if (!groupId || !item || !price) {
			return fail(400, { actionError: 'Enter an item and price.' });
		}

		const sortOrder = await nextSortOrder(event.locals, 'service_pricing_rows', 'group_id', groupId);
		const { error } = await event.locals.supabase
			.from('service_pricing_rows')
			.insert({ group_id: groupId, item, price, sort_order: sortOrder });

		if (error) {
			console.error('[Admin Pricing Row Create Error]', error);
			return fail(500, { actionError: 'Could not add pricing row.' });
		}

		return { actionSuccess: 'Pricing row added.' };
	},
	updateRow: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const id = clean(formData.get('id'));
		const item = clean(formData.get('item'));
		const price = clean(formData.get('price'));

		if (!id || !item || !price) {
			return fail(400, { actionError: 'Missing row ID, item, or price.' });
		}

		const { error } = await event.locals.supabase
			.from('service_pricing_rows')
			.update({ item, price, updated_at: new Date().toISOString() })
			.eq('id', id);

		if (error) {
			console.error('[Admin Pricing Row Update Error]', error);
			return fail(500, { actionError: 'Could not update pricing row.' });
		}

		return { actionSuccess: 'Pricing row saved.' };
	},
	deleteRow: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const id = clean(formData.get('id'));

		if (!id) {
			return fail(400, { actionError: 'Missing row ID.' });
		}

		const { error } = await event.locals.supabase.from('service_pricing_rows').delete().eq('id', id);

		if (error) {
			console.error('[Admin Pricing Row Delete Error]', error);
			return fail(500, { actionError: 'Could not delete pricing row.' });
		}

		return { actionSuccess: 'Pricing row deleted.' };
	},
};
