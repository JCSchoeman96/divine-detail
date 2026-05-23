import { describe, expect, test } from 'bun:test';
import { buildKeepaliveRequest, pingSupabase } from './index.js';

describe('buildKeepaliveRequest', () => {
	test('builds a tiny Supabase REST read with auth headers', () => {
		const request = buildKeepaliveRequest({
			SUPABASE_URL: 'https://example.supabase.co',
			SUPABASE_ANON_KEY: 'sb_publishable_test',
		});

		expect(request.url).toBe('https://example.supabase.co/rest/v1/keepalive?select=id&limit=1');
		expect(request.headers.get('apikey')).toBe('sb_publishable_test');
		expect(request.headers.get('authorization')).toBe('Bearer sb_publishable_test');
		expect(request.headers.get('accept')).toBe('application/json');
	});
});

describe('pingSupabase', () => {
	test('throws a useful error when Supabase returns a non-OK response', async () => {
		const fetcher = async () => new Response('missing table', { status: 404 });

		await expect(
			pingSupabase(
				{
					SUPABASE_URL: 'https://example.supabase.co',
					SUPABASE_ANON_KEY: 'sb_publishable_test',
				},
				fetcher,
			),
		).rejects.toThrow('Supabase keepalive failed: 404 missing table');
	});
});
