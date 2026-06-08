/** Lower rank = listed earlier. Makeup services first, hair styling last. */
const SERVICE_SORT_RANK: Record<string, number> = {
	'bridal-makeup': 10,
	'special-events': 20,
	'matric-farewell': 30,
	'wedding-packages': 40,
	'bridal-hair-and-makeup': 50,
	'bridal-hair': 100,
};

const DEFAULT_SERVICE_RANK = 60;

export function getServiceSortRank(serviceSlug: string): number {
	return SERVICE_SORT_RANK[serviceSlug] ?? DEFAULT_SERVICE_RANK;
}

export type CatalogRowSortable = {
	service_slug: string;
	is_add_on: boolean;
	sort_order: number;
	group_label: string;
	item: string;
};

export function compareCatalogRows(a: CatalogRowSortable, b: CatalogRowSortable): number {
	const rankCompare = getServiceSortRank(a.service_slug) - getServiceSortRank(b.service_slug);
	if (rankCompare !== 0) return rankCompare;

	if (a.is_add_on !== b.is_add_on) return a.is_add_on ? 1 : -1;

	const groupCompare = a.group_label.localeCompare(b.group_label);
	if (groupCompare !== 0) return groupCompare;

	const sortCompare = a.sort_order - b.sort_order;
	if (sortCompare !== 0) return sortCompare;

	return a.item.localeCompare(b.item);
}

export type BundleItemSortable = {
	pricing_row_id: string;
	sort_order: number;
	item_label: string;
};

export function compareBundleItems(
	a: BundleItemSortable,
	b: BundleItemSortable,
	catalog: Map<string, CatalogRowSortable>,
): number {
	const rowA = catalog.get(a.pricing_row_id);
	const rowB = catalog.get(b.pricing_row_id);

	if (rowA && rowB) {
		return compareCatalogRows(rowA, rowB);
	}

	return a.sort_order - b.sort_order;
}

export function sortCatalogGroups<T extends { service_slug: string; is_add_on: boolean; group_label: string; rows: CatalogRowSortable[] }>(
	groups: T[],
): T[] {
	return [...groups]
		.sort((a, b) => {
			const rankCompare = getServiceSortRank(a.service_slug) - getServiceSortRank(b.service_slug);
			if (rankCompare !== 0) return rankCompare;
			if (a.is_add_on !== b.is_add_on) return a.is_add_on ? 1 : -1;
			return a.group_label.localeCompare(b.group_label);
		})
		.map((group) => ({
			...group,
			rows: [...group.rows].sort(compareCatalogRows),
		}));
}
