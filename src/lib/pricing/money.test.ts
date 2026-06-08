import { describe, expect, test } from 'bun:test';
import {
	bundleSavingsZar,
	formatZar,
	parsePriceToZar,
	sumBundleLines,
	zarToOfferPrice,
} from './money';

describe('parsePriceToZar', () => {
	test('parses comma-separated rand amounts', () => {
		expect(parsePriceToZar('R1,500')).toBe(1500);
		expect(parsePriceToZar('R500')).toBe(500);
	});

	test('returns null for unparsable prices', () => {
		expect(parsePriceToZar('From R6,650')).toBeNull();
		expect(parsePriceToZar('')).toBeNull();
		expect(parsePriceToZar('TBD')).toBeNull();
	});
});

describe('formatZar', () => {
	test('formats whole rands with grouping', () => {
		expect(formatZar(1500)).toBe('R1,500');
		expect(formatZar(4000)).toBe('R4,000');
	});
});

describe('sumBundleLines', () => {
	test('sums quantity × unit price', () => {
		expect(
			sumBundleLines([
				{ quantity: 1, unit_amount_zar: 1500 },
				{ quantity: 3, unit_amount_zar: 500 },
				{ quantity: 2, unit_amount_zar: 400 },
			]),
		).toBe(3800);
	});
});

describe('bundleSavingsZar', () => {
	test('returns positive savings when bundle is cheaper', () => {
		expect(bundleSavingsZar(3800, 3400)).toBe(400);
	});

	test('returns zero when bundle is equal or more expensive', () => {
		expect(bundleSavingsZar(3800, 3800)).toBe(0);
		expect(bundleSavingsZar(3800, 4000)).toBe(0);
	});
});

describe('zarToOfferPrice', () => {
	test('formats for schema.org Offer', () => {
		expect(zarToOfferPrice(3400)).toBe('3400.00');
	});
});
