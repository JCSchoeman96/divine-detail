export type BundleLineInput = {
	quantity: number;
	unit_amount_zar: number;
};

/** Parse a fixed ZAR price string to whole rands. Returns null if unparsable (e.g. "From R6,650"). */
export function parsePriceToZar(value: string): number | null {
	const trimmed = value.trim();
	if (!trimmed || /^from\b/i.test(trimmed)) {
		return null;
	}

	const numeric = trimmed.replace(/[^0-9.]/g, '');
	if (!numeric) {
		return null;
	}

	const amount = Number.parseFloat(numeric);
	if (!Number.isFinite(amount) || amount < 0) {
		return null;
	}

	return Math.round(amount);
}

/** Format whole ZAR as display string, e.g. 1500 → "R1,500". */
export function formatZar(amountZar: number): string {
	return `R${amountZar.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;
}

/** Sum line totals from quantity × unit_amount_zar. */
export function sumBundleLines(items: BundleLineInput[]): number {
	return items.reduce((total, item) => total + item.quantity * item.unit_amount_zar, 0);
}

/** Savings in whole ZAR (0 if bundle is not cheaper). */
export function bundleSavingsZar(regularTotalZar: number, bundleAmountZar: number): number {
	return Math.max(0, regularTotalZar - bundleAmountZar);
}

/** Decimal price string for JSON-LD Offer schema. */
export function zarToOfferPrice(amountZar: number): string {
	return amountZar.toFixed(2);
}
