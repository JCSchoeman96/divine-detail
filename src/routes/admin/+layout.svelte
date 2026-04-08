<script lang="ts">
	let { children, data } = $props();
</script>

<section class="mx-auto max-w-6xl px-4 py-10">
	<div class="mb-8 flex items-center justify-between border-b pb-4">
		<div>
			<p class="text-xs uppercase tracking-wide text-muted-foreground">Divine Detail Admin</p>
			<h1 class="text-2xl font-semibold">Submissions Backend</h1>
		</div>
		{#if data?.admin?.email}
			<p class="text-sm text-muted-foreground">{data.admin.email}</p>
		{/if}
	</div>

	{@render children()}
</section>
