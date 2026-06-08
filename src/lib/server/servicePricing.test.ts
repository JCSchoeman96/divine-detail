import { describe, expect, test } from 'bun:test';
import type { ServiceData } from '../data/services';
import { mergeServicePricing } from './servicePricing';

const baseService: ServiceData = {
	slug: 'bridal-makeup',
	title: 'Bridal Makeup',
	shortTitle: 'Bridal Makeup',
	metaTitle: 'Bridal Makeup Artist Pretoria | Divine Detail',
	metaDescription: 'Bridal makeup artist in Pretoria.',
	heroDescription: 'A calm bridal makeup experience.',
	icon: 'gem',
	included: [],
	excluded: [],
	process: [],
	audience: { description: '', items: [] },
	pricing: [
		{
			label: 'Original Bridal',
			rows: [{ item: 'Original Bridal Makeup', price: 'R1,500' }],
		},
	],
	addOns: [{ item: 'Original Lash Application', price: 'R50' }],
	faq: [],
	relatedSlugs: [],
};

describe('mergeServicePricing', () => {
	test('keeps the static service pricing when no database groups exist', () => {
		const service = mergeServicePricing(baseService, []);

		expect(service.pricing).toEqual(baseService.pricing);
		expect(service.addOns).toEqual(baseService.addOns);
		expect(service).not.toBe(baseService);
	});

	test('replaces pricing and add-ons with sorted database groups', () => {
		const service = mergeServicePricing(baseService, [
			{
				id: 'addons',
				label: 'Add-ons',
				note: null,
				sort_order: 99,
				is_add_on: true,
				rows: [
					{ id: 'lash', item: 'Lash Application', price: 'R75', sort_order: 20 },
					{ id: 'travel', item: 'Travel Fee', price: 'Quoted', sort_order: 10 },
				],
			},
			{
				id: 'party',
				label: 'Wedding Party',
				note: 'Final price depends on the group.',
				sort_order: 20,
				is_add_on: false,
				rows: [{ id: 'bridesmaid', item: 'Bridesmaid Makeup', price: 'R550', sort_order: 10 }],
			},
			{
				id: 'bridal',
				label: 'Bridal',
				note: null,
				sort_order: 10,
				is_add_on: false,
				rows: [{ id: 'bride', item: 'Bridal Makeup', price: 'R1,650', sort_order: 10 }],
			},
		]);

		expect(service.pricing).toEqual([
			{
				label: 'Bridal',
				rows: [{ item: 'Bridal Makeup', price: 'R1,650' }],
			},
			{
				label: 'Wedding Party',
				note: 'Final price depends on the group.',
				rows: [{ item: 'Bridesmaid Makeup', price: 'R550' }],
			},
		]);
		expect(service.addOns).toEqual([
			{ item: 'Travel Fee', price: 'Quoted' },
			{ item: 'Lash Application', price: 'R75' },
		]);
	});
});
