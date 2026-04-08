<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import MessageCircle from "@lucide/svelte/icons/message-circle";
  import Phone from "@lucide/svelte/icons/phone";
  import Check from "@lucide/svelte/icons/check";
  import Calendar from "@lucide/svelte/icons/calendar";
  import Clock from "@lucide/svelte/icons/clock";
  import User from "@lucide/svelte/icons/user";
  import ArrowRight from "@lucide/svelte/icons/arrow-right";
  import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
  import { guides } from "$lib/data/guides";
  import { build_whatsapp_url } from "$lib/config/social.js";
  import { abs_url } from "$lib/config/site.js";
  import { BRAND_WORDMARK_PRIMARY_URL } from "$lib/config/brand.js";

  const guide = guides["wedding-day-makeup-timeline-pretoria"];
  const pageUrl = abs_url(`/makeup-guides/${guide.slug}`);
  const pageTitle = guide.title;
  const pageDescription = guide.description;
  const socialImage = abs_url("/og-default.svg");
  const heroImage = abs_url(guide.hero_image);

  const whatsappLink = build_whatsapp_url(
    `Hi Megan! Wedding date: _____. Venue area: _____. People: _____. Ceremony time: _____. Can you confirm availability and a quote?`,
  );

  const faqs = [
    {
      question: "How long does bridal makeup take?",
      answer:
        "Typically 2\u20133 hours. I don\u2019t rush the skin prep\u2014that\u2019s where the magic lives.",
    },
    {
      question: "How long per bridesmaid or mom?",
      answer:
        "Plan 45\u201360 minutes per person. Moms often take longer because they\u2019re nervous (and deserve extra care).",
    },
    {
      question: "What time should makeup start?",
      answer:
        "Work backwards from your ceremony, subtract 4\u20135 hours, then add travel buffer. Early ceremony = very early start.",
    },
    {
      question: "Do I really need a trial?",
      answer:
        "If you want to sleep well the night before your wedding, yes. It\u2019s also when we figure out if that Pinterest look actually suits your face shape.",
    },
    {
      question: "When should I book the trial?",
      answer:
        "4\u20138 weeks before is the sweet spot. Schedule it at a similar time of day to your ceremony to test lighting.",
    },
    {
      question: "Do you travel to venues in Pretoria?",
      answer:
        "Absolutely. I work across Pretoria and Centurion with travel quoted based on distance and logistics.",
    },
    {
      question: "What should I arrive with?",
      answer:
        "Clean skin, moisturizer (if you have a trusted one), no makeup, and inspiration photos. Oh, and a robe that buttons up\u2014no pullovers after makeup!",
    },
    {
      question: "What if I get a breakout the day before?",
      answer:
        "Don\u2019t panic-strip your skin. Leave it alone, ice it if needed, and tell me. I have high-coverage techniques that don\u2019t look cakey.",
    },
    {
      question: "Can makeup survive a Pretoria summer outdoor ceremony?",
      answer:
        "Yes, with proper prep and realistic expectations. We\u2019ll set it to last, but you\u2019ll need that blotting paper in your kit.",
    },
    {
      question: "How do I secure the booking?",
      answer:
        "WhatsApp me the checklist above. I\u2019ll confirm availability and send a quote. To secure the date, bookings are confirmed with a deposit.",
    },
  ];

  const schemaOrg = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: guide.title,
        description:
          "Realistic wedding makeup timeline for Pretoria brides. Includes travel buffers, trial timing, and party schedules.",
        image: heroImage,
        author: {
          "@type": "Person",
          name: "Megan",
          url: abs_url("/about"),
        },
        publisher: {
          "@type": "Organization",
          name: "Divine Detail",
          logo: {
            "@type": "ImageObject",
            url: BRAND_WORDMARK_PRIMARY_URL,
          },
        },
        datePublished: guide.updated_at,
        dateModified: guide.updated_at,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        inLanguage: "en-ZA",
        isPartOf: {
          "@type": "WebPage",
          name: "Bridal Makeup Guides",
          url: abs_url("/makeup-guides"),
        },
        keywords: [
          "bridal makeup pretoria",
          "wedding makeup timeline",
          "bridal makeup timeline",
          "wedding day schedule",
        ],
        about: {
          "@type": "Thing",
          name: "Bridal Makeup",
        },
        mentions: [
          { "@type": "Place", name: "Pretoria" },
          { "@type": "Place", name: "Centurion" },
          { "@type": "Place", name: "Menlyn" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
    ],
  });

  const toc = [
    { id: "calm-face-rule", title: "The Calm-Face Rule" },
    { id: "what-changes-timeline", title: "What changes your timeline" },
    { id: "baseline-schedule", title: "Baseline schedule (bride only)" },
    { id: "bridal-party-schedule", title: "Bridal party schedule" },
    { id: "on-location-vs-studio", title: "On-location vs. studio" },
    { id: "trial-timing", title: "Trial timing" },
    { id: "week-of-checklist", title: "Week-of checklist" },
    { id: "touch-up-kit", title: "Your touch-up kit" },
    { id: "common-timing-mistakes", title: "Common timing mistakes" },
    { id: "booking-checklist", title: "Booking checklist" },
    { id: "faqs", title: "FAQs" },
  ];
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content={socialImage} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <meta name="twitter:image" content={socialImage} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${schemaOrg}</script>`}
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 md:py-20">
  <div class="grid gap-12 md:grid-cols-[minmax(0,75ch)_minmax(0,1fr)]">
    <!-- Main Content -->
    <article class="space-y-12">
      <!-- Hero -->
      <header class="hero-stagger space-y-6">
        <div class="h-px w-12 bg-brand"></div>
        <h1
          class="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
        >
          {guide.title}
        </h1>
        <p class="text-xl font-medium text-brand italic">
          (Bridal Makeup Timeline for Pretoria & Gauteng)
        </p>
        <p class="text-lg leading-relaxed text-muted-foreground">
          Planning your wedding morning in Pretoria? Here’s the calm, realistic
          timeline I use so your makeup feels beautiful and your morning doesn’t
          feel frantic.
        </p>

        <div
          class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
        >
          <div class="flex items-center gap-2">
            <Clock class="size-4 text-brand" />
            <span>{guide.read_time_minutes} min read</span>
          </div>
          <div class="flex items-center gap-2">
            <Calendar class="size-4 text-brand" />
            <span>Updated: {guide.updated_at}</span>
          </div>
          <div class="flex items-center gap-2">
            <User class="size-4 text-brand" />
            <span>By Megan &mdash; Divine Detail</span>
          </div>
        </div>

        <div class="aspect-video overflow-hidden rounded-2xl bg-muted/30">
          <img
            src={guide.hero_image}
            alt="Bride applying makeup in natural morning light preparing for Pretoria wedding"
            class="h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
          />
        </div>
      </header>

      <!-- Sidebar CTA (Mobile Only - After Hero) -->
      <div class="md:hidden">
        {@render sidebarCTA()}
      </div>

      <!-- Intro -->
      <div class="prose prose-brand max-w-none dark:prose-invert">
        <p>Hey beautiful,</p>
        <p>
          Let's be honest: wedding mornings in Pretoria can feel like a
          production. Between the traffic on the N1, that unexpected summer
          thunderstorm, and your mom asking where the boutonnieres are at 6
          AM, the last thing you need is makeup panic.
        </p>
        <p>
          I work across Pretoria and Centurion, and travel for weddings with a
          planned buffer. Here's what I know for sure: <strong
            >bridal makeup looks best on calm skin.</strong
          > When we rush, your face heats up, your eyes water, and suddenly that
          perfect base is sliding before you've even put on your dress.
        </p>
        <p>
          This guide is the exact timeline I walk through with every bride
          during our trial. It accounts for real Pretoria variables&mdash;load
          shedding, venue travel, and that specific Highveld humidity&mdash;so
          you look fresh from the first look to the last dance.
        </p>
      </div>

      <!-- Intro CTA -->
      <div class="not-prose">
        <Card class="border-brand/20 bg-brand/5">
          <CardContent class="p-6">
            <p class="font-semibold mb-3">
              Ready to check your date?
            </p>
            <p class="text-sm text-muted-foreground mb-4">
              WhatsApp me your wedding date, venue area, ceremony time, and how
              many people need makeup.
            </p>
            <Button
              href={whatsappLink}
              size="lg"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book on WhatsApp
              <MessageCircle class="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Quick Summary -->
      <div class="not-prose">
        <Card class="border-brand/20 shadow-md">
          <CardHeader>
            <CardTitle class="text-lg">Quick Summary</CardTitle>
            <CardDescription>If you only read one thing, make it this:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="grid gap-3">
              <li class="flex items-start gap-3 text-sm">
                <Check class="mt-0.5 size-4 shrink-0 text-brand" />
                <span><strong>Bridal makeup:</strong> 2&ndash;3 hours (skin prep, application, setting, and final checks).</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <Check class="mt-0.5 size-4 shrink-0 text-brand" />
                <span><strong>Bridal party:</strong> 45&ndash;60 minutes per person.</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <Check class="mt-0.5 size-4 shrink-0 text-brand" />
                <span><strong>Golden rule:</strong> Be makeup-ready 4&ndash;5 hours before the ceremony. This protects your photo window and keeps you human.</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <Check class="mt-0.5 size-4 shrink-0 text-brand" />
                <span><strong>Pretoria buffer:</strong> Add 20&ndash;40 minutes for in-city travel, 45&ndash;90 minutes if you're heading out to Cullinan or the Vaal.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <!-- TOC -->
      <nav class="rounded-xl border p-6 bg-muted/20" aria-label="On this page">
        <p
          class="mb-4 text-sm font-semibold uppercase tracking-wider text-brand"
        >
          What's inside this guide
        </p>
        <ul class="grid gap-2 sm:grid-cols-2">
          {#each toc as item}
            <li>
              <a
                href={`#${item.id}`}
                class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                <ChevronRight class="size-3.5 shrink-0" />
                {item.title}
              </a>
            </li>
          {/each}
        </ul>
      </nav>

      <!-- Main Long-form Content -->
      <div class="prose prose-brand max-w-none dark:prose-invert">
        <!-- Section 1 -->
        <h2 id="calm-face-rule">
          1) The <span class="heading-gradient">Calm-Face</span> Rule
        </h2>
        <p>
          Makeup is chemistry, and chemistry needs time. Stress and heat can
          make skin flush and oilier, which can shorten wear time. When you're
          tense, your expression tightens&mdash;and that shows in photos.
        </p>
        <p>A relaxed timeline gives us:</p>
        <ul>
          <li>Time for your SPF to sink in (no pilling).</li>
          <li>Time for your skin to drink water.</li>
          <li>
            Time for the makeup to set before you pull that dress over your
            head.
          </li>
        </ul>
        <p>
          I always tell my brides: <em
            >We're aiming for effortless radiance, not rushed.</em
          >
        </p>

        <!-- Section 2 -->
        <h2 id="what-changes-timeline">
          2) What <span class="heading-gradient">Changes</span> Your Timeline
        </h2>
        <p>
          Every wedding is different, but these variables always dictate the
          clock:
        </p>
        <ul>
          <li>
            <strong>Headcount:</strong> Bride + bridesmaids + moms + flower girls?
          </li>
          <li>
            <strong>Artist count:</strong> Just me, or do I bring my hair team?
          </li>
          <li>
            <strong>Location:</strong> Getting ready at home in Waterkloof versus
            a venue in Cullinan?
          </li>
          <li>
            <strong>Ceremony time:</strong> 10 AM church weddings require a 4 AM
            alarm (coffee included).
          </li>
          <li>
            <strong>Photo schedule:</strong> First look? Detail shots of the dress?
            I need to finish before the photographer arrives.
          </li>
        </ul>
        <p>
          <strong>Simple math:</strong> More faces = earlier start, or I bring
          an assistant.
        </p>

        <!-- Section 3 -->
        <h2 id="baseline-schedule">
          3) Baseline <span class="heading-gradient">Schedule</span> (Bride Only)
        </h2>
        <p>This works for solo brides or bride-plus-one.</p>
        <p><strong>Example: Ceremony at 15:00</strong></p>
      </div>

      <!-- Timeline Table -->
      <div class="not-prose overflow-x-auto">
        <table
          class="w-full text-sm border border-border rounded-lg overflow-hidden"
        >
          <thead>
            <tr class="bg-brand/5">
              <th class="px-4 py-3 text-left font-semibold text-brand">Time</th
              >
              <th class="px-4 py-3 text-left font-semibold">Activity</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr>
              <td class="px-4 py-3 font-medium whitespace-nowrap">09:30</td>
              <td class="px-4 py-3 text-muted-foreground"
                >Cleanse, moisturize, light breakfast (no greasy croissants!)</td
              >
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium whitespace-nowrap">10:00</td>
              <td class="px-4 py-3 text-muted-foreground"
                >I arrive, we prep skin, start base work</td
              >
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium whitespace-nowrap">12:00</td>
              <td class="px-4 py-3 text-muted-foreground"
                >Makeup complete, setting spray locked in</td
              >
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium whitespace-nowrap"
                >12:00&ndash;13:00</td
              >
              <td class="px-4 py-3 text-muted-foreground"
                >Get dressed, calm time, champagne with the girls</td
              >
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium whitespace-nowrap">13:00</td>
              <td class="px-4 py-3 text-muted-foreground"
                >Photos begin / Travel to venue</td
              >
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium whitespace-nowrap">15:00</td>
              <td class="px-4 py-3 text-muted-foreground">You say "I do"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="prose prose-brand max-w-none dark:prose-invert">
        <div
          class="bg-brand/10 border-l-4 border-brand p-6 my-8 not-prose rounded-r-lg"
        >
          <p
            class="text-sm font-semibold text-brand uppercase tracking-wider mb-2"
          >
            Early ceremony?
          </p>
          <p class="text-muted-foreground">
            Move everything back accordingly. 11 AM ceremony means I'm setting
            up at 06:00.
          </p>
        </div>

        <!-- Section 4 -->
        <h2 id="bridal-party-schedule">
          4) Bridal Party <span class="heading-gradient">Schedule</span> (2&ndash;6 People)
        </h2>
        <p>
          This is where mornings collapse if we don't plan it like a military
          operation (a friendly one).
        </p>
        <h3>The math I use</h3>
        <ul>
          <li><strong>Bride:</strong> 2&ndash;3 hours (you're the masterpiece).</li>
          <li><strong>Each additional face:</strong> 45&ndash;60 minutes.</li>
        </ul>

        <p>
          <strong>Example: Ceremony at 15:00, 5 faces total (you + 4 bridesmaids)</strong>
        </p>
      </div>

      <!-- Party Schedule Cards -->
      <div class="grid gap-6 sm:grid-cols-2 not-prose">
        <Card class="border-brand/10 bg-brand/5">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Option A: One Artist (Me)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="text-sm space-y-2 text-muted-foreground">
              <li><strong>06:30</strong> &ndash; First bridesmaid starts</li>
              <li><strong>10:30</strong> &ndash; You start (I need you fresh and last)</li>
              <li><strong>12:30</strong> &ndash; You're finished</li>
              <li><strong>13:00</strong> &ndash; Everyone dressed, photos begin</li>
              <li><strong>15:00</strong> &ndash; Ceremony</li>
            </ul>
          </CardContent>
        </Card>
        <Card class="border-brand/10 bg-brand/5">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Option B: Two Artists</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">
              08:00&ndash;09:00 start time (depending on hair complexity and travel).
              Two artists working in parallel cuts total time roughly in half.
            </p>
          </CardContent>
        </Card>
      </div>

      <div class="prose prose-brand max-w-none dark:prose-invert">
        <div
          class="bg-brand/10 border-l-4 border-brand p-6 my-8 not-prose rounded-r-lg"
        >
          <p
            class="text-sm font-semibold text-brand uppercase tracking-wider mb-2"
          >
            Pro tip from the trenches
          </p>
          <p class="text-muted-foreground">
            Have your bridesmaids arrive with clean, moisturized skin. No heavy
            SPF that pills, no "I'll just do my own mascara" last-minute
            changes. We stick to the schedule so you're not rushing to the altar.
          </p>
        </div>

        <!-- Section 5 -->
        <h2 id="on-location-vs-studio">
          5) On-Location vs. Studio <span class="heading-gradient">(The Pretoria Reality)</span>
        </h2>
        <p>
          I love coming to you&mdash;your light, your space, your vibe. But
          Pretoria traffic is a wildcard, and load shedding is real.
        </p>
        <h3>Travel buffers I recommend</h3>
        <ul>
          <li>
            <strong>20&ndash;40 minutes:</strong> In-city (Menlyn, Brooklyn,
            Lynnwood, Centurion).
          </li>
          <li>
            <strong>45&ndash;90 minutes:</strong> Outskirts (Vanderbijlpark,
            Sasolburg, Hartbeespoort).
          </li>
        </ul>
        <h3>Setup considerations</h3>
        <ul>
          <li>
            <strong>Load shedding backup:</strong> I bring battery-powered ring
            lights, but good natural light from a north-facing window is gold.
          </li>
          <li>
            <strong>Space:</strong> A proper bridal suite at your venue saves us
            30 minutes of setup time.
          </li>
        </ul>
        <p>
          Travel may be quoted depending on distance and start location. If you're
          getting ready at home in Waterkloof or a guest house in Nieuw
          Muckleneuk, we'll discuss parking and power when you book.
        </p>

        <!-- Inline CTA -->
      </div>

      <div class="my-12 not-prose">
        <Card
          class="border-brand/20 shadow-lg bg-brand/5 relative overflow-hidden"
        >
          <div
            class="absolute -right-12 -top-12 size-48 rounded-full bg-brand/5"
          ></div>
          <CardContent class="p-8 text-center relative">
            <h3 class="font-display text-2xl font-semibold mb-3">
              Book your bridal makeup
            </h3>
            <p class="text-muted-foreground mb-6">
              Megan offers professional <a
                href="/services/bridal-makeup"
                class="text-brand font-medium hover:underline"
                >bridal makeup in Pretoria</a
              > and surrounds.
            </p>
            <Button
              href={whatsappLink}
              size="lg"
              class="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Book on WhatsApp
              <MessageCircle class="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div class="prose prose-brand max-w-none dark:prose-invert">
        <!-- Section 6 -->
        <h2 id="trial-timing">
          6) Trial <span class="heading-gradient">Timing</span> (When to Do It)
        </h2>
        <p>
          A trial isn't a luxury&mdash;it's insurance. We're not guessing on
          your wedding day.
        </p>
        <h3>When to book it</h3>
        <ul>
          <li>
            <strong>4&ndash;8 weeks out:</strong> Ideal. Your skin is in
            wedding-prep mode, but we have time to adjust.
          </li>
          <li>
            <strong>Earlier:</strong> If you're changing hair color, doing laser
            treatments, or if you're an international bride flying in.
          </li>
        </ul>
        <h3>How to prep for your trial</h3>
        <ul>
          <li>
            Don't test new actives (retinoids, acids) the week before.
          </li>
          <li>Send me inspiration pics&mdash;Pinterest boards are welcome.</li>
          <li>
            Sort your brows, tan, and lash extensions <em>before</em> the trial so
            we see the real canvas.
          </li>
          <li>
            <strong>Pro tip:</strong> If you can, schedule your trial at a similar
            time of day to your ceremony so we test how your skin behaves in that
            light.
          </li>
        </ul>
        <p>
          Read more about perfect prep: <a
            href="/makeup-guides/skin-prep-before-makeup"
            class="text-brand hover:underline font-medium"
            >Skin Prep Before Makeup</a
          >.
        </p>

        <!-- Section 7 -->
        <h2 id="week-of-checklist">
          7) Week-Of <span class="heading-gradient">Checklist</span>
        </h2>
        <p>Keep it simple. Keep it calm.</p>
        <ul>
          <li>
            <strong>7&ndash;10 days out:</strong> Stop all new skincare experiments.
            No "miracle" acids from Instagram.
          </li>
          <li><strong>3 days out:</strong> Gentle exfoliation only.</li>
          <li><strong>Daily:</strong> Hydrate like it's your job.</li>
          <li>
            <strong>Brows:</strong> Do them 3&ndash;4 days prior (not the morning
            of&mdash;redness is real).
          </li>
          <li>
            <strong>Spray tan:</strong> Test it first&mdash;undertones matter,
            and we want your photos to stay true-to-you.
          </li>
        </ul>
        <p>
          Want the full deep-dive? Here's my <a
            href="/makeup-guides/skin-prep-before-makeup"
            class="text-brand hover:underline font-medium"
            >complete skin prep protocol</a
          >.
        </p>

        <!-- Section 8 -->
        <h2 id="touch-up-kit">
          8) Your <span class="heading-gradient">Touch-Up</span> Kit
        </h2>
        <p>You don't need a suitcase. You need a clutch with:</p>
        <ul>
          <li>Blotting paper (Highveld humidity is no joke)</li>
          <li>Your lip color (I'll give you a sample pot)</li>
          <li>Pressed powder (small)</li>
          <li>
            Tissues and cotton buds (for corner-of-the-eye situations)
          </li>
          <li>Mini fragrance and mints</li>
        </ul>
        <p>
          <strong>Optional:</strong> Setting spray (only if your skin tolerates
          it&mdash;we'll test this at trial).
        </p>

        <!-- Section 9 -->
        <h2 id="common-timing-mistakes">
          9) Common Timing <span class="heading-gradient">Mistakes</span> (And How I Fix Them)
        </h2>
      </div>

      <!-- Mistakes Cards -->
      <div class="grid gap-4 not-prose">
        <Card class="border-destructive/10 bg-destructive/5">
          <CardContent class="p-6">
            <div class="flex items-start gap-3">
              <AlertTriangle
                class="size-5 shrink-0 mt-0.5 text-destructive"
              />
              <div>
                <p class="font-semibold text-sm">
                  "We'll start at 10 and be done by 12."
                </p>
                <p class="text-sm text-muted-foreground mt-1">
                  <strong class="text-brand">Fix:</strong> We work backwards from
                  the ceremony, then add 30 minutes of buffer. Always.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border-destructive/10 bg-destructive/5">
          <CardContent class="p-6">
            <div class="flex items-start gap-3">
              <AlertTriangle
                class="size-5 shrink-0 mt-0.5 text-destructive"
              />
              <div>
                <p class="font-semibold text-sm">
                  Six faces, one artist, 10 AM ceremony.
                </p>
                <p class="text-sm text-muted-foreground mt-1">
                  <strong class="text-brand">Fix:</strong> I bring a second artist,
                  or we start at 05:30. I've done it; it's doable if we plan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border-destructive/10 bg-destructive/5">
          <CardContent class="p-6">
            <div class="flex items-start gap-3">
              <AlertTriangle
                class="size-5 shrink-0 mt-0.5 text-destructive"
              />
              <div>
                <p class="font-semibold text-sm">
                  No time built in for dressing.
                </p>
                <p class="text-sm text-muted-foreground mt-1">
                  <strong class="text-brand">Fix:</strong> Makeup finishes 2 hours
                  before you need to leave. Full stop.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="border-destructive/10 bg-destructive/5">
          <CardContent class="p-6">
            <div class="flex items-start gap-3">
              <AlertTriangle
                class="size-5 shrink-0 mt-0.5 text-destructive"
              />
              <div>
                <p class="font-semibold text-sm">
                  New "miracle" serum 2 days before.
                </p>
                <p class="text-sm text-muted-foreground mt-1">
                  <strong class="text-brand">Fix:</strong> If you haven't used it
                  for a month, don't use it now. Calm skin beats "glowy experiments"
                  every time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="prose prose-brand max-w-none dark:prose-invert">
        <!-- Section 10 -->
        <h2 id="booking-checklist">
          10) Booking <span class="heading-gradient">Checklist</span> (WhatsApp This)
        </h2>
        <p>Copy and paste this to me:</p>
      </div>

      <!-- Booking Template -->
      <div class="not-prose">
        <Card class="border-brand/20 bg-brand/5">
          <CardContent class="p-6 space-y-3 text-sm">
            <p class="font-semibold">Hi Megan!</p>
            <ul class="space-y-2">
              <li><strong>Wedding date:</strong> _____</li>
              <li>
                <strong>Venue area:</strong> (Pretoria suburb or town) _____
              </li>
              <li><strong>Ceremony time:</strong> _____</li>
              <li>
                <strong>Service needed:</strong> Bridal only / Bridal + party /
                Hair + Makeup
              </li>
              <li><strong>Number of people:</strong> _____</li>
              <li>
                <strong>Start location:</strong> Venue / Home / Accommodation
              </li>
              <li><strong>Known sensitivities:</strong> _____</li>
              <li><strong>Trial needed?</strong> Yes / No</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div class="prose prose-brand max-w-none dark:prose-invert">
        <p>
          <strong>What happens next:</strong> I'll confirm availability and send
          a quote once I have your details. To secure your date, bookings are
          confirmed with a deposit.
        </p>

        <!-- Still Choosing Section -->
        <h2>
          Still Choosing Your <span class="heading-gradient">Package?</span>
        </h2>
        <p>If you're deciding between services, here's where to start:</p>
        <ul>
          <li>
            <a
              href="/services/bridal-makeup"
              class="text-brand hover:underline font-medium"
              >Bridal Makeup</a
            > &ndash; The essentials for your big day.
          </li>
          <li>
            <a
              href="/services/wedding-packages"
              class="text-brand hover:underline font-medium"
              >Wedding Packages</a
            > &ndash; Bundled options for bride + party.
          </li>
          <li>
            <a
              href="/services/bridal-hair-and-makeup"
              class="text-brand hover:underline font-medium"
              >Bridal Hair + Makeup</a
            > &ndash; The full transformation with my trusted hair team.
          </li>
        </ul>

        <h2 id="faqs">
          Frequently Asked <span class="heading-gradient">Questions</span>
        </h2>
      </div>

      <!-- FAQ Section -->
      <div class="space-y-4">
        {#each faqs as faq}
          <details
            class="group rounded-lg border border-border px-6 py-4 bg-background"
          >
            <summary
              class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden"
            >
              {faq.question}
              <ChevronRight
                class="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90"
              />
            </summary>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        {/each}
      </div>

      <!-- Final CTA -->
      <section class="border-t pt-12">
        <div class="flex flex-col items-center text-center">
          <div class="mb-6 h-px w-12 bg-brand"></div>
          <h2 class="font-display text-4xl font-semibold tracking-tight">
            Ready to <span class="heading-gradient">book?</span>
          </h2>
          <p class="mt-4 text-muted-foreground max-w-lg">
            Use the contact page or WhatsApp me your wedding date, venue area,
            ceremony time, and how many people need makeup.
          </p>
          <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              href={whatsappLink}
              size="lg"
              class="bg-brand text-brand-foreground hover:bg-brand/90 px-8 h-12"
            >
              Book on WhatsApp
              <MessageCircle class="ml-2 size-5" />
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              class="px-8 h-12"
            >
              Send an Enquiry
            </Button>
          </div>
        </div>
      </section>
    </article>

    <!-- Sidebar (Desktop Sticky) -->
    <aside class="hidden md:block">
      <div class="sticky top-24">
        {@render sidebarCTA()}
      </div>
    </aside>
  </div>
</div>

{#snippet sidebarCTA()}
  <Card class="border-brand/20 shadow-xl overflow-hidden group">
    <CardHeader class="bg-brand/5 border-b border-brand/10">
      <CardTitle class="flex items-center gap-2 text-xl">
        <Phone class="size-5 text-brand" />
        Ready to check your date?
      </CardTitle>
      <CardDescription class="text-brand/80 font-medium"
        >Check availability for your wedding date</CardDescription
      >
    </CardHeader>
    <CardContent class="grid gap-8 p-6">
      <div class="space-y-4">
        <p
          class="text-sm font-semibold uppercase tracking-wider text-muted-foreground/60"
        >
          Include in message:
        </p>
        <ul class="grid gap-3">
          <li class="flex items-start gap-3 text-sm">
            <div
              class="size-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mt-0.5"
            >
              <span class="text-[10px] font-bold text-brand">1</span>
            </div>
            <span>Wedding Date & Ceremony Time</span>
          </li>
          <li class="flex items-start gap-3 text-sm">
            <div
              class="size-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mt-0.5"
            >
              <span class="text-[10px] font-bold text-brand">2</span>
            </div>
            <span>Venue / Getting-Ready Location</span>
          </li>
          <li class="flex items-start gap-3 text-sm">
            <div
              class="size-5 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mt-0.5"
            >
              <span class="text-[10px] font-bold text-brand">3</span>
            </div>
            <span>Number of Faces</span>
          </li>
        </ul>
      </div>

      <div class="grid gap-3 pt-4">
        <Button
          href={whatsappLink}
          class="w-full h-12 bg-brand text-brand-foreground hover:bg-brand/90 shadow-md"
        >
          WhatsApp Megan
          <MessageCircle class="ml-2 size-4" />
        </Button>
        <Button
          href="/contact"
          variant="ghost"
          class="w-full text-muted-foreground hover:text-brand"
        >
          Send an Enquiry
        </Button>
      </div>
    </CardContent>
    <div class="h-1 w-full bg-brand"></div>
  </Card>
{/snippet}

<style>
  .hero-stagger {
    animation: hero-fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes hero-fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-stagger {
      animation: none !important;
    }
  }

  :global(.prose h2) {
    scroll-margin-top: 6rem;
    font-family: var(--font-display);
    font-weight: 600;
  }

  :global(.prose img) {
    border-radius: 1rem;
  }

  :global(.prose a) {
    color: #d68e85;
    font-weight: 500;
    text-decoration: none;
  }

  :global(.prose a:hover) {
    text-decoration: underline;
  }
</style>
