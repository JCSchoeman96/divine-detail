<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { bundleSavingsZar, formatZar } from '$lib/pricing/money';
	import type { BundleSnapshot } from '$lib/pricing/bundles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let {
		bundle,
		offerUrl = '/contact',
	}: {
		bundle: BundleSnapshot;
		offerUrl?: string;
	} = $props();

	const savingsZar = $derived(bundleSavingsZar(bundle.regular_total_zar, bundle.bundle_amount_zar));

	const validUntil = $derived(
		bundle.ends_at
			? new Date(bundle.ends_at).toLocaleDateString('en-ZA', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				})
			: null,
	);
</script>

<article class="rounded-xl border border-brand/30 bg-brand/5 p-6 sm:p-8">
	<div class="mb-4 flex flex-wrap items-center gap-2">
		<Badge class="border-transparent bg-brand text-brand-foreground">Limited offer</Badge>
		{#if savingsZar > 0}
			<Badge variant="outline" class="border-brand/40 text-brand">Save {formatZar(savingsZar)}</Badge>
		{/if}
	</div>

	<h3 class="text-xl font-semibold">{bundle.name}</h3>
	{#if bundle.description}
		<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{bundle.description}</p>
	{/if}

	<ul class="mt-4 space-y-1.5 text-sm text-muted-foreground">
		{#each bundle.items as item (item.id)}
			<li>
				{item.quantity}× {item.item_label}
				<span class="text-foreground/70">@ {item.unit_price}</span>
			</li>
		{/each}
	</ul>

	<div class="mt-5 flex flex-wrap items-baseline gap-3">
		{#if savingsZar > 0}
			<p class="text-sm text-muted-foreground line-through tabular-nums">
				{formatZar(bundle.regular_total_zar)}
			</p>
		{/if}
		<p class="text-2xl font-semibold tabular-nums text-brand">{bundle.bundle_price}</p>
	</div>

	{#if validUntil}
		<p class="mt-2 text-xs text-muted-foreground">Valid until {validUntil}</p>
	{/if}

	<div class="mt-6">
		<Button href={offerUrl} class="bg-brand text-brand-foreground hover:bg-brand/90">
			Enquire about this offer
			<ArrowRight class="size-4" />
		</Button>
	</div>
</article>
