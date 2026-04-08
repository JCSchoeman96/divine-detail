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
  import { build_whatsapp_url } from '$lib/config/social.js';
  import { abs_url } from '$lib/config/site.js';

  const pageUrl = abs_url('/about');
  const socialImage = abs_url('/images/megan.jpg');
  const pageTitle = 'About Megan | Bridal Makeup Artist Pretoria | Divine Detail';
  const pageDescription =
    'Meet Megan from Divine Detail. Pretoria and Gauteng bridal, event, and matric makeup artist focused on calm mornings, long-wear finishes, and skin-safe artistry.';
  const whatsappUrl = build_whatsapp_url(
    "Hi Megan! I'd like to book bridal makeup. Date: _____. Area: Pretoria. Please confirm availability."
  );

  const quickFacts = [
    {
      icon: Sparkles,
      title: 'Beautiful in real life and in photos',
      body: 'I create makeup that wears well through long days, bright light, happy tears, and plenty of photos, while still looking soft and natural up close.',
      proof: 'Products and finish are selected so you still look like yourself in person and on camera.',
      meaning: 'You feel confident in every photo without feeling overdone.',
      tag: 'Photo Friendly',
    },
    {
      icon: Clock,
      title: 'A calm, well-planned experience',
      body: 'I believe getting ready should feel exciting, not chaotic. Timelines are thought through properly so you can relax and enjoy the moment.',
      proof: 'Prep timing is mapped clearly so your morning feels organised, not stressful.',
      meaning: 'You get to be present and enjoy your event day.',
      tag: 'Calm Timing',
    },
    {
      icon: Star,
      title: 'Comfort-first application',
      body: 'Clean tools, thoughtful product choices, and skin-aware application all matter. I want your appointment to feel as good as the final result looks.',
      proof: 'Products and application are adjusted to your skin type and comfort level.',
      meaning: 'You feel cared for from start to finish.',
      tag: 'Comfort First',
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
        'Yes. Bridal trials are the best way to settle on a look before the wedding day, so nothing feels rushed or uncertain.',
    },
    {
      question: 'Do you travel to venues?',
      answer:
        'Yes, I travel across Pretoria, Centurion, Midrand, and nearby Gauteng areas. I’ll quote travel based on distance and timing.',
    },
    {
      question: 'How far in advance should I book?',
      answer:
        'Popular wedding and farewell dates can go quickly, so earlier is always better. For most bookings, 2 to 6 months ahead is a good window.',
    },
    {
      question: 'What must I prep before my appointment?',
      answer:
        'Arrive with a clean, moisturised face, and dry hair if hair styling is included. I’ll guide you through the rest beforehand.',
    },
    {
      question: 'Can you do bridesmaids and moms?',
      answer:
        'Absolutely. Group bookings are available, and I’ll help plan the timing so everything runs smoothly.',
    },
    {
      question: 'What happens if my skin is sensitive?',
      answer:
        'Just let me know in advance. I can adjust products and application for comfort, and we can patch-test where needed.',
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
      url: abs_url('/'),
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
  <meta property="og:image" content={socialImage} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content={socialImage} />
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
            <!-- Replace this placeholder path once the final portrait is ready. -->
            <img
              src="/images/megan.jpg"
              alt="Megan, founder of Divine Detail makeup artistry"
              width="960"
              height="1200"
              loading="eager"
              fetchpriority="high"
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
          I help brides and clients feel beautiful without feeling overdone. My
          style is soft, timeless glam that enhances your features, feels
          comfortable on the skin, and still looks like you.
        </p>
        <p class="mt-2 text-sm text-muted-foreground">
          Bridal, event, and matric farewell makeup across Pretoria and Gauteng.
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
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Why clients <span class="heading-gradient">book with me</span></h2>
      <p class="mx-auto mt-3 max-w-2xl text-muted-foreground">
        When someone books me, they’re usually looking for more than makeup.
        They want calm, confidence, and a look that feels beautiful in photos
        without feeling heavy or unlike themselves.
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
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">My Story and <span class="heading-gradient">Approach</span></h2>
      <p class="mx-auto mt-3 max-w-2xl text-muted-foreground">
        I love makeup, but what I love even more is how a woman feels when she
        looks in the mirror and still recognises herself — just softer,
        brighter, and more confident.
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
            My work leans toward natural to soft glam, with enough definition to
            photograph beautifully but never so much that you feel hidden behind
            it.
          </p>
          <p>
            Every look is shaped around your features, your comfort level, your
            outfit, and the feel of your event.
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
            I’m based in Pretoria and work across Gauteng, including Centurion,
            Midrand, and selected Johannesburg venues.
          </p>
          <p>
            Travel can be arranged for weddings, shoots, and early starts, and
            I’ll always let you know the travel cost up front.
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
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Social <span class="heading-gradient">Proof</span></h2>
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
        Send an Enquiry
      </Button>
    </div>
  </div>
</section>

<Separator />

<section class="bg-muted/20 py-16 sm:py-20">
  <div class="mx-auto max-w-4xl px-4">
    <div class="mb-8 text-center">
      <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl"><span class="heading-gradient">FAQ</span></h2>
      <p class="mx-auto mt-3 max-w-2xl text-muted-foreground">
        A few quick answers before you book.
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
