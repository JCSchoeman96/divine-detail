import { loadActiveBundles } from '$lib/server/pricingBundles';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const bundles = await loadActiveBundles(locals.supabase, { homepage: true });

	return { bundles };
};
