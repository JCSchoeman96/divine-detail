<script lang="ts">
	import { page } from '$app/state';

	let { children, data } = $props();

	const navItems = [
		{ href: '/admin/submissions', label: 'Submissions' },
		{ href: '/admin/pricing', label: 'Pricing' },
		{ href: '/admin/bundles', label: 'Bundles' },
	];
</script>

<section class="mx-auto max-w-6xl px-4 py-10">
	<div class="mb-8 space-y-4 border-b pb-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Divine Detail Admin</p>
				<h1 class="text-2xl font-semibold">Admin Dashboard</h1>
			</div>
			{#if data?.admin?.email}
				<p class="text-sm text-muted-foreground">{data.admin.email}</p>
			{/if}
		</div>
		{#if data?.admin?.email}
			<div>
				<nav class="flex flex-wrap gap-2" aria-label="Admin sections">
					{#each navItems as item}
						<a
							href={item.href}
							class="border-input inline-flex h-9 items-center rounded-md border px-3 text-sm {page.url.pathname.startsWith(item.href)
								? 'bg-brand text-brand-foreground'
								: 'bg-background hover:bg-accent'}"
						>
							{item.label}
						</a>
					{/each}
				</nav>
			</div>
		{/if}
	</div>

	{@render children()}
</section>
