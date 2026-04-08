<script lang="ts">
	let { data, form } = $props();

	const totalPages = $derived(Math.max(Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 20)), 1));
	const previousPage = $derived(Math.max((data?.page ?? 1) - 1, 1));
	const nextPage = $derived(Math.min((data?.page ?? 1) + 1, totalPages));

	const queryWithPage = (page: number) => {
		const params = new URLSearchParams();
		params.set('page', String(page));
		if (data?.filters?.intent && data.filters.intent !== 'all') params.set('intent', data.filters.intent);
		if (data?.filters?.status && data.filters.status !== 'all') params.set('status', data.filters.status);
		if (data?.filters?.email) params.set('email', data.filters.email);
		return `/admin/submissions?${params.toString()}`;
	};
</script>

<div class="space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h2 class="text-xl font-semibold">Contact submissions</h2>
			<p class="text-sm text-muted-foreground">
				{data.total} total records
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

	<form method="GET" class="grid gap-3 rounded-lg border p-4 sm:grid-cols-4">
		<div class="space-y-1">
			<label for="intent" class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
				>Intent</label
			>
			<select
				id="intent"
				name="intent"
				class="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
			>
				<option value="all" selected={data.filters.intent === 'all'}>All</option>
				<option value="inquiry" selected={data.filters.intent === 'inquiry'}>Inquiry</option>
				<option value="booking" selected={data.filters.intent === 'booking'}>Booking</option>
			</select>
		</div>
		<div class="space-y-1">
			<label for="status" class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
				>Status</label
			>
			<select
				id="status"
				name="status"
				class="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
			>
				<option value="all" selected={data.filters.status === 'all'}>All</option>
				<option value="received" selected={data.filters.status === 'received'}>Received</option>
				<option value="processed" selected={data.filters.status === 'processed'}>Processed</option>
				<option value="sendpulse_failed" selected={data.filters.status === 'sendpulse_failed'}>SendPulse Failed</option>
				<option
					value="sendpulse_unconfigured"
					selected={data.filters.status === 'sendpulse_unconfigured'}
				>
					SendPulse Unconfigured
				</option>
			</select>
		</div>
		<div class="space-y-1 sm:col-span-2">
			<label for="email" class="text-xs font-medium uppercase tracking-wide text-muted-foreground"
				>Email contains</label
			>
			<input
				id="email"
				name="email"
				type="text"
				value={data.filters.email}
				class="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
				placeholder="example@domain.com"
			/>
		</div>
		<div class="sm:col-span-4">
			<button
				type="submit"
				class="bg-brand text-brand-foreground hover:bg-brand/90 inline-flex h-9 items-center rounded-md px-3 text-sm"
			>
				Apply filters
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

	{#if data.items.length === 0}
		<p class="rounded-md border p-6 text-sm text-muted-foreground">
			No submissions match your filters.
		</p>
	{:else}
		<div class="space-y-4">
			{#each data.items as item (item.id)}
				<article class="space-y-3 rounded-lg border p-4">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<div>
							<p class="text-sm font-semibold">{item.name} <span class="font-normal text-muted-foreground">({item.email})</span></p>
							<p class="text-xs uppercase tracking-wide text-muted-foreground">
								{item.intent} | {item.created_at ? new Date(item.created_at).toLocaleString() : 'n/a'}
							</p>
						</div>
						<form method="POST" action="?/updateStatus" class="flex items-center gap-2">
							<input type="hidden" name="id" value={item.id} />
							<select
								name="status"
								class="border-input bg-background h-8 rounded-md border px-2 text-xs"
							>
								<option value="received" selected={item.status === 'received'}>Received</option>
								<option value="processed" selected={item.status === 'processed'}>Processed</option>
								<option value="sendpulse_failed" selected={item.status === 'sendpulse_failed'}>
									SendPulse Failed
								</option>
								<option
									value="sendpulse_unconfigured"
									selected={item.status === 'sendpulse_unconfigured'}
								>
									SendPulse Unconfigured
								</option>
							</select>
							<button
								type="submit"
								class="border-input bg-background hover:bg-accent inline-flex h-8 items-center rounded-md border px-2 text-xs"
							>
								Save
							</button>
						</form>
					</div>
					<div class="grid gap-2 text-sm sm:grid-cols-2">
						<p><span class="font-medium">Phone:</span> {item.phone ?? 'n/a'}</p>
						<p><span class="font-medium">Service:</span> {item.service ?? 'n/a'}</p>
						<p><span class="font-medium">Event date:</span> {item.event_date ?? 'n/a'}</p>
						<p><span class="font-medium">Venue:</span> {item.venue ?? 'n/a'}</p>
						<p><span class="font-medium">SendPulse status:</span> {item.sendpulse_status ?? 'n/a'}</p>
						<p><span class="font-medium">SendPulse error:</span> {item.sendpulse_error ?? 'none'}</p>
					</div>
					<div class="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">
						{item.message}
					</div>
				</article>
			{/each}
		</div>
	{/if}

	<div class="flex items-center justify-between border-t pt-4">
		<a
			href={data.page <= 1 ? undefined : queryWithPage(previousPage)}
			class="border-input bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-3 text-sm {data.page <= 1 ? 'pointer-events-none opacity-50' : ''}"
			aria-disabled={data.page <= 1}
			tabindex={data.page <= 1 ? -1 : 0}
		>
			Previous
		</a>
		<p class="text-sm text-muted-foreground">Page {data.page} of {totalPages}</p>
		<a
			href={data.page >= totalPages ? undefined : queryWithPage(nextPage)}
			class="border-input bg-background hover:bg-accent inline-flex h-9 items-center rounded-md border px-3 text-sm {data.page >= totalPages ? 'pointer-events-none opacity-50' : ''}"
			aria-disabled={data.page >= totalPages}
			tabindex={data.page >= totalPages ? -1 : 0}
		>
			Next
		</a>
	</div>
</div>
