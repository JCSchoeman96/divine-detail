<script lang="ts">
	let { data, form } = $props();

	const selectedService = $derived(
		data.services.find((service) => service.slug === data.selectedServiceSlug) ?? data.services[0],
	);
</script>

<div class="space-y-6">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div>
			<h2 class="text-xl font-semibold">Pricing editor</h2>
			<p class="text-sm text-muted-foreground">
				Changes publish to the public service pages when saved.
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

	<form method="GET" class="grid gap-3 rounded-lg border p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
		<div class="space-y-1">
			<label for="service" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
				Service
			</label>
			<select
				id="service"
				name="service"
				class="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
			>
				{#each data.services as service}
					<option value={service.slug} selected={service.slug === data.selectedServiceSlug}>
						{service.title}
					</option>
				{/each}
			</select>
		</div>
		<div class="flex items-end">
			<button
				type="submit"
				class="bg-brand text-brand-foreground hover:bg-brand/90 inline-flex h-9 items-center rounded-md px-3 text-sm"
			>
				Load service
			</button>
		</div>
	</form>

	{#if data.loadError}
		<p class="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
			{data.loadError}
		</p>
	{/if}
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

	<div class="rounded-lg border p-4">
		<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
			<div>
				<h3 class="font-semibold">{selectedService?.title ?? 'Selected service'}</h3>
				<p class="text-sm text-muted-foreground">{data.groups.length} pricing groups</p>
			</div>
			<a
				href={`/services/${data.selectedServiceSlug}`}
				class="border-input bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-3 text-sm"
			>
				View public page
			</a>
		</div>

		<form method="POST" action="?/createGroup" class="grid gap-3 border-t pt-4 sm:grid-cols-5">
			<input type="hidden" name="service_slug" value={data.selectedServiceSlug} />
			<div class="space-y-1 sm:col-span-2">
				<label for="new-label" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					New group
				</label>
				<input
					id="new-label"
					name="label"
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					placeholder="Package name"
				/>
			</div>
			<div class="space-y-1 sm:col-span-2">
				<label for="new-note" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
					Note
				</label>
				<input
					id="new-note"
					name="note"
					class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
					placeholder="Optional"
				/>
			</div>
			<div class="flex flex-wrap items-end gap-2">
				<label class="flex h-9 items-center gap-2 text-sm">
					<input type="checkbox" name="is_add_on" value="true" class="size-4 rounded border-input" />
					Add-on
				</label>
				<button
					type="submit"
					class="bg-brand text-brand-foreground hover:bg-brand/90 inline-flex h-9 items-center rounded-md px-3 text-sm"
				>
					Add
				</button>
			</div>
		</form>
	</div>

	{#if data.groups.length === 0}
		<p class="rounded-md border p-6 text-sm text-muted-foreground">
			No editable pricing exists for this service yet. Add a group to start.
		</p>
	{:else}
		<div class="space-y-4">
			{#each data.groups as group (group.id)}
				<section class="rounded-lg border p-4">
					<div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
						<form method="POST" action="?/updateGroup" class="grid gap-3 sm:grid-cols-5">
							<input type="hidden" name="id" value={group.id} />
							<div class="space-y-1 sm:col-span-2">
								<label
									for={`group-label-${group.id}`}
									class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
								>
									Group label
								</label>
								<input
									id={`group-label-${group.id}`}
									name="label"
									value={group.label}
									class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
								/>
							</div>
							<div class="space-y-1 sm:col-span-2">
								<label
									for={`group-note-${group.id}`}
									class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
								>
									Note
								</label>
								<input
									id={`group-note-${group.id}`}
									name="note"
									value={group.note ?? ''}
									class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
								/>
							</div>
							<div class="flex flex-wrap items-end gap-2">
								<label class="flex h-9 items-center gap-2 text-sm">
									<input
										type="checkbox"
										name="is_add_on"
										value="true"
										checked={group.is_add_on}
										class="size-4 rounded border-input"
									/>
									Add-on
								</label>
								<button
									type="submit"
									class="border-input bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-3 text-sm"
								>
									Save
								</button>
							</div>
						</form>

						<form method="POST" action="?/deleteGroup" class="flex items-end">
							<input type="hidden" name="id" value={group.id} />
							<button
								type="submit"
								class="border-destructive/50 text-destructive hover:bg-destructive/10 inline-flex h-9 items-center rounded-md border px-3 text-sm"
							>
								Delete group
							</button>
						</form>
					</div>

					<div class="mt-4 space-y-2">
						{#each group.service_pricing_rows ?? [] as row (row.id)}
							<form method="POST" action="?/updateRow" class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px_auto]">
								<input type="hidden" name="id" value={row.id} />
								<input
									name="item"
									value={row.item}
									aria-label="Pricing item"
									class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
								/>
								<input
									name="price"
									value={row.price}
									aria-label="Price"
									class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
								/>
								<div class="flex gap-2">
									<button
										type="submit"
										class="border-input bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-3 text-sm"
									>
										Save
									</button>
									<button
										type="submit"
										formaction="?/deleteRow"
										class="border-destructive/50 text-destructive hover:bg-destructive/10 inline-flex h-9 items-center rounded-md border px-3 text-sm"
									>
										Delete
									</button>
								</div>
							</form>
						{/each}
					</div>

					<form method="POST" action="?/createRow" class="mt-4 grid gap-2 border-t pt-4 sm:grid-cols-[minmax(0,1fr)_160px_auto]">
						<input type="hidden" name="group_id" value={group.id} />
						<input
							name="item"
							aria-label="New pricing item"
							class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
							placeholder="New item"
						/>
						<input
							name="price"
							aria-label="New price"
							class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
							placeholder="R0"
						/>
						<button
							type="submit"
							class="bg-brand text-brand-foreground hover:bg-brand/90 inline-flex h-9 items-center justify-center rounded-md px-3 text-sm"
						>
							Add row
						</button>
					</form>
				</section>
			{/each}
		</div>
	{/if}
</div>
