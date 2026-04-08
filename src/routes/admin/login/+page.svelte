<script lang="ts">
	let { data, form } = $props();
</script>

<div class="mx-auto max-w-md rounded-lg border p-6">
	<h2 class="mb-1 text-xl font-semibold">Admin login</h2>
	<p class="mb-6 text-sm text-muted-foreground">
		Sign in with your admin account to access submissions.
	</p>

	{#if data?.reason === 'unauthorized'}
		<p class="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
			Your account is not assigned as an admin user.
		</p>
	{/if}

	{#if form?.error}
		<p class="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
			{form.error}
		</p>
	{/if}

	<form method="POST" class="space-y-4">
		<input type="hidden" name="next" value={data?.next ?? '/admin/submissions'} />
		<div class="space-y-2">
			<label for="email" class="text-sm font-medium">Email</label>
			<input
				id="email"
				name="email"
				type="email"
				required
				autocomplete="email"
				value={form?.values?.email ?? ''}
				class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2"
			/>
		</div>
		<div class="space-y-2">
			<label for="password" class="text-sm font-medium">Password</label>
			<input
				id="password"
				name="password"
				type="password"
				required
				autocomplete="current-password"
				class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2"
			/>
		</div>
		<button
			type="submit"
			class="bg-brand text-brand-foreground hover:bg-brand/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
		>
			Sign in
		</button>
	</form>
</div>
