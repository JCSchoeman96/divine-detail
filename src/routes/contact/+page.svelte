<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
	import Clock from '@lucide/svelte/icons/clock';
	import CheckCircle from '@lucide/svelte/icons/check-circle-2';
	import Send from '@lucide/svelte/icons/send';
	import CalendarHeart from '@lucide/svelte/icons/calendar-heart';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import type { ActionData } from './$types';
	import { WHATSAPP_URL } from '$lib/config/social.js';
	import { abs_url } from '$lib/config/site.js';

	let { form }: { form: ActionData } = $props();

	let submitting = $state(false);
	let intent = $state<'inquiry' | 'booking'>('inquiry');
	let loadTime = $state(0);
	const turnstileCallbackNames = {
		success: 'contactTurnstileSuccess',
		error: 'contactTurnstileError',
		expired: 'contactTurnstileExpired',
	} as const;
	const turnstileCallbacks = {
		success(token: string) {
			console.log('[Contact Debug] Turnstile token received', {
				tokenLength: token.length,
				intent,
				timestamp: new Date().toISOString(),
			});
		},
		error(code: string) {
			console.error('[Contact Debug] Turnstile error callback', {
				code,
				intent,
				timestamp: new Date().toISOString(),
			});
		},
		expired() {
			console.warn('[Contact Debug] Turnstile token expired', {
				intent,
				timestamp: new Date().toISOString(),
			});
		},
	};

	onMount(() => {
		const windowWithCallbacks = window as unknown as Window & Record<string, unknown>;
		windowWithCallbacks[turnstileCallbackNames.success] = turnstileCallbacks.success;
		windowWithCallbacks[turnstileCallbackNames.error] = turnstileCallbacks.error;
		windowWithCallbacks[turnstileCallbackNames.expired] = turnstileCallbacks.expired;
		loadTime = Date.now();
		console.log('[Contact Debug] Contact form mounted', {
			path: window.location.pathname,
			hasTurnstile: Boolean(PUBLIC_TURNSTILE_SITE_KEY),
			siteKeyPreview: PUBLIC_TURNSTILE_SITE_KEY.slice(0, 8),
		});
	});

	const serviceOptions = [
		'Bridal Makeup',
		'Bridal Party / Bridesmaids',
		'Matric Farewell',
		'Special Occasion / Event',
		'Photo Shoot / Editorial',
		'Other',
	] as const;

	const pageUrl = abs_url('/contact');
	const socialImage = abs_url('/og-default.svg');
	const pageTitle = 'Divine Detail | Contact';
	const pageDescription =
		'Get in touch with Divine Detail for bridal, event, and matric farewell makeup in Pretoria and Gauteng. Share your date and details to check availability.';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:image" content={socialImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={socialImage} />
</svelte:head>

<!-- Page Header -->
<section class="pb-10 pt-20 sm:pt-24">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-8 h-px w-12 bg-brand"></div>
		<p class="text-sm font-medium uppercase tracking-widest text-brand">Get in touch</p>
		<h1 class="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
			Let’s chat about your date
		</h1>
		<p class="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
			Whether you’re planning a wedding, matric farewell, or special event, I’d love to hear
			what you have in mind. Send through your details and I’ll get back to you as soon as I can.
		</p>
		<p class="mt-2 max-w-lg text-sm text-muted-foreground">
			Not sure exactly what to book yet? That’s completely fine — I can help you choose.
		</p>
	</div>
</section>

<Separator />

<!-- Main Content -->
<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="grid gap-16 lg:grid-cols-[1fr_20rem] lg:gap-20">
			<!-- Left: Form -->
			<div>
				{#if form?.success}
					<!-- Success State -->
					<div class="flex flex-col items-center py-12 text-center">
						<div
							class="mb-6 flex size-16 items-center justify-center rounded-full bg-brand/10"
						>
							<CheckCircle class="size-8 text-brand" />
						</div>
						<h2
							class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
						>
							Thank <span class="heading-gradient">You</span>
						</h2>
						<p class="mx-auto mt-3 max-w-sm text-muted-foreground leading-relaxed">
							Your message has been received. I'll be in touch within 24 hours to
							discuss the details.
						</p>
						<div class="mt-6 h-px w-12 bg-brand"></div>
						<Button href="/contact" variant="outline" class="mt-8">
							Send Another Message
						</Button>
					</div>
				{:else}
					<!-- Contact Form -->
					<form
						id="GA4_Form"
						method="POST"
						use:enhance={({ formData }) => {
							submitting = true;
							formData.append('load_time', String(loadTime));
							const token = formData.get('cf-turnstile-response')?.toString() ?? '';
							console.log('[Contact Debug] Submitting form', {
								intent,
								hasToken: token.length > 0,
								tokenLength: token.length,
								hasName: Boolean(formData.get('name')),
								hasEmail: Boolean(formData.get('email')),
								timestamp: new Date().toISOString(),
							});
							return async ({ update }) => {
								await update();
								submitting = false;
								console.log('[Contact Debug] Form update completed', {
									intent,
									wasSuccess: Boolean(form?.success),
									formError: form?.errors?.form ?? null,
									timestamp: new Date().toISOString(),
								});
							};
						}}
						class="space-y-6"
						novalidate
					>
						<!-- Honeypot — visually hidden, traps bots -->
						<div class="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
							<label for="user_website">Website</label>
							<input type="text" id="user_website" name="user_website" tabindex="-1" autocomplete="off" />
						</div>

						<input type="hidden" name="intent" value={intent} />

						<!-- Intent Toggle -->
						<div class="flex items-center justify-center gap-4">
							<span
								class="font-display text-sm font-semibold tracking-tight transition-colors {intent === 'inquiry' ? 'text-brand' : 'text-muted-foreground'}"
							>
								General Inquiry
							</span>
							<button
								type="button"
								role="switch"
								aria-checked={intent === 'booking'}
								aria-label="Toggle between general inquiry and booking request"
								onclick={() => { intent = intent === 'inquiry' ? 'booking' : 'inquiry'; }}
								class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-input bg-muted transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 {intent === 'booking' ? 'bg-brand' : ''}"
							>
								<span
									class="pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-0 transition-transform {intent === 'booking' ? 'translate-x-5' : 'translate-x-0'}"
								></span>
							</button>
							<span
								class="font-display text-sm font-semibold tracking-tight transition-colors {intent === 'booking' ? 'text-brand' : 'text-muted-foreground'}"
							>
								Booking Request
							</span>
						</div>

						<!-- Name & Email Row -->
						<div class="grid gap-6 sm:grid-cols-2">
							<div class="space-y-2">
								<Label for="name">
									Name <span class="text-brand" aria-hidden="true">*</span>
								</Label>
								<Input
									id="name"
									name="name"
									type="text"
									autocomplete="name"
									placeholder="Your full name"
									required
									value={form?.values?.name ?? ''}
									aria-invalid={form?.errors?.name ? 'true' : undefined}
									aria-describedby={form?.errors?.name ? 'name-error' : undefined}
								/>
								{#if form?.errors?.name}
									<p id="name-error" class="text-sm text-destructive">
										{form.errors.name}
									</p>
								{/if}
							</div>

							<div class="space-y-2">
								<Label for="email">
									Email <span class="text-brand" aria-hidden="true">*</span>
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									autocomplete="email"
									placeholder="you@example.com"
									required
									value={form?.values?.email ?? ''}
									aria-invalid={form?.errors?.email ? 'true' : undefined}
									aria-describedby={form?.errors?.email ? 'email-error' : undefined}
								/>
								{#if form?.errors?.email}
									<p id="email-error" class="text-sm text-destructive">
										{form.errors.email}
									</p>
								{/if}
							</div>
						</div>

						<!-- Phone -->
						<div class="space-y-2">
							<Label for="phone">
								Phone Number
								{#if intent === 'booking'}
									<span class="text-brand" aria-hidden="true">*</span>
								{/if}
							</Label>
							<Input
								id="phone"
								name="phone"
								type="tel"
								autocomplete="tel"
								placeholder="+27 81 609 8157"
								required={intent === 'booking'}
								value={form?.values?.phone ?? ''}
								aria-invalid={form?.errors?.phone ? 'true' : undefined}
								aria-describedby={form?.errors?.phone ? 'phone-error' : undefined}
							/>
							{#if form?.errors?.phone}
								<p id="phone-error" class="text-sm text-destructive">
									{form.errors.phone}
								</p>
							{/if}
						</div>

						<!-- Service & Date Row -->
						<div class="grid gap-6 sm:grid-cols-2">
							<div class="space-y-2">
								<Label for="service">Service Type</Label>
								<select
									id="service"
									name="service"
									class="border-input bg-transparent text-foreground dark:bg-zinc-900 dark:text-zinc-100 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm"
								>
									<option value="" class="bg-white text-black dark:bg-zinc-900 dark:text-zinc-100">Select a service...</option>
									{#each serviceOptions as option}
										<option
											value={option}
											selected={form?.values?.service === option}
											class="bg-white text-black dark:bg-zinc-900 dark:text-zinc-100"
										>
											{option}
										</option>
									{/each}
								</select>
							</div>

							<div class="space-y-2">
								<Label for="date">Event Date</Label>
								<Input
									id="date"
									name="date"
									type="date"
									class="contact-date-input"
									value={form?.values?.date ?? ''}
								/>
								{#if form?.errors?.date}
									<p class="text-sm text-destructive">
										{form.errors.date}
									</p>
								{/if}
							</div>
						</div>

						<!-- Message -->
						<div class="space-y-2">
							<Label for="message">
								Message <span class="text-brand" aria-hidden="true">*</span>
							</Label>
							<Textarea
								id="message"
								name="message"
								placeholder="Tell me about your event, the look you're going for, and any details I should know..."
								required
								rows={5}
								class="min-h-32 resize-y"
								value={form?.values?.message ?? ''}
								aria-invalid={form?.errors?.message ? 'true' : undefined}
								aria-describedby={form?.errors?.message ? 'message-error' : undefined}
							/>
							{#if form?.errors?.message}
								<p id="message-error" class="text-sm text-destructive">
									{form.errors.message}
								</p>
							{/if}
						</div>

						<!-- Turnstile -->
						<div
							class="cf-turnstile"
							data-sitekey={PUBLIC_TURNSTILE_SITE_KEY}
							data-callback={turnstileCallbackNames.success}
							data-error-callback={turnstileCallbackNames.error}
							data-expired-callback={turnstileCallbackNames.expired}
						></div>

						{#if form?.errors?.form}
							<p class="text-sm text-destructive">{form.errors.form}</p>
						{/if}

						<!-- Submit -->
						<div class="pt-2">
							<Button
								type="submit"
								size="lg"
								class="bg-brand text-brand-foreground hover:bg-brand/90"
								disabled={submitting}
							>
								{#if submitting}
									Sending...
								{:else}
									Send Message
									<Send class="size-4" />
								{/if}
							</Button>
						</div>
					</form>
				{/if}
			</div>

			<!-- Right: Contact Details Sidebar -->
			<aside class="lg:border-l lg:pl-12">
				<div class="space-y-8">
					<div>
						<h2
							class="font-display text-lg font-semibold tracking-tight"
						>
							Contact <span class="heading-gradient">Details</span>
						</h2>
						<div class="mt-1 h-px w-8 bg-brand"></div>
					</div>

					<div class="space-y-5">
						<div class="flex gap-3">
							<Mail class="mt-0.5 size-4 shrink-0 text-brand" />
							<div>
								<p class="text-sm font-medium">Email</p>
								<a
									href="mailto:megan@divinedetail.co.za"
									class="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									megan@divinedetail.co.za
								</a>
							</div>
						</div>

						<div class="flex gap-3">
							<Phone class="mt-0.5 size-4 shrink-0 text-brand" />
							<div>
								<p class="text-sm font-medium">Phone / WhatsApp</p>
								<a
									href="tel:+27816098157"
									class="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									+27 81 609 8157
								</a>
								<a
									href={WHATSAPP_URL}
									class="block text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									Message on WhatsApp
								</a>
							</div>
						</div>

						<div class="flex gap-3">
							<Clock class="mt-0.5 size-4 shrink-0 text-brand" />
							<div>
								<p class="text-sm font-medium">Response Time</p>
								<p class="text-sm text-muted-foreground">
									I aim to reply within 24 hours.
								</p>
							</div>
						</div>
					</div>

					<Separator />

					<div>
						<h2
							class="font-display text-lg font-semibold tracking-tight"
						>
							Service <span class="heading-gradient">Area</span>
						</h2>
						<div class="mt-1 h-px w-8 bg-brand"></div>
					</div>

					<div class="flex gap-3">
						<MapPin class="mt-0.5 size-4 shrink-0 text-brand" />
						<div>
							<p class="text-sm font-medium">Based in Pretoria</p>
							<p class="text-sm leading-relaxed text-muted-foreground">
								I’m based in Pretoria and work across Gauteng, including Johannesburg,
								Centurion, Midrand, and surrounding areas.
							</p>
						</div>
					</div>

					<p class="text-xs leading-relaxed text-muted-foreground/70">
						If your venue is a little further out, just send the location and I’ll
						confirm travel and availability.
					</p>
				</div>
			</aside>
		</div>
	</div>
</section>
