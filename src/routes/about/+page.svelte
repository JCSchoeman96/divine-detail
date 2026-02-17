<script lang="ts">
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Check from '@lucide/svelte/icons/check';
  import Clock from '@lucide/svelte/icons/clock';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import MessageCircle from '@lucide/svelte/icons/message-circle';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import Star from '@lucide/svelte/icons/star';

  const pageUrl = 'https://divinedetail.co.za/about';
  const pageTitle = 'About Megan | Bridal Makeup Artist Pretoria | Divine Detail';
  const pageDescription =
    'Meet Megan from Divine Detail. Pretoria and Gauteng bridal, event, and matric makeup artist focused on calm mornings, long-wear finishes, and skin-safe artistry.';
  const whatsappText = encodeURIComponent(
    'Hi Megan, I would like to enquire about makeup availability in Pretoria/Gauteng.'
  );
  const whatsappUrl = `https://wa.me/27816098157?text=${whatsappText}`;

  const quickFacts = [
    {
      icon: Sparkles,
      title: 'Long-wear, photo-ready finish',
      body: 'Sweat-friendly, tear-aware, and camera-ready application so your look holds from prep to final photos.',
      proof: 'Proof: Preferred for full-day weddings and long event timelines.',
      meaning: 'What it means for you: less touch-up stress and confidence in every photo.',
      tag: 'Photo Priority',
    },
    {
      icon: Clock,
      title: 'Calm and on-time bridal mornings',
      body: 'Your beauty timeline is planned in advance with realistic slots for every person in the chair.',
      proof: 'Proof: Clear prep windows and practical pacing for venues across Gauteng.',
      meaning: 'What it means for you: no rushing, no panic, and more time to be present.',
      tag: 'Bridal Flow',
    },
    {
      icon: Star,
      title: 'Hygiene-first, skin-conscious kit',
      body: 'Sanitised tools, clean product handling, and comfort-focused techniques for a polished finish.',
      proof: 'Proof: Products and prep adjusted to your skin type and sensitivity notes.',
      meaning: 'What it means for you: a safer, more comfortable appointment from start to finish.',
      tag: 'Skin Safe',
    },
  ] as const;

  const testimonials = [
    {
      quote:
        'Megan kept our wedding morning so calm. My makeup still looked fresh at sunset photos and the dance floor.',
      name: 'Danielle S.',
      event: 'Bridal Makeup',
      location: 'Rosemary Hill, Pretoria',
    },
    {
      quote:
        'I asked for soft glam for matriekafskeid and she nailed it. It looked natural in person and perfect in photos.',
      name: 'Lea M.',
      event: 'Matric Farewell',
      location: 'Centurion, Gauteng',
    },
    {
      quote:
        'She was on time, professional, and listened to exactly what I wanted for our engagement shoot.',
      name: 'Naledi K.',
      event: 'Special Event Makeup',
      location: 'Midrand, Gauteng',
    },
  ] as const;

  const faqs = [
    {
      question: 'Do you do trials?',
      answer:
        'Yes. Bridal bookings can include a trial so we lock in your look before the wedding day and avoid last-minute uncertainty.',
    },
    {
      question: 'Do you travel to venues?',
      answer:
        'Yes. I travel across Pretoria, Centurion, Midrand, and nearby Gauteng areas. Travel is quoted based on distance and start time.',
    },
    {
      question: 'How far in advance should I book?',
      answer:
        'Peak wedding and matric dates fill quickly. Booking 2 to 6 months ahead is ideal, and earlier is best for high-demand weekends.',
    },
    {
      question: 'What must I prep before my appointment?',
      answer:
        'Arrive with a clean, moisturised face and dry hair if hair styling is included. We confirm a full prep checklist before your date.',
    },
    {
      question: 'Can you do bridesmaids and moms?',
      answer:
        'Absolutely. Group bookings are available for bridesmaids, moms, and family members with timing planned around your ceremony.',
    },
    {
      question: 'What happens if my skin is sensitive?',
      answer:
        'Please share sensitivities in advance. I adjust products and application methods for comfort, and we can patch-test when needed.',
    },
  ] as const;

  const personSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Megan',
    jobTitle: 'Makeup Artist',
    url: pageUrl,
    telephone: '+27816098157',
    worksFor: {
      '@type': 'LocalBusiness',
      name: 'Divine Detail',
      url: 'https://divinedetail.co.za',
      areaServed: 'Pretoria and Gauteng',
    },
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content="https://divinedetail.co.za/images/megan.jpg" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content="https://divinedetail.co.za/images/megan.jpg" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${personSchema}</script>`}
</svelte:head>

<section class="relative overflow-hidden border-b">
  <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--color-brand)_0%,transparent_45%)] opacity-10"></div>
  <div class="mx-auto max-w-6xl px-4 py-16 sm:py-20">
    <div class="grid items-center gap-10 md:grid-cols-2 md:gap-12">
      <figure class="reveal-up relative">
        <div class="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl">
          <picture>
            <source srcset="/images/megan.webp" type="image/webp" />
            <!-- Replace this placeholder path once the final portrait is ready. -->
            <img
              src="/images/megan.jpg"
              alt="Megan, founder of Divine Detail makeup artistry"
              width="960"
              height="1200"
              loading="lazy"
              decoding="async"
              class="aspect-[4/5] w-full object-cover object-center"
            />
          </picture>
          <div
            class="pointer-events-none absolute inset-0 opacity-[0.06]"
            style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 128 128%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.35%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E');"
          ></div>
        </div>
        <figcaption class="mt-3 text-sm text-muted-foreground">
          Bridal, event, and matriekafskeid makeup across Pretoria and Gauteng.
        </figcaption>
      </figure>

      <div class="reveal-up hero-copy">
        <Badge variant="outline" class="mb-4 w-fit font-normal">Pretoria and Gauteng</Badge>
        <h1 class="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Meet Megan
        </h1>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          I help brides and clients look polished without feeling overdone. My focus is timeless glam
          that wears beautifully in real life and in photos.
        </p>
        <div class="mt-6 flex flex-wrap gap-2">
          <Badge class="bg-brand text-brand-foreground border-transparent">Bridal</Badge>
          <Badge variant="outline">Events</Badge>
          <Badge variant="outline">Matric</Badge>
        </div>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg" class="GA4_BookingBtn bg-brand text-brand-foreground hover:bg-brand/90">
            Enquire or Book
            <ArrowRight class="size-4" />
          </Button>
          <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
            <MessageCircle class="size-4" />
            WhatsApp Megan
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="bg-muted/20 py-16 sm:py-20">
  <div class="mx-auto max-w-6xl px-4">
    <div class="mb-10 text-center">
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Quick Facts</h2>
      <p class="mx-auto mt-3 max-w-2xl text-muted-foreground">
        Built around the outcomes clients care about most: longevity, calm timelines, and skin comfort.
      </p>
    </div>
    <div class="grid gap-5 md:grid-cols-3">
      {#each quickFacts as fact}
        <Card class="group relative overflow-hidden border-border/80 bg-card/95 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="absolute right-4 top-4 size-2 rounded-full bg-brand"></div>
          <CardHeader>
            <div class="mb-3 flex items-center justify-between">
              <div class="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors duration-300 group-hover:bg-brand/20">
                <fact.icon class="size-5" />
              </div>
              <Badge variant="outline" class="text-[11px]">{fact.tag}</Badge>
            </div>
            <CardTitle class="text-lg leading-snug">{fact.title}</CardTitle>
            <CardDescription class="leading-relaxed">{fact.body}</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-xs font-medium uppercase tracking-widest text-brand">What it means for you</p>
            <p class="mt-2 text-sm text-foreground/90">{fact.meaning}</p>
            <p class="mt-4 border-t pt-3 text-xs text-muted-foreground">{fact.proof}</p>
          </CardContent>
        </Card>
      {/each}
    </div>
    <div class="mt-8 flex justify-center">
      <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="outline">
        Ask About Your Date on WhatsApp
      </Button>
    </div>
  </div>
</section>

<Separator />

<section class="py-16 sm:py-20">
  <div class="mx-auto max-w-6xl px-4">
    <div class="mb-10 text-center">
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">My Story and Approach</h2>
      <p class="mx-auto mt-3 max-w-2xl text-muted-foreground">
        A clear process, thoughtful prep, and looks tailored to your features and event.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <Card class="reveal-up h-full">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-2xl font-display">
            <Sparkles class="size-5 text-brand" />
            My Style and Approach
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            My work leans natural glam: clean skin, balanced definition, and details that still feel
            like you.
          </p>
          <p>
            Every booking starts with your brief, dress tone, and schedule so your look is timeless and
            practical for the full day.
          </p>
          <ul class="space-y-2 text-foreground/90">
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-brand" />
              Tailored complexion and eye detail for your features
            </li>
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-brand" />
              Soft glam to elevated glam depending on your comfort
            </li>
            <li class="flex items-start gap-2">
              <Check class="mt-0.5 size-4 shrink-0 text-brand" />
              Clear communication before and on the day
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card class="reveal-up h-full">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-2xl font-display">
            <MapPin class="size-5 text-brand" />
            Where I Work
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Based in Pretoria and available across Gauteng, including Centurion, Midrand, and selected
            Johannesburg venues.
          </p>
          <p>
            Travel can be arranged for weddings, photo shoots, and early starts. I share a clear travel
            quote up front so you can plan confidently.
          </p>
          <div class="rounded-xl border border-border/80 bg-muted/40 p-4">
            <h3 class="font-medium text-foreground">Travel note</h3>
            <p class="mt-1 text-sm">
              Venue bookings are prioritised for bridal mornings and group prep sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

<Separator />

<section class="py-16 sm:py-20">
  <div class="mx-auto max-w-6xl px-4">
    <div class="mb-10 text-center">
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Social Proof</h2>
      <p class="mx-auto mt-3 max-w-2xl text-muted-foreground">
        Feedback from local clients across weddings, events, and matric evenings.
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      {#each testimonials as testimonial}
        <Card class="h-full">
          <CardContent class="space-y-4 pt-6">
            <p class="text-sm leading-relaxed italic text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</p>
            <div class="border-t pt-4 text-sm">
              <p class="font-semibold">{testimonial.name}</p>
              <p class="text-muted-foreground">{testimonial.event} - {testimonial.location}</p>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>

    <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Button href="/services" variant="outline">
        See Services
      </Button>
      <Button href="/contact" class="GA4_BookingBtn bg-brand text-brand-foreground hover:bg-brand/90">
        Book Your Date
      </Button>
    </div>
  </div>
</section>

<Separator />

<section class="bg-muted/20 py-16 sm:py-20">
  <div class="mx-auto max-w-4xl px-4">
    <div class="mb-8 text-center">
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">FAQ</h2>
      <p class="mx-auto mt-3 max-w-2xl text-muted-foreground">
        Quick answers before you enquire. If you need specifics, message me directly.
      </p>
    </div>

    <div class="space-y-4">
      {#each faqs as faq}
        <Card class="faq-item">
          <CardContent class="pt-5">
            <details class="faq-details">
              <summary class="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                <h3 class="text-base font-semibold">{faq.question}</h3>
                <span class="faq-marker mt-1 text-brand" aria-hidden="true">+</span>
              </summary>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          </CardContent>
        </Card>
      {/each}
    </div>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button href="/contact" size="lg" class="GA4_BookingBtn bg-brand text-brand-foreground hover:bg-brand/90">
        Start Your Booking
        <ArrowRight class="size-4" />
      </Button>
      <Button href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="lg">
        <MessageCircle class="size-4" />
        WhatsApp Megan
      </Button>
    </div>
  </div>
</section>

<style>
  .reveal-up {
    animation: rise-in 0.7s ease both;
  }

  .hero-copy {
    animation-delay: 80ms;
  }

  @keyframes rise-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .faq-details[open] .faq-marker {
    transform: rotate(45deg);
  }

  .faq-marker {
    transition: transform 0.2s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal-up {
      animation: none !important;
    }

    .faq-marker {
      transition: none;
    }
  }
</style>
