import type { SupabaseClient } from '@supabase/supabase-js';
import { serviceList } from '$lib/data/services';
import { formatDateInput, getBundleStatus, bundleHasStaleCatalogPrices } from '$lib/pricing/bundles';
import { parsePriceToZar, sumBundleLines } from '$lib/pricing/money';

export { formatDateInput, getBundleStatus, bundleHasStaleCatalogPrices };

export type PricingCatalogRow = {
	id: string;
	item: string;
	price: string;
	unit_amount_zar: number;
	sort_order: number;
	group_label: string;
	service_slug: string;
	is_add_on: boolean;
};

export type PricingCatalogGroup = {
	service_slug: string;
	service_title: string;
	group_label: string;
	is_add_on: boolean;
	rows: PricingCatalogRow[];
};

export type BundleItemRecord = {
	id: string;
	bundle_id: string;
	pricing_row_id: string;
	quantity: number;
	sort_order: number;
	item_label: string;
	unit_price: string;
	unit_amount_zar: number;
};

export type BundleRecord = {
	id: string;
	name: string;
	description: string | null;
	bundle_price: string;
	bundle_amount_zar: number;
	regular_total_zar: number;
	is_active: boolean;
	starts_at: string | null;
	ends_at: string | null;
	show_on_homepage: boolean;
	service_slugs: string[];
	sort_order: number;
	created_at: string;
	updated_at: string;
	items: BundleItemRecord[];
};

export type BundleLineSelection = {
	pricing_row_id: string;
	quantity: number;
};

export type BundleInput = {
	name: string;
	description: string | null;
	bundle_price: string;
	is_active: boolean;
	starts_at: string | null;
	ends_at: string | null;
	show_on_homepage: boolean;
	service_slugs: string[];
	sort_order: number;
	items: BundleLineSelection[];
};

type CatalogQueryRow = {
	id: string;
	item: string;
	price: string;
	sort_order: number;
	service_pricing_groups: {
		label: string;
		service_slug: string;
		is_add_on: boolean;
	} | null;
};

type BundleQueryRow = Omit<BundleRecord, 'items'> & {
	pricing_bundle_items: BundleItemRecord[] | null;
};

const serviceTitleBySlug = new Map(serviceList.map((service) => [service.slug, service.title]));
export const validServiceSlugs = new Set(serviceList.map((service) => service.slug));

const bundleSelect = `
	id, name, description, bundle_price, bundle_amount_zar, regular_total_zar,
	is_active, starts_at, ends_at, show_on_homepage, service_slugs, sort_order,
	created_at, updated_at,
	pricing_bundle_items (
		id, bundle_id, pricing_row_id, quantity, sort_order,
		item_label, unit_price, unit_amount_zar
	)
`;

const mapBundle = (row: BundleQueryRow): BundleRecord => ({
	...row,
	items: [...(row.pricing_bundle_items ?? [])].sort((a, b) => a.sort_order - b.sort_order),
});

/** Convert YYYY-MM-DD to start-of-day SAST (UTC+2). */
export function dateInputToStartsAt(value: string): string | null {
	if (!value.trim()) return null;
	return `${value.trim()}T00:00:00+02:00`;
}

/** Convert YYYY-MM-DD to end-of-day SAST (UTC+2). */
export function dateInputToEndsAt(value: string): string | null {
	if (!value.trim()) return null;
	return `${value.trim()}T23:59:59+02:00`;
}

export async function loadPricingCatalog(supabase: SupabaseClient): Promise<PricingCatalogGroup[]> {
	const { data, error } = await supabase
		.from('service_pricing_rows')
		.select('id, item, price, sort_order, service_pricing_groups(label, service_slug, is_add_on)')
		.order('sort_order', { ascending: true });

	if (error) {
		console.error('[Pricing Catalog Load Error]', error);
		return [];
	}

	const groups = new Map<string, PricingCatalogGroup>();

	for (const row of (data ?? []) as CatalogQueryRow[]) {
		const group = row.service_pricing_groups;
		if (!group) continue;

		const unitAmountZar = parsePriceToZar(row.price);
		if (unitAmountZar === null) continue;

		const key = `${group.service_slug}::${group.label}::${group.is_add_on}`;
		const existing = groups.get(key) ?? {
			service_slug: group.service_slug,
			service_title: serviceTitleBySlug.get(group.service_slug) ?? group.service_slug,
			group_label: group.label,
			is_add_on: group.is_add_on,
			rows: [],
		};

		existing.rows.push({
			id: row.id,
			item: row.item,
			price: row.price,
			unit_amount_zar: unitAmountZar,
			sort_order: row.sort_order,
			group_label: group.label,
			service_slug: group.service_slug,
			is_add_on: group.is_add_on,
		});

		groups.set(key, existing);
	}

	return [...groups.values()].sort((a, b) => {
		const slugCompare = a.service_slug.localeCompare(b.service_slug);
		if (slugCompare !== 0) return slugCompare;
		if (a.is_add_on !== b.is_add_on) return a.is_add_on ? 1 : -1;
		return a.group_label.localeCompare(b.group_label);
	});
}

export async function loadAllBundles(supabase: SupabaseClient): Promise<BundleRecord[]> {
	const { data, error } = await supabase
		.from('pricing_bundles')
		.select(bundleSelect)
		.order('sort_order', { ascending: true });

	if (error) {
		console.error('[Bundles Admin Load Error]', error);
		return [];
	}

	return ((data ?? []) as BundleQueryRow[]).map(mapBundle);
}

export async function loadActiveBundles(
	supabase: SupabaseClient,
	options: { homepage?: boolean; serviceSlug?: string } = {},
): Promise<BundleRecord[]> {
	let query = supabase.from('pricing_bundles').select(bundleSelect).order('sort_order', { ascending: true });

	if (options.homepage) {
		query = query.eq('show_on_homepage', true);
	}

	if (options.serviceSlug) {
		query = query.contains('service_slugs', [options.serviceSlug]);
	}

	const { data, error } = await query;

	if (error) {
		console.error('[Active Bundles Load Error]', error);
		return [];
	}

	return ((data ?? []) as BundleQueryRow[]).map(mapBundle);
}

export async function loadCatalogMap(supabase: SupabaseClient): Promise<Map<string, PricingCatalogRow>> {
	const catalog = await loadPricingCatalog(supabase);
	const map = new Map<string, PricingCatalogRow>();

	for (const group of catalog) {
		for (const row of group.rows) {
			map.set(row.id, row);
		}
	}

	return map;
}

export function defaultServiceSlugsFromItems(
	items: BundleLineSelection[],
	catalog: Map<string, PricingCatalogRow>,
): string[] {
	const slugs = new Set<string>();

	for (const item of items) {
		const row = catalog.get(item.pricing_row_id);
		if (row) slugs.add(row.service_slug);
	}

	return [...slugs];
}

export type ValidatedBundlePayload = {
	bundle: Omit<BundleRecord, 'id' | 'created_at' | 'updated_at' | 'items'>;
	items: Omit<BundleItemRecord, 'id' | 'bundle_id'>[];
};

export function validateBundleInput(
	input: BundleInput,
	catalog: Map<string, PricingCatalogRow>,
): { ok: true; payload: ValidatedBundlePayload } | { ok: false; error: string } {
	const name = input.name.trim();
	if (!name) return { ok: false, error: 'Enter a bundle name.' };

	const bundleAmountZar = parsePriceToZar(input.bundle_price);
	if (bundleAmountZar === null) return { ok: false, error: 'Enter a fixed bundle price (e.g. R4,000).' };

	const selections = input.items.filter((item) => item.quantity >= 1);
	if (selections.length === 0) return { ok: false, error: 'Add at least one catalog item to the bundle.' };

	if (input.starts_at && input.ends_at && Date.parse(input.starts_at) > Date.parse(input.ends_at)) {
		return { ok: false, error: 'Start date must be before end date.' };
	}

	const serviceSlugs =
		input.service_slugs.length > 0
			? input.service_slugs.filter((slug) => validServiceSlugs.has(slug))
			: defaultServiceSlugsFromItems(selections, catalog);

	if (serviceSlugs.length === 0) {
		return { ok: false, error: 'Choose at least one service page to show this offer on.' };
	}

	const itemPayload: Omit<BundleItemRecord, 'id' | 'bundle_id'>[] = [];
	let sortOrder = 0;

	for (const selection of selections) {
		const row = catalog.get(selection.pricing_row_id);
		if (!row) {
			return { ok: false, error: 'One or more selected items are no longer in the catalog.' };
		}

		itemPayload.push({
			pricing_row_id: row.id,
			quantity: selection.quantity,
			sort_order: sortOrder,
			item_label: row.item,
			unit_price: row.price,
			unit_amount_zar: row.unit_amount_zar,
		});
		sortOrder += 10;
	}

	const regularTotalZar = sumBundleLines(
		itemPayload.map((item) => ({ quantity: item.quantity, unit_amount_zar: item.unit_amount_zar })),
	);

	return {
		ok: true,
		payload: {
			bundle: {
				name,
				description: input.description?.trim() || null,
				bundle_price: input.bundle_price.trim(),
				bundle_amount_zar: bundleAmountZar,
				regular_total_zar: regularTotalZar,
				is_active: input.is_active,
				starts_at: input.starts_at,
				ends_at: input.ends_at,
				show_on_homepage: input.show_on_homepage,
				service_slugs: serviceSlugs,
				sort_order: input.sort_order,
			},
			items: itemPayload,
		},
	};
}

export async function saveBundle(
	supabase: SupabaseClient,
	payload: ValidatedBundlePayload,
	bundleId?: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
	const now = new Date().toISOString();
	const bundleRow = {
		...payload.bundle,
		updated_at: now,
	};

	if (bundleId) {
		const { error: updateError } = await supabase.from('pricing_bundles').update(bundleRow).eq('id', bundleId);
		if (updateError) {
			console.error('[Bundle Update Error]', updateError);
			return { ok: false, error: 'Could not update bundle.' };
		}

		const { error: deleteError } = await supabase.from('pricing_bundle_items').delete().eq('bundle_id', bundleId);
		if (deleteError) {
			console.error('[Bundle Items Delete Error]', deleteError);
			return { ok: false, error: 'Could not update bundle items.' };
		}

		const { error: insertError } = await supabase.from('pricing_bundle_items').insert(
			payload.items.map((item) => ({ ...item, bundle_id: bundleId })),
		);
		if (insertError) {
			console.error('[Bundle Items Insert Error]', insertError);
			return { ok: false, error: 'Could not save bundle items.' };
		}

		return { ok: true, id: bundleId };
	}

	const { data, error: insertError } = await supabase
		.from('pricing_bundles')
		.insert({ ...bundleRow, created_at: now })
		.select('id')
		.single();

	if (insertError || !data) {
		console.error('[Bundle Insert Error]', insertError);
		return { ok: false, error: 'Could not create bundle.' };
	}

	const { error: itemsError } = await supabase.from('pricing_bundle_items').insert(
		payload.items.map((item) => ({ ...item, bundle_id: data.id })),
	);

	if (itemsError) {
		console.error('[Bundle Items Insert Error]', itemsError);
		await supabase.from('pricing_bundles').delete().eq('id', data.id);
		return { ok: false, error: 'Could not save bundle items.' };
	}

	return { ok: true, id: data.id };
}

export async function deleteBundle(
	supabase: SupabaseClient,
	bundleId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
	const { error } = await supabase.from('pricing_bundles').delete().eq('id', bundleId);

	if (error) {
		console.error('[Bundle Delete Error]', error);
		return { ok: false, error: 'Could not delete bundle.' };
	}

	return { ok: true };
}

export async function nextBundleSortOrder(supabase: SupabaseClient): Promise<number> {
	const { data } = await supabase
		.from('pricing_bundles')
		.select('sort_order')
		.order('sort_order', { ascending: false })
		.limit(1);

	return ((data?.[0]?.sort_order as number | undefined) ?? 0) + 10;
}
