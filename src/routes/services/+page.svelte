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

  const services = [
    {
      icon: Gem,
      title: 'Bridal Makeup',
      featured: true,
      badge: 'Most Popular',
      description:
        'Your wedding day deserves a flawless, lasting look. From the initial trial to the final touch-up, every detail is tailored to complement your dress, venue, and personal style.',
      includes: [
        'Pre-wedding consultation',
        'Full bridal trial session',
        'Wedding day application',
        'Long-wear, photo-ready finish',
        'Touch-up kit for the day',
      ],
      pricing: [
        { item: 'Bridal Trial', price: 'R850' },
        { item: 'Wedding Day Makeup', price: 'R2,500' },
        { item: 'Bridal Package (trial + day)', price: 'R3,000' },
        { item: 'Bridesmaid / Mother of Bride', price: 'R850' },
      ],
      note: 'Group rates for bridal parties of 4+ available on request.',
    },
    {
      icon: Sparkles,
      title: 'Special Events',
      featured: false,
      badge: null,
      description:
        'Birthdays, engagements, anniversaries, photo shoots — professional makeup that photographs beautifully and lasts all night.',
      includes: [
        'Personalised look consultation',
        'Full glam or soft natural finish',
        'Lash application included',
        'Long-wear setting',
      ],
      pricing: [
        { item: 'Full Glam', price: 'R850' },
        { item: 'Soft / Natural Glam', price: 'R650' },
        { item: 'Group Booking (3+)', price: 'R600 pp' },
      ],
      note: null,
    },
    {
      icon: Star,
      title: 'Matric Farewell',
      featured: false,
      badge: null,
      description:
        "A once-in-a-lifetime evening calls for a look you'll love in every photo. Age-appropriate glam that lets your personality shine through.",
      includes: [
        'Style consultation',
        'Age-appropriate glam application',
        'Long-wear finish for the evening',
        'Photo-ready setting',
      ],
      pricing: [
        { item: 'Matric Farewell Makeup', price: 'R650' },
        { item: 'Farewell + Lash Set', price: 'R800' },
        { item: 'Group Booking (3+)', price: 'R550 pp' },
      ],
      note: 'Popular dates fill quickly — book early to secure your slot.',
    },
  ] as const;

  const notes = [
    {
      icon: MapPin,
      title: 'Travel',
      text: 'Based in Pretoria. Available across Centurion, Midrand, Sandton, and Johannesburg. A travel fee applies for locations beyond 30\u00A0km.',
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

<svelte:head>
  <title>Divine Detail | Services & Pricing</title>
  <meta
    name="description"
    content="Professional makeup services and pricing for weddings, special events, and matric farewells in Pretoria, Centurion, Midrand, and Gauteng. View packages and book your session."
  />
</svelte:head>

<!-- Intro -->
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
        Professional makeup artistry for your most important moments. Based in
        Pretoria, available across Gauteng and surrounding areas.
      </p>

      <div class="mt-8 h-px w-12 bg-brand"></div>
    </div>
  </div>
</section>

<Separator />

<!-- Service Cards -->
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

    <div class="flex flex-col gap-8">
      {#each services as service}
        <Card
          class="relative overflow-hidden {service.featured
            ? 'ring-1 ring-brand/25'
            : ''}"
        >
          {#if service.badge}
            <Badge
              class="absolute right-4 top-4 border-transparent bg-brand text-brand-foreground"
            >
              {service.badge}
            </Badge>
          {/if}

          <CardContent class="pt-2 sm:pt-4">
            <!-- Service header -->
            <div class="mb-8 flex items-start gap-4">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"
              >
                <svelte:component this={service.icon} class="size-6" />
              </div>
              <div class="min-w-0">
                <h3
                  class="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  {service.title}
                </h3>
                <p class="mt-2 leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>

            <!-- Two-column: Includes + Pricing -->
            <div class="grid gap-10 sm:grid-cols-2">
              <!-- What's included -->
              <div>
                <p
                  class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  What's Included
                </p>
                <ul class="space-y-3">
                  {#each service.includes as item}
                    <li class="flex items-start gap-3 text-sm">
                      <Check
                        class="mt-0.5 size-4 shrink-0 text-brand"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  {/each}
                </ul>
              </div>

              <!-- Pricing -->
              <div>
                <p
                  class="mb-4 text-xs font-medium uppercase tracking-widest text-brand"
                >
                  Pricing
                </p>
                <dl class="space-y-3">
                  {#each service.pricing as tier}
                    <div class="flex items-baseline gap-2 text-sm">
                      <dt class="shrink-0 text-muted-foreground">
                        {tier.item}
                      </dt>
                      <span
                        class="flex-1 translate-y-[-0.2em] border-b border-dotted border-muted-foreground/25"
                        aria-hidden="true"
                      ></span>
                      <dd class="shrink-0 font-semibold tabular-nums">
                        {tier.price}
                      </dd>
                    </div>
                  {/each}
                </dl>
                {#if service.note}
                  <p class="mt-4 text-xs leading-relaxed text-muted-foreground italic">
                    {service.note}
                  </p>
                {/if}
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
      {/each}
    </div>
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
            <svelte:component this={note.icon} class="size-5" />
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
