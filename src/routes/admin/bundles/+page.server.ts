import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serviceList } from '$lib/data/services';
import { getAdminContext } from '$lib/server/admin';
import {
	dateInputToEndsAt,
	dateInputToStartsAt,
	deleteBundle,
	loadAllBundles,
	loadCatalogMap,
	loadPricingCatalog,
	nextBundleSortOrder,
	saveBundle,
	validServiceSlugs,
	validateBundleInput,
	type BundleInput,
	type BundleLineSelection,
} from '$lib/server/pricingBundles';

const clean = (value: FormDataEntryValue | null) => value?.toString().trim() ?? '';

const parseQuantities = (formData: FormData): BundleLineSelection[] => {
	const items: BundleLineSelection[] = [];

	for (const [key, value] of formData.entries()) {
		if (!key.startsWith('qty_')) continue;

		const pricingRowId = key.slice(4);
		const quantity = Number.parseInt(clean(value), 10);
		if (quantity >= 1) {
			items.push({ pricing_row_id: pricingRowId, quantity });
		}
	}

	return items;
};

const parseServiceSlugs = (formData: FormData): string[] => {
	return formData
		.getAll('service_slugs')
		.map((value) => clean(value))
		.filter((slug) => validServiceSlugs.has(slug));
};

const parseBundleForm = (formData: FormData): BundleInput => ({
	name: clean(formData.get('name')),
	description: clean(formData.get('description')) || null,
	bundle_price: clean(formData.get('bundle_price')),
	is_active: clean(formData.get('is_active')) === 'true',
	starts_at: dateInputToStartsAt(clean(formData.get('starts_at'))),
	ends_at: dateInputToEndsAt(clean(formData.get('ends_at'))),
	show_on_homepage: formData.get('show_on_homepage') === 'on',
	service_slugs: parseServiceSlugs(formData),
	sort_order: Number.parseInt(clean(formData.get('sort_order')) || '0', 10) || 0,
	items: parseQuantities(formData),
});

export const load: PageServerLoad = async (event) => {
	await getAdminContext(event);

	const editId = event.url.searchParams.get('edit') ?? '';
	const [catalog, bundles, catalogMap] = await Promise.all([
		loadPricingCatalog(event.locals.supabase),
		loadAllBundles(event.locals.supabase),
		loadCatalogMap(event.locals.supabase),
	]);

	const editing = editId ? (bundles.find((bundle) => bundle.id === editId) ?? null) : null;

	return {
		catalog,
		bundles,
		editing,
		catalogMap: Object.fromEntries(catalogMap),
		services: serviceList.map(({ slug, title }) => ({ slug, title })),
	};
};

export const actions: Actions = {
	signout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	},
	createBundle: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const catalog = await loadCatalogMap(event.locals.supabase);
		const input = parseBundleForm(formData);
		input.sort_order = await nextBundleSortOrder(event.locals.supabase);

		const validated = validateBundleInput(input, catalog);
		if (!validated.ok) return fail(400, { actionError: validated.error });

		const saved = await saveBundle(event.locals.supabase, validated.payload);
		if (!saved.ok) return fail(500, { actionError: saved.error });

		return { actionSuccess: 'Bundle created.', bundleId: saved.id };
	},
	updateBundle: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const bundleId = clean(formData.get('id'));
		if (!bundleId) return fail(400, { actionError: 'Missing bundle ID.' });

		const catalog = await loadCatalogMap(event.locals.supabase);
		const input = parseBundleForm(formData);
		const validated = validateBundleInput(input, catalog);
		if (!validated.ok) return fail(400, { actionError: validated.error });

		const saved = await saveBundle(event.locals.supabase, validated.payload, bundleId);
		if (!saved.ok) return fail(500, { actionError: saved.error });

		return { actionSuccess: 'Bundle saved.', bundleId: saved.id };
	},
	deleteBundle: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const bundleId = clean(formData.get('id'));
		if (!bundleId) return fail(400, { actionError: 'Missing bundle ID.' });

		const result = await deleteBundle(event.locals.supabase, bundleId);
		if (!result.ok) return fail(500, { actionError: result.error });

		return { actionSuccess: 'Bundle deleted.' };
	},
	toggleActive: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const bundleId = clean(formData.get('id'));
		const isActive = clean(formData.get('is_active')) === 'true';
		if (!bundleId) return fail(400, { actionError: 'Missing bundle ID.' });

		const { error } = await event.locals.supabase
			.from('pricing_bundles')
			.update({ is_active: isActive, updated_at: new Date().toISOString() })
			.eq('id', bundleId);

		if (error) {
			console.error('[Bundle Toggle Error]', error);
			return fail(500, { actionError: 'Could not update bundle status.' });
		}

		return { actionSuccess: isActive ? 'Bundle activated.' : 'Bundle deactivated.' };
	},
	duplicateBundle: async (event) => {
		await getAdminContext(event);
		const formData = await event.request.formData();
		const bundleId = clean(formData.get('id'));
		if (!bundleId) return fail(400, { actionError: 'Missing bundle ID.' });

		const bundles = await loadAllBundles(event.locals.supabase);
		const source = bundles.find((bundle) => bundle.id === bundleId);
		if (!source) return fail(404, { actionError: 'Bundle not found.' });

		const catalog = await loadCatalogMap(event.locals.supabase);
		const input: BundleInput = {
			name: `${source.name} (copy)`,
			description: source.description,
			bundle_price: source.bundle_price,
			is_active: false,
			starts_at: source.starts_at,
			ends_at: source.ends_at,
			show_on_homepage: false,
			service_slugs: source.service_slugs,
			sort_order: await nextBundleSortOrder(event.locals.supabase),
			items: source.items.map((item) => ({
				pricing_row_id: item.pricing_row_id,
				quantity: item.quantity,
			})),
		};

		const validated = validateBundleInput(input, catalog);
		if (!validated.ok) return fail(400, { actionError: validated.error });

		const saved = await saveBundle(event.locals.supabase, validated.payload);
		if (!saved.ok) return fail(500, { actionError: saved.error });

		throw redirect(303, `/admin/bundles?edit=${saved.id}`);
	},
};
