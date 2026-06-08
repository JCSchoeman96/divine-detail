<script lang="ts">
	import {
		bundleHasStaleCatalogPrices,
		bundleSavingsZar,
		formatDateInput,
		formatZar,
		getBundleStatus,
		parsePriceToZar,
		sumBundleLines,
	} from '$lib/pricing/bundles';
	import type { PricingCatalogGroup, BundleRecord, PricingCatalogRow } from '$lib/server/pricingBundles';

	let { data, form } = $props();

	let quantities = $state<Record<string, number>>({});
	let bundlePrice = $state('');
	let bundleName = $state('');
	let bundleDescription = $state('');
	let showOnHomepage = $state(false);
	let selectedSlugs = $state<Set<string>>(new Set());
	let startsAt = $state('');
	let endsAt = $state('');
	let isActive = $state(true);
	let sortOrder = $state(0);

	const initFromEditing = (bundle: BundleRecord | null) => {
		const nextQuantities: Record<string, number> = {};
		for (const group of data.catalog as PricingCatalogGroup[]) {
			for (const row of group.rows) {
				nextQuantities[row.id] = 0;
			}
		}

		if (bundle) {
			for (const item of bundle.items) {
				nextQuantities[item.pricing_row_id] = item.quantity;
			}
			bundlePrice = bundle.bundle_price;
			bundleName = bundle.name;
			bundleDescription = bundle.description ?? '';
			showOnHomepage = bundle.show_on_homepage;
			selectedSlugs = new Set(bundle.service_slugs);
			startsAt = formatDateInput(bundle.starts_at);
			endsAt = formatDateInput(bundle.ends_at);
			isActive = bundle.is_active;
			sortOrder = bundle.sort_order;
		} else {
			bundlePrice = '';
			bundleName = '';
			bundleDescription = '';
			showOnHomepage = false;
			selectedSlugs = new Set();
			startsAt = '';
			endsAt = '';
			isActive = true;
			sortOrder = 0;
		}

		quantities = nextQuantities;
	};

	let lastEditKey = $state<string | null>(null);

	$effect(() => {
		const editKey = data.editing?.id ?? '__new__';
		if (lastEditKey === editKey) return;
		lastEditKey = editKey;
		initFromEditing(data.editing);
	});

	const catalogMap = $derived(new Map(Object.entries(data.catalogMap) as [string, PricingCatalogRow][]));

	const selectedLines = $derived(
		Object.entries(quantities)
			.filter(([, quantity]) => quantity >= 1)
			.map(([pricingRowId, quantity]) => {
				const row = catalogMap.get(pricingRowId);
				if (!row) return null;
				return { row, quantity };
			})
			.filter(Boolean) as { row: PricingCatalogRow; quantity: number }[],
	);

	const regularTotalZar = $derived(
		sumBundleLines(
			selectedLines.map(({ row, quantity }) => ({
				quantity,
				unit_amount_zar: row.unit_amount_zar,
			})),
		),
	);

	const bundleAmountZar = $derived(parsePriceToZar(bundlePrice));
	const savingsZar = $derived(
		bundleAmountZar === null ? 0 : bundleSavingsZar(regularTotalZar, bundleAmountZar),
	);

	const defaultSlugs = $derived([...new Set(selectedLines.map(({ row }) => row.service_slug))]);

	const toggleSlug = (slug: string, checked: boolean) => {
		const next = new Set(selectedSlugs);
		if (checked) next.add(slug);
		else next.delete(slug);
		selectedSlugs = next;
	};

	const applyDefaultSlugs = () => {
		selectedSlugs = new Set(defaultSlugs);
	};

	const statusLabel: Record<string, string> = {
		active: 'Active',
		scheduled: 'Scheduled',
		expired: 'Expired',
		off: 'Off',
	};
</script>

<div class="space-y-6">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div>
			<h2 class="text-xl font-semibold">Bundle generator</h2>
			<p class="text-sm text-muted-foreground">
				Compose packages from existing pricing rows, set a special price, and publish limited offers.
			</p>
		</div>
		<form method="POST" action="?/signout">
			<button
				type="submit"
				class="border-input bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-3 text-sm"
			>
				Sign out
			</button>
		</form>
	</div>

	{#if form?.actionError}
		<p class="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
			{form.actionError}
		</p>
	{/if}
	{#if form?.actionSuccess}
		<p class="rounded-md border border-brand/30 bg-brand/10 p-3 text-sm text-brand">
			{form.actionSuccess}
		</p>
	{/if}

	{#if data.editing && bundleHasStaleCatalogPrices(data.editing, catalogMap)}
		<p class="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-100">
			Catalog prices changed since this bundle was saved. Regular total on save was
			{formatZar(data.editing.regular_total_zar)}. Re-save to refresh snapshots.
		</p>
	{/if}

	<form
		method="POST"
		action={data.editing ? '?/updateBundle' : '?/createBundle'}
		class="space-y-6 rounded-lg border p-4"
	>
		{#if data.editing}
			<input type="hidden" name="id" value={data.editing.id} />
		{/if}
		<input type="hidden" name="sort_order" value={sortOrder} />
		<input type="hidden" name="is_active" value={isActive ? 'true' : 'false'} />

		<div class="grid gap-4 sm:grid-cols-2">
			<div class="space-y-1 sm:col-span-2">
				<label for="name" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Bundle name
				</label>
				<input
					id="name"
					name="name"
					bind:value={bundleName}
					required
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					placeholder="Bridal party makeup special"
				/>
			</div>
			<div class="space-y-1 sm:col-span-2">
				<label for="description" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Description
				</label>
				<textarea
					id="description"
					name="description"
					bind:value={bundleDescription}
					rows="2"
					class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
					placeholder="Optional short description for the public offer card"
				></textarea>
			</div>
			<div class="space-y-1">
				<label for="bundle_price" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Bundle price
				</label>
				<input
					id="bundle_price"
					name="bundle_price"
					bind:value={bundlePrice}
					required
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					placeholder="R4,000"
				/>
			</div>
			<div class="space-y-1">
				<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Regular total</p>
				<p class="flex h-9 items-center text-sm font-semibold tabular-nums">{formatZar(regularTotalZar)}</p>
				{#if savingsZar > 0}
					<p class="text-xs font-medium text-brand">Save {formatZar(savingsZar)}</p>
				{:else if bundleAmountZar !== null && regularTotalZar > 0}
					<p class="text-xs text-muted-foreground">Package price (no discount shown)</p>
				{/if}
			</div>
			<div class="space-y-1">
				<label for="starts_at" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Start date (optional)
				</label>
				<input
					id="starts_at"
					name="starts_at"
					type="date"
					bind:value={startsAt}
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
				/>
			</div>
			<div class="space-y-1">
				<label for="ends_at" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					End date (optional)
				</label>
				<input
					id="ends_at"
					name="ends_at"
					type="date"
					bind:value={endsAt}
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
				/>
			</div>
		</div>

		<div class="space-y-3 border-t pt-4">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<p class="text-sm font-medium">Catalog items</p>
				<p class="text-xs text-muted-foreground">Fixed-price rows only. Set quantity to 0 to exclude.</p>
			</div>

			<div class="space-y-4">
				{#each data.catalog as group (group.service_slug + group.group_label + group.is_add_on)}
					<section class="rounded-md border p-3">
						<p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{group.service_title} · {group.group_label}{group.is_add_on ? ' (add-on)' : ''}
						</p>
						<div class="mt-2 space-y-2">
							{#each group.rows as row (row.id)}
								<div class="flex flex-wrap items-center justify-between gap-2 text-sm">
									<div>
										<p>{row.item}</p>
										<p class="text-xs text-muted-foreground">{row.price}</p>
									</div>
									<label class="flex items-center gap-2">
										<span class="text-xs text-muted-foreground">Qty</span>
										<input
											type="number"
											name="qty_{row.id}"
											min="0"
											bind:value={quantities[row.id]}
											class="border-input bg-background h-8 w-20 rounded-md border px-2 text-sm"
										/>
									</label>
								</div>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</div>

		<div class="space-y-3 border-t pt-4">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<p class="text-sm font-medium">Visibility</p>
				<button
					type="button"
					class="text-xs text-brand hover:underline"
					onclick={applyDefaultSlugs}
				>
					Use services from selected items
				</button>
			</div>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" name="show_on_homepage" bind:checked={showOnHomepage} class="size-4 rounded border-input" />
				Show on homepage
			</label>
			<div class="grid gap-2 sm:grid-cols-2">
				{#each data.services as service (service.slug)}
					<label class="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							name="service_slugs"
							value={service.slug}
							checked={selectedSlugs.has(service.slug)}
							onchange={(event) =>
								toggleSlug(service.slug, (event.currentTarget as HTMLInputElement).checked)}
							class="size-4 rounded border-input"
						/>
						{service.title}
					</label>
				{/each}
			</div>
		</div>

		<div class="flex flex-wrap gap-2 border-t pt-4">
			<button
				type="submit"
				class="bg-brand text-brand-foreground hover:bg-brand/90 inline-flex h-9 items-center rounded-md px-4 text-sm"
			>
				{data.editing ? 'Save bundle' : 'Create bundle'}
			</button>
			{#if data.editing}
				<a
					href="/admin/bundles"
					class="border-input bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-4 text-sm"
				>
					New bundle
				</a>
			{/if}
		</div>
	</form>

	<div class="space-y-3">
		<h3 class="text-lg font-semibold">Saved bundles</h3>
		{#if data.bundles.length === 0}
			<p class="rounded-md border p-4 text-sm text-muted-foreground">No bundles yet.</p>
		{:else}
			<div class="space-y-3">
				{#each data.bundles as bundle (bundle.id)}
					{@const status = getBundleStatus(bundle)}
					<section class="rounded-lg border p-4">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<div class="flex flex-wrap items-center gap-2">
									<h4 class="font-medium">{bundle.name}</h4>
									<span class="rounded-full bg-muted px-2 py-0.5 text-xs">{statusLabel[status]}</span>
								</div>
								<p class="mt-1 text-sm text-muted-foreground">
									{bundle.bundle_price}
									{#if bundle.regular_total_zar > bundle.bundle_amount_zar}
										· Save {formatZar(bundle.regular_total_zar - bundle.bundle_amount_zar)}
									{/if}
									· {bundle.items.length} line items
								</p>
							</div>
							<div class="flex flex-wrap gap-2">
								<a
									href="/admin/bundles?edit={bundle.id}"
									class="border-input bg-background hover:bg-accent inline-flex h-8 items-center rounded-md border px-3 text-xs"
								>
									Edit
								</a>
								<form method="POST" action="?/duplicateBundle">
									<input type="hidden" name="id" value={bundle.id} />
									<button
										type="submit"
										class="border-input bg-background hover:bg-accent inline-flex h-8 items-center rounded-md border px-3 text-xs"
									>
										Duplicate
									</button>
								</form>
								<form method="POST" action="?/toggleActive">
									<input type="hidden" name="id" value={bundle.id} />
									<input type="hidden" name="is_active" value={bundle.is_active ? 'false' : 'true'} />
									<button
										type="submit"
										class="border-input bg-background hover:bg-accent inline-flex h-8 items-center rounded-md border px-3 text-xs"
									>
										{bundle.is_active ? 'Deactivate' : 'Activate'}
									</button>
								</form>
								<form method="POST" action="?/deleteBundle">
									<input type="hidden" name="id" value={bundle.id} />
									<button
										type="submit"
										class="border-destructive/50 text-destructive hover:bg-destructive/10 inline-flex h-8 items-center rounded-md border px-3 text-xs"
									>
										Delete
									</button>
								</form>
							</div>
						</div>
					</section>
				{/each}
			</div>
		{/if}
	</div>
</div>
