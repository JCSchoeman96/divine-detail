import { describe, expect, test } from 'bun:test';
import { compareCatalogRows, getServiceSortRank } from './serviceOrder';

describe('getServiceSortRank', () => {
	test('ranks makeup before hair', () => {
		expect(getServiceSortRank('bridal-makeup')).toBeLessThan(getServiceSortRank('bridal-hair'));
	});
});

describe('compareCatalogRows', () => {
	test('lists bridal makeup before bridal hair regardless of item name', () => {
		const makeup = {
			service_slug: 'bridal-makeup',
			is_add_on: false,
			sort_order: 100,
			group_label: 'Bridal',
			item: 'Bridal Makeup',
		};
		const hair = {
			service_slug: 'bridal-hair',
			is_add_on: false,
			sort_order: 0,
			group_label: 'Styling',
			item: 'Upstyle (long hair)',
		};

		expect(compareCatalogRows(makeup, hair)).toBeLessThan(0);
	});
});
