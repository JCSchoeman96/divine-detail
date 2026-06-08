import type { SupabaseClient } from '@supabase/supabase-js';
import { getService, serviceList, type ServiceData, type ServicePriceRow } from '../data/services';

export type PricingRowRecord = {
	id: string;
	item: string;
	price: string;
	sort_order: number;
};

export type PricingGroupRecord = {
	id: string;
	service_slug?: string;
	label: string;
	note: string | null;
	sort_order: number;
	is_add_on: boolean;
	rows: PricingRowRecord[];
};

type PricingGroupQueryRow = Omit<PricingGroupRecord, 'rows'> & {
	service_pricing_rows?: PricingRowRecord[] | null;
};

const bySortOrder = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

const toPriceRows = (rows: PricingRowRecord[]): ServicePriceRow[] =>
	[...rows].sort(bySortOrder).map((row) => ({
		item: row.item,
		price: row.price,
	}));

export function mergeServicePricing(
	service: ServiceData,
	groups: PricingGroupRecord[] | undefined,
): ServiceData {
	if (!groups || groups.length === 0) {
		return { ...service };
	}

	const sortedGroups = [...groups].sort(bySortOrder);
	const pricing = sortedGroups
		.filter((group) => !group.is_add_on)
		.map((group) => ({
			label: group.label,
			rows: toPriceRows(group.rows),
			...(group.note ? { note: group.note } : {}),
		}));
	const addOns = sortedGroups
		.filter((group) => group.is_add_on)
		.flatMap((group) => toPriceRows(group.rows));

	return {
		...service,
		pricing,
		addOns: addOns.length > 0 ? addOns : undefined,
	};
}

export async function loadPricingGroupsByService(
	supabase: SupabaseClient,
	serviceSlugs: string[],
): Promise<Record<string, PricingGroupRecord[]>> {
	if (serviceSlugs.length === 0) return {};

	const { data, error } = await supabase
		.from('service_pricing_groups')
		.select(
			'id, service_slug, label, note, sort_order, is_add_on, service_pricing_rows(id, item, price, sort_order)',
		)
		.in('service_slug', serviceSlugs)
		.order('sort_order', { ascending: true })
		.order('sort_order', { referencedTable: 'service_pricing_rows', ascending: true });

	if (error) {
		console.error('[Service Pricing Load Error]', error);
		return {};
	}

	return ((data ?? []) as PricingGroupQueryRow[]).reduce<Record<string, PricingGroupRecord[]>>(
		(groupsByService, group) => {
			const serviceSlug = group.service_slug;
			if (!serviceSlug) return groupsByService;

			groupsByService[serviceSlug] ??= [];
			groupsByService[serviceSlug].push({
				id: group.id,
				service_slug: serviceSlug,
				label: group.label,
				note: group.note,
				sort_order: group.sort_order,
				is_add_on: group.is_add_on,
				rows: group.service_pricing_rows ?? [],
			});
			return groupsByService;
		},
		{},
	);
}

export async function loadServiceWithPricing(
	supabase: SupabaseClient,
	slug: string,
): Promise<ServiceData | undefined> {
	const service = getService(slug);
	if (!service) return undefined;

	const groupsByService = await loadPricingGroupsByService(supabase, [slug]);
	return mergeServicePricing(service, groupsByService[slug]);
}

export async function loadServicesWithPricing(supabase: SupabaseClient): Promise<ServiceData[]> {
	const groupsByService = await loadPricingGroupsByService(
		supabase,
		serviceList.map((service) => service.slug),
	);

	return serviceList.map((service) => mergeServicePricing(service, groupsByService[service.slug]));
}
