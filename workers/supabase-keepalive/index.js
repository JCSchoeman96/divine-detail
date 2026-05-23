const KEEPALIVE_PATH = '/rest/v1/keepalive?select=id&limit=1';

function getSupabaseConfig(env) {
	const supabaseUrl = env.SUPABASE_URL || env.PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
	if (!supabaseAnonKey) throw new Error('Missing SUPABASE_ANON_KEY');

	return {
		supabaseUrl: supabaseUrl.replace(/\/$/, ''),
		supabaseAnonKey,
	};
}

export function buildKeepaliveRequest(env) {
	const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig(env);

	return new Request(`${supabaseUrl}${KEEPALIVE_PATH}`, {
		method: 'GET',
		headers: {
			apikey: supabaseAnonKey,
			Authorization: `Bearer ${supabaseAnonKey}`,
			Accept: 'application/json',
		},
	});
}

export async function pingSupabase(env, fetcher = fetch) {
	const request = buildKeepaliveRequest(env);
	const response = await fetcher(request);

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Supabase keepalive failed: ${response.status} ${text}`);
	}
}

export default {
	async scheduled(controller, env, ctx) {
		await pingSupabase(env);
		console.log(
			JSON.stringify({
				event: 'supabase_keepalive',
				cron: controller.cron,
				status: 'ok',
				scheduledTime: controller.scheduledTime,
			}),
		);
	},

	async fetch() {
		return new Response('OK', {
			status: 200,
			headers: { 'content-type': 'text/plain; charset=utf-8' },
		});
	},
};
