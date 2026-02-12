<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
  } from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import Gem from '@lucide/svelte/icons/gem';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import Star from '@lucide/svelte/icons/star';
  import Quote from '@lucide/svelte/icons/quote';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';

  const services = [
    {
      icon: Gem,
      title: 'Bridal Makeup',
      description:
        'Your wedding day deserves a flawless, lasting look. From trials to the final touch, every detail is considered.',
      badge: 'Most Popular',
    },
    {
      icon: Sparkles,
      title: 'Events & Special Occasions',
      description:
        'Birthdays, engagements, photo shoots. Professional makeup that photographs beautifully and lasts all night.',
      badge: null,
    },
    {
      icon: Star,
      title: 'Matric Farewell',
      description:
        'A once-in-a-lifetime evening calls for a look you\'ll love in every photo. Age-appropriate glam, done right.',
      badge: null,
    },
  ] as const;

  const testimonials = [
    {
      quote:
        'She made me feel like the most beautiful version of myself. My makeup lasted from morning prep all the way through the last dance.',
      name: 'Tshegofatso M.',
      event: 'Bridal',
    },
    {
      quote:
        'I was nervous about going too bold, but she listened and gave me exactly what I wanted. The photos came out stunning.',
      name: 'Lerato K.',
      event: 'Matric Farewell',
    },
    {
      quote:
        'Professional, punctual, and incredibly talented. My bridesmaids and I all looked amazing. Cannot recommend enough.',
      name: 'Anri V.',
      event: 'Bridal Party',
    },
  ] as const;
</script>

<svelte:head>
  <title>Divine Detail | Bridal Makeup Artist Pretoria</title>
  <meta
    name="description"
    content="Professional bridal and event makeup artist based in Pretoria, Gauteng. Flawless looks for weddings, matric farewells, and special occasions."
  />
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden">
  <!-- Subtle grain overlay -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
    style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E');"
  ></div>

  <div class="mx-auto max-w-5xl px-4 pb-20 pt-24 sm:pb-28 sm:pt-32">
    <div class="hero-stagger flex flex-col items-center text-center">
      <!-- Decorative rule -->
      <div class="mb-8 h-px w-12 bg-brand"></div>

      <Badge variant="outline" class="mb-6 font-normal tracking-wide">
        Pretoria &middot; Gauteng
      </Badge>

      <h1
        class="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Your Day,<br />
        <span class="text-brand italic">Perfected</span>
      </h1>

      <p
        class="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        Professional makeup artistry for brides, events, and milestone moments.
        Based in Pretoria, available across Gauteng.
      </p>

      <!-- Decorative rule -->
      <div class="mt-8 h-px w-12 bg-brand"></div>

      <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button href="/contact" size="lg" class="bg-brand text-brand-foreground hover:bg-brand/90">
          Get in Touch
          <ArrowRight class="size-4" />
        </Button>
        <Button href="/services" variant="outline" size="lg">
          View Services
        </Button>
      </div>
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
        Services
      </h2>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each services as service, i}
        <a href="/services" class="group block">
          <Card
            class="relative h-full transition-shadow duration-300 hover:shadow-md"
          >
            {#if service.badge}
              <Badge
                class="absolute right-4 top-4 bg-brand text-brand-foreground border-transparent"
              >
                {service.badge}
              </Badge>
            {/if}
            <CardHeader>
              <div
                class="mb-2 flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand/20"
              >
                <svelte:component this={service.icon} class="size-5" />
              </div>
              <CardTitle class="text-lg">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription class="leading-relaxed">
                {service.description}
              </CardDescription>
            </CardContent>
          </Card>
        </a>
      {/each}
    </div>
  </div>
</section>

<Separator />

<!-- Testimonials -->
<section class="py-20 sm:py-24">
  <div class="mx-auto max-w-5xl px-4">
    <div class="mb-14 text-center">
      <p class="text-sm font-medium uppercase tracking-widest text-brand">
        Kind Words
      </p>
      <h2
        class="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Client Testimonials
      </h2>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each testimonials as testimonial}
        <Card class="relative">
          <CardContent class="pt-0">
            <Quote
              class="mb-4 size-6 text-brand/40"
              aria-hidden="true"
            />
            <blockquote class="text-sm leading-relaxed text-foreground/80 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
          </CardContent>
          <div class="mt-auto border-t px-6 pb-6 pt-4">
            <p class="text-sm font-medium">{testimonial.name}</p>
            <p class="text-xs text-muted-foreground">{testimonial.event}</p>
          </div>
        </Card>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Banner -->
<section
  class="border-t bg-brand/5"
>
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
        <Button href="/contact" size="lg" class="bg-brand text-brand-foreground hover:bg-brand/90">
          Book a Consultation
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
  /* Staggered entrance animation for hero elements */
  .hero-stagger > :nth-child(1) { animation: hero-fade-in 0.8s ease both 0.1s; }
  .hero-stagger > :nth-child(2) { animation: hero-fade-in 0.8s ease both 0.2s; }
  .hero-stagger > :nth-child(3) { animation: hero-fade-in 0.8s ease both 0.35s; }
  .hero-stagger > :nth-child(4) { animation: hero-fade-in 0.8s ease both 0.5s; }
  .hero-stagger > :nth-child(5) { animation: hero-fade-in 0.8s ease both 0.6s; }
  .hero-stagger > :nth-child(6) { animation: hero-fade-in 0.8s ease both 0.75s; }

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
