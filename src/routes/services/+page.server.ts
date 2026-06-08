import { loadServicesWithPricing } from '$lib/server/servicePricing';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const services = await loadServicesWithPricing(locals.supabase);

	return {
		services: services.map((service) => ({
			slug: service.slug,
			pricing: service.pricing,
		})),
	};
};
