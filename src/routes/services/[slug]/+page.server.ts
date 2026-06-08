import { error } from '@sveltejs/kit';
import { serviceList } from '$lib/data/services';
import { loadActiveBundles } from '$lib/server/pricingBundles';
import { loadServiceWithPricing } from '$lib/server/servicePricing';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const service = await loadServiceWithPricing(locals.supabase, params.slug);
	if (!service) {
		error(404, { message: 'Service not found' });
	}

	const bundles = await loadActiveBundles(locals.supabase, { serviceSlug: params.slug });

	return { service, bundles };
};

export const entries = () => {
	return serviceList.map((service) => ({ slug: service.slug }));
};
