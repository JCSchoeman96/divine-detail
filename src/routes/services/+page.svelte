<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import {
    Card,
    CardContent,
    CardFooter,
  } from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import Gem from '@lucide/svelte/icons/gem';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import Star from '@lucide/svelte/icons/star';
  import Check from '@lucide/svelte/icons/check';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import Clock from '@lucide/svelte/icons/clock';
  import CreditCard from '@lucide/svelte/icons/credit-card';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Scissors from '@lucide/svelte/icons/scissors';
  import Users from '@lucide/svelte/icons/users';

  type Tab = 'makeup' | 'hair' | 'combo';
  let activeTab = $state<Tab>('makeup');

  const tabs: { id: Tab; label: string; mobileLabel: string }[] = [
    { id: 'makeup', label: 'Makeup', mobileLabel: 'Makeup' },
    { id: 'hair', label: 'Hair', mobileLabel: 'Hair' },
    { id: 'combo', label: 'Hair & Makeup', mobileLabel: 'Both' },
  ];

  const notes = [
    {
      icon: MapPin,
      title: 'Travel',
      text: 'Based in Moreleta Park, Pretoria. Available across Centurion, Midrand, Sandton, and Johannesburg. Travel charged at R5\u00A0/\u00A0km (to venue and back).',
    },
    {
      icon: Clock,
      title: 'Timing',
      text: 'Bridal bookings require a 3-hour minimum window. Early-morning starts (before 06:00) carry a small surcharge.',
    },
    {
      icon: CreditCard,
      title: 'Booking',
      text: 'A 50% deposit secures your date. Final payment is due on the day of your appointment.',
    },
  ] as const;
</script>

{#snippet priceRow(item: string, price: string)}
  <div class="flex items-baseline gap-2 text-sm">
    <dt class="shrink-0 text-muted-foreground">{item}</dt>
    <span
      class="flex-1 translate-y-[-0.2em] border-b border-dotted border-muted-foreground/25"
      aria-hidden="true"
    ></span>
    <dd class="shrink-0 font-semibold tabular-nums">{price}</dd>
  </div>
{/snippet}

{#snippet checkItem(text: string)}
  <li class="flex items-start gap-3 text-sm">
    <Check class="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
    <span>{text}</span>
  </li>
{/snippet}

<svelte:head>
  <title>Divine Detail | Services & Pricing</title>
  <meta
    name="description"
    content="Professional makeup and hair styling services for weddings, special events, and matric farewells in Pretoria, Centurion, Midrand, and Gauteng. View packages and book your session."
  />
</svelte:head>

<!-- Hero -->
<section class="py-20 sm:py-24">
  <div class="mx-auto max-w-5xl px-4">
    <div class="hero-stagger flex flex-col items-center text-center">
      <div class="mb-8 h-px w-12 bg-brand"></div>

      <Badge variant="outline" class="mb-6 font-normal tracking-wide">
        Pretoria &middot; Gauteng
      </Badge>

      <h1
        class="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
      >
        Services <span class="text-brand">&</span> Pricing
      </h1>

      <p
        class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        Professional makeup and hair styling for your most important moments.
        Based in Pretoria, available across Gauteng and surrounding areas.
      </p>

      <div class="mt-8 h-px w-12 bg-brand"></div>
    </div>
  </div>
</section>

<Separator />

<!-- Services -->
<section class="py-20 sm:py-24">
  <div class="mx-auto max-w-5xl px-4">
    <div class="mb-14 text-center">
      <p class="text-sm font-medium uppercase tracking-widest text-brand">
        What I Offer
      </p>
      <h2
        class="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Services & Packages
      </h2>
    </div>

    <!-- Category Toggle -->
    <div class="mb-12 flex justify-center">
      <div
        class="inline-flex rounded-full border border-border bg-muted/50 p-1"
        role="tablist"
        aria-label="Service category"
      >
        {#each tabs as tab (tab.id)}
          <button
            role="tab"
            id="tab-{tab.id}"
            aria-selected={activeTab === tab.id}
            aria-controls="panel-{tab.id}"
            class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 sm:px-6
              {activeTab === tab.id
              ? 'bg-brand text-brand-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'}"
            onclick={() => (activeTab = tab.id)}
          >
            <span class="sm:hidden">{tab.mobileLabel}</span>
            <span class="hidden sm:inline">{tab.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- ═══════════════════ MAKEUP ═══════════════════ -->
    {#if activeTab === 'makeup'}
      <div
        id="panel-makeup"
        role="tabpanel"
        aria-labelledby="tab-makeup"
        class="flex flex-col gap-8"
      >
        <!-- Bridal Makeup -->
        <Card class="relative overflow-hidden ring-1 ring-brand/25">
          <Badge
            class="absolute right-4 top-4 border-transparent bg-brand text-brand-foreground"
          >
            Most Popular
          </Badge>

          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Gem class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Bridal Makeup
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Your wedding day deserves a flawless, lasting look. Full trial
                  session and premium lash application included.
                </p>
              </div>
            </div>

            <div class="grid gap-10 sm:grid-cols-2">
              <div>
                <p
                  class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  What's Included
                </p>
                <ul class="space-y-3">
                  {@render checkItem('Pre-wedding consultation')}
                  {@render checkItem('Full bridal trial session')}
                  {@render checkItem('Wedding day application')}
                  {@render checkItem('Premium lash application')}
                  {@render checkItem('Long-wear, photo-ready finish')}
                  {@render checkItem('Touch-up kit for the day')}
                </ul>
              </div>

              <div>
                <p
                  class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  Pricing
                </p>
                <dl class="space-y-3">
                  {@render priceRow('Bridal Makeup (incl. trial & lashes)', 'R1,500')}
                  {@render priceRow('Bridesmaid Makeup', 'R500')}
                  {@render priceRow('Mother of Bride / Groom', 'R400')}
                </dl>
              </div>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Special Events -->
        <Card class="relative overflow-hidden">
          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Sparkles class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Special Events
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Matric farewells, birthdays, engagements, photo shoots —
                  professional makeup that photographs beautifully and lasts all
                  night.
                </p>
              </div>
            </div>

            <div class="grid gap-10 sm:grid-cols-2">
              <div>
                <p
                  class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  What's Included
                </p>
                <ul class="space-y-3">
                  {@render checkItem('Personalised look consultation')}
                  {@render checkItem('Full glam or soft natural finish')}
                  {@render checkItem('Long-wear setting')}
                  {@render checkItem('Photo-ready application')}
                </ul>
              </div>

              <div>
                <p
                  class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  Pricing
                </p>
                <dl class="space-y-3">
                  {@render priceRow('Special Event Makeup', 'R500')}
                </dl>
              </div>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Wedding Package — Makeup -->
        <Card class="relative overflow-hidden">
          <Badge
            class="absolute right-4 top-4 border-transparent bg-brand text-brand-foreground"
          >
            Best Value
          </Badge>

          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Star class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Wedding Package
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Complete makeup for the bridal party. Includes the bride plus
                  3 additional people.
                </p>
              </div>
            </div>

            <div>
              <p
                class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
              >
                Pricing
              </p>
              <dl class="max-w-md space-y-3">
                {@render priceRow('Wedding Package (Bride + 3)', 'R4,000')}
                {@render priceRow('Additional Person', 'R400')}
              </dl>
              <p
                class="mt-4 text-xs leading-relaxed text-muted-foreground italic"
              >
                Group discount available for parties of 3 or more.
              </p>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Add-Ons -->
        <div class="rounded-xl border border-border bg-muted/30 px-6 py-5">
          <p
            class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
          >
            Add-Ons
          </p>
          <dl
            class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-3"
          >
            {#each [{ item: 'Trial Session', price: 'R400' }, { item: 'Lash Application', price: 'R50' }, { item: 'Extra Person', price: 'R400' }] as tier}
              <div class="flex items-baseline gap-2 text-sm">
                <dt class="text-muted-foreground">{tier.item}</dt>
                <dd class="font-semibold tabular-nums">{tier.price}</dd>
              </div>
            {/each}
          </dl>
        </div>
      </div>

    <!-- ═══════════════════ HAIR ═══════════════════ -->
    {:else if activeTab === 'hair'}
      <div
        id="panel-hair"
        role="tabpanel"
        aria-labelledby="tab-hair"
        class="flex flex-col gap-8"
      >
        <!-- Bridal Hair -->
        <Card class="relative overflow-hidden ring-1 ring-brand/25">
          <Badge
            class="absolute right-4 top-4 border-transparent bg-brand text-brand-foreground"
          >
            Bridal
          </Badge>

          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Scissors class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Bridal Hair
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Elegant styling for your wedding day, from flowing blow waves
                  to intricate upstyles.
                </p>
              </div>
            </div>

            <div>
              <p
                class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
              >
                Pricing
              </p>
              <dl class="max-w-md space-y-3">
                {@render priceRow('Blow wave (short hair)', 'R450')}
                {@render priceRow('Blow wave (long hair)', 'R550')}
                {@render priceRow('Upstyle (short hair)', 'R850')}
                {@render priceRow('Upstyle (long hair)', 'R1,100')}
              </dl>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Wedding Party Hair -->
        <Card class="relative overflow-hidden">
          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Users class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Wedding Party Hair
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Coordinated styling for bridesmaids, mothers, and family
                  members.
                </p>
              </div>
            </div>

            <div class="space-y-8">
              <!-- Bridesmaid -->
              <div>
                <p
                  class="mb-3 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  Bridesmaid
                </p>
                <dl class="max-w-md space-y-3">
                  {@render priceRow('Blow wave (short)', 'R350')}
                  {@render priceRow('Blow wave (long)', 'R450')}
                  {@render priceRow('Upstyle (short)', 'R650')}
                  {@render priceRow('Upstyle (long)', 'R850')}
                </dl>
              </div>

              <!-- Mother -->
              <div>
                <p
                  class="mb-3 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  Mother of Bride / Groom
                </p>
                <dl class="max-w-md space-y-3">
                  {@render priceRow('Blow wave (short)', 'R350')}
                  {@render priceRow('Blow wave (long)', 'R450')}
                  {@render priceRow('Upstyle (short)', 'R650')}
                  {@render priceRow('Upstyle (long)', 'R850')}
                </dl>
              </div>

              <!-- Grandmother -->
              <div>
                <p
                  class="mb-3 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  Grandmother
                </p>
                <dl class="max-w-md space-y-3">
                  {@render priceRow('Short hair', 'R300')}
                  {@render priceRow('Long hair', 'R400')}
                </dl>
              </div>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Event Hair -->
        <Card class="relative overflow-hidden">
          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Sparkles class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Event Hair
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Professional blow wave styling for special occasions,
                  farewells, and photo shoots.
                </p>
              </div>
            </div>

            <div>
              <p
                class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
              >
                Pricing
              </p>
              <dl class="max-w-md space-y-3">
                {@render priceRow('Blow wave (short hair)', 'R350')}
                {@render priceRow('Blow wave (long hair)', 'R450')}
              </dl>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Wedding Package — Hair -->
        <Card class="relative overflow-hidden">
          <Badge
            class="absolute right-4 top-4 border-transparent bg-brand text-brand-foreground"
          >
            Best Value
          </Badge>

          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Star class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Wedding Package — Hair
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Hair styling for the full bridal party. Includes the bride
                  plus 3 additional people.
                </p>
              </div>
            </div>

            <div>
              <p
                class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
              >
                Pricing
              </p>
              <dl class="max-w-md space-y-3">
                {@render priceRow('Wedding Package (Bride + 3)', 'R2,650')}
              </dl>
              <p
                class="mt-4 text-xs leading-relaxed text-muted-foreground italic"
              >
                Style and length upgrades available. Group discount for parties
                of 3 or more.
              </p>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

    <!-- ═══════════════════ HAIR & MAKEUP COMBOS ═══════════════════ -->
    {:else}
      <div
        id="panel-combo"
        role="tabpanel"
        aria-labelledby="tab-combo"
        class="flex flex-col gap-8"
      >
        <!-- Bridal Hair & Makeup -->
        <Card class="relative overflow-hidden ring-1 ring-brand/25">
          <Badge
            class="absolute right-4 top-4 border-transparent bg-brand text-brand-foreground"
          >
            Most Popular
          </Badge>

          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-6 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Gem class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Bridal Hair & Makeup
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Complete bridal beauty — makeup with trial & lashes plus
                  professional hair styling.
                </p>
              </div>
            </div>

            <div class="mb-6">
              <p
                class="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Starting from
              </p>
              <p
                class="font-display mt-1 text-4xl font-semibold tracking-tight text-brand sm:text-5xl"
              >
                R1,950
              </p>
            </div>

            <ul class="space-y-3">
              {@render checkItem('Bridal makeup with trial & lashes')}
              {@render checkItem('Hair styling (blow wave or upstyle)')}
              {@render checkItem('Long-wear, photo-ready finish')}
              {@render checkItem('Touch-up kit for the day')}
            </ul>

            <p
              class="mt-4 text-xs leading-relaxed text-muted-foreground italic"
            >
              Final price depends on hair length and style choice.
            </p>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Wedding Party Combos -->
        <Card class="relative overflow-hidden">
          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-6 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Users class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Wedding Party
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Coordinated hair and makeup for bridesmaids and family
                  members.
                </p>
              </div>
            </div>

            <div>
              <p
                class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
              >
                Per Person
              </p>
              <dl class="max-w-md space-y-3">
                {@render priceRow('Bridesmaid Hair & Makeup', 'From R850')}
                {@render priceRow('Mother Hair & Makeup', 'From R750')}
              </dl>
              <p
                class="mt-4 text-xs leading-relaxed text-muted-foreground italic"
              >
                Group discount available for parties of 3 or more. Final price
                depends on hair length and style.
              </p>
            </div>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Special Event Combo -->
        <Card class="relative overflow-hidden">
          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-6 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Sparkles class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Special Event
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  Full hair and makeup for any occasion — farewells, birthdays,
                  engagements, photo shoots.
                </p>
              </div>
            </div>

            <div class="mb-6">
              <p
                class="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Starting from
              </p>
              <p
                class="font-display mt-1 text-4xl font-semibold tracking-tight text-brand sm:text-5xl"
              >
                R850
              </p>
            </div>

            <ul class="space-y-3">
              {@render checkItem('Event makeup application')}
              {@render checkItem('Blow wave styling')}
              {@render checkItem('Long-wear setting')}
            </ul>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>

        <!-- Full Wedding Package -->
        <Card class="relative overflow-hidden">
          <Badge
            class="absolute right-4 top-4 border-transparent bg-brand text-brand-foreground"
          >
            Best Value
          </Badge>

          <CardContent class="pt-2 sm:pt-4">
            <div class="mb-6 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <Star class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Full Wedding Package
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  The complete package — hair and makeup for the bride plus 3
                  additional people.
                </p>
              </div>
            </div>

            <div class="mb-6">
              <p
                class="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Starting from
              </p>
              <p
                class="font-display mt-1 text-4xl font-semibold tracking-tight text-brand sm:text-5xl"
              >
                R6,650
              </p>
            </div>

            <ul class="space-y-3">
              {@render checkItem('Bridal hair & makeup (incl. trial & lashes)')}
              {@render checkItem('Hair & makeup for 3 additional people')}
              {@render checkItem('On-location service')}
            </ul>

            <p
              class="mt-4 text-xs leading-relaxed text-muted-foreground italic"
            >
              Best value for full bridal parties. Additional people can be
              added.
            </p>
          </CardContent>

          <CardFooter class="border-t pt-5">
            <Button
              href="/contact"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book Now
              <ArrowRight class="size-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    {/if}
  </div>
</section>

<Separator />

<!-- Good to Know -->
<section class="py-20 sm:py-24">
  <div class="mx-auto max-w-5xl px-4">
    <div class="mb-14 text-center">
      <p class="text-sm font-medium uppercase tracking-widest text-brand">
        Before You Book
      </p>
      <h2
        class="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Good to Know
      </h2>
    </div>

    <div class="grid gap-8 sm:grid-cols-3">
      {#each notes as note}
        <div class="text-center">
          <div
            class="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand"
          >
            <note.icon class="size-5" />
          </div>
          <h3 class="text-sm font-semibold">{note.title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
            {note.text}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Banner -->
<section class="border-t bg-brand/5">
  <div class="mx-auto max-w-5xl px-4 py-20 sm:py-24">
    <div class="flex flex-col items-center text-center">
      <div class="mb-6 h-px w-12 bg-brand"></div>
      <h2
        class="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Ready to Book?
      </h2>
      <p
        class="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground"
      >
        Let's discuss your look. Whether it's a wedding, farewell, or special
        event, I'd love to hear from you.
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button
          href="/contact"
          size="lg"
          class="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          Get in Touch
          <ArrowRight class="size-4" />
        </Button>
        <Button href="https://wa.me/27816098157" variant="outline" size="lg">
          WhatsApp Me
        </Button>
      </div>
    </div>
  </div>
</section>

<style>
  .hero-stagger > :nth-child(1) { animation: hero-fade-in 0.8s ease both 0.1s; }
  .hero-stagger > :nth-child(2) { animation: hero-fade-in 0.8s ease both 0.2s; }
  .hero-stagger > :nth-child(3) { animation: hero-fade-in 0.8s ease both 0.35s; }
  .hero-stagger > :nth-child(4) { animation: hero-fade-in 0.8s ease both 0.5s; }
  .hero-stagger > :nth-child(5) { animation: hero-fade-in 0.8s ease both 0.6s; }

  @keyframes hero-fade-in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-stagger > * {
      animation: none !important;
    }
  }
</style>
