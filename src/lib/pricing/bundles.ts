import { bundleSavingsZar, formatZar, parsePriceToZar, sumBundleLines, zarToOfferPrice } from './money';

export type BundleItemSnapshot = {
	id: string;
	pricing_row_id: string;
	quantity: number;
	item_label: string;
	unit_price: string;
	unit_amount_zar: number;
};

export type BundleSnapshot = {
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
	items: BundleItemSnapshot[];
};

export type CatalogRowSnapshot = {
	id: string;
	price: string;
	unit_amount_zar: number;
};

export function getBundleStatus(
	bundle: Pick<BundleSnapshot, 'is_active' | 'starts_at' | 'ends_at'>,
): 'active' | 'scheduled' | 'expired' | 'off' {
	if (!bundle.is_active) return 'off';

	const now = Date.now();
	if (bundle.starts_at && Date.parse(bundle.starts_at) > now) return 'scheduled';
	if (bundle.ends_at && Date.parse(bundle.ends_at) < now) return 'expired';

	return 'active';
}

export function formatDateInput(iso: string | null): string {
	if (!iso) return '';
	return iso.slice(0, 10);
}

export function bundleHasStaleCatalogPrices(
	bundle: Pick<BundleSnapshot, 'items'>,
	catalog: Map<string, CatalogRowSnapshot>,
): boolean {
	return bundle.items.some((item) => {
		const live = catalog.get(item.pricing_row_id);
		return !live || live.unit_amount_zar !== item.unit_amount_zar || live.price !== item.unit_price;
	});
}

export function bundleOfferSchema(bundle: BundleSnapshot, url: string) {
	return {
		'@type': 'Offer',
		name: bundle.name,
		description: bundle.description ?? bundle.name,
		priceCurrency: 'ZAR',
		price: zarToOfferPrice(bundle.bundle_amount_zar),
		availability: 'https://schema.org/InStock',
		url,
	};
}

export { bundleSavingsZar, formatZar, parsePriceToZar, sumBundleLines, zarToOfferPrice };
