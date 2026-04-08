<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import { Card, CardContent } from '$lib/components/ui/card/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { abs_url } from '$lib/config/site.js';
  import { build_whatsapp_url } from '$lib/config/social.js';

  const pageUrl = abs_url('/services');
  const socialImage = abs_url('/og-default.svg');
  const pageTitle = 'Makeup & Hair Services Hub Pretoria | Divine Detail';
  const pageDescription =
    'Explore bridal hair and makeup, wedding packages, special event, and matric farewell services in Pretoria and Gauteng. Choose what fits your day and book with confidence.';

  const whatsappBookingUrl = build_whatsapp_url(
    "Hi Megan! I'd like to book makeup. Service: _____. Date: _____. Area: Pretoria. Please confirm availability."
  );

  const teaserPriceBySlug = {
    'bridal-makeup': 'R1,500',
    'bridal-hair': 'R450',
    'bridal-hair-and-makeup': 'R1,950',
    'wedding-packages': 'R2,650',
    'special-events': 'R500',
    'matric-farewell': 'R500',
  } as const;

  type ServiceSlug = keyof typeof teaserPriceBySlug;

  const hubBlurbBySlug: Record<ServiceSlug, string> = {
    'bridal-makeup': 'Timeless bridal makeup that feels comfortable, lasts beautifully, and still feels like you.',
    'bridal-hair': 'Elegant wedding hair styled around your dress, your features, and the feel of your day.',
    'bridal-hair-and-makeup': 'One calm, coordinated booking for brides who want both hair and makeup handled together.',
    'wedding-packages': 'A practical, value-friendly option for brides who need beauty services for the full bridal party.',
    'special-events': 'Makeup for birthdays, engagements, shoots, and evenings out — from soft glam to more elevated glam.',
    'matric-farewell': 'Fresh, age-appropriate farewell glam that feels special without feeling too much.',
  };

  const serviceLabelBySlug: Record<ServiceSlug, string> = {
    'bridal-makeup': 'Bridal Makeup',
    'bridal-hair': 'Bridal Hair',
    'bridal-hair-and-makeup': 'Bridal Hair & Makeup',
    'wedding-packages': 'Wedding Packages',
    'special-events': 'Special Events',
    'matric-farewell': 'Matric Farewell',
  };

  const categories: { name: string; intro: string; slugs: ServiceSlug[] }[] = [
    {
      name: 'Bridal Services',
      intro:
        'Everything bridal, from makeup only to full hair-and-makeup packages for you and your bridal party.',
      slugs: ['bridal-makeup', 'bridal-hair', 'bridal-hair-and-makeup', 'wedding-packages'],
    },
    {
      name: 'Events & Matric',
      intro: 'For milestone moments, celebrations, and farewell nights when you want to look beautiful and feel confident.',
      slugs: ['special-events', 'matric-farewell'],
    },
  ];
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

<!-- Hub anti-cannibalization note: removed long-form details, full pricing tables, add-ons, inclusions/exclusions, FAQs, and process/timeline blocks. Detailed content lives on /services/[slug]. -->

<section class="py-20 sm:py-24">
  <div class="mx-auto max-w-5xl px-4 text-center">
    <Badge variant="outline" class="font-normal tracking-wide">Pretoria &middot; Gauteng</Badge>
    <h1 class="font-display mt-6 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
      Hair and makeup <span class="heading-gradient">services</span>
    </h1>
    <p class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
      Whether you’re getting married, dressing up for a special event, or
      planning your matric farewell, you’ll find the right service here. Choose
      the option that fits your day, and I’ll help you take it from there.
    </p>
  </div>
</section>

<Separator />

<section class="py-20 sm:py-24">
  <div class="mx-auto max-w-6xl px-4">
    <div class="space-y-14">
      {#each categories as category}
        <section aria-labelledby={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
          <h2
            id={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            class="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {category.name}
          </h2>
          <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {category.intro}
          </p>

          <div class="mt-7 grid gap-5 sm:grid-cols-2">
            {#each category.slugs as slug}
              <Card class="h-full">
                <CardContent class="flex h-full flex-col gap-4 pt-6">
                  <h3 class="font-display text-2xl font-semibold tracking-tight">
                    {serviceLabelBySlug[slug]}
                  </h3>
                  <p class="text-sm leading-relaxed text-muted-foreground">
                    {hubBlurbBySlug[slug]}
                  </p>

                  <div class="mt-auto rounded-lg border border-border bg-muted/40 p-3">
                    <p class="text-sm font-medium">
                      Starting from <span class="text-brand">{teaserPriceBySlug[slug]}</span>
                    </p>
                    <p class="mt-1 text-xs text-muted-foreground">
                      Final quote depends on date & location
                    </p>
                  </div>

                  <Button
                    href={`/services/${slug}`}
                    variant="outline"
                    aria-label={`View ${serviceLabelBySlug[slug]} service details`}
                  >
                    View {serviceLabelBySlug[slug]} Service
                    <ArrowRight class="size-4" />
                  </Button>
                </CardContent>
              </Card>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </div>
</section>

<Separator />

<section class="py-20 sm:py-24">
  <div class="mx-auto max-w-5xl px-4">
    <h2 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How <span class="heading-gradient">booking works</span></h2>

    <ol class="mt-8 grid gap-4 sm:grid-cols-2">
      <li class="rounded-xl border border-border bg-muted/30 p-5">
        <p class="text-xs font-medium uppercase tracking-widest text-brand">Step 1</p>
        <p class="mt-2 font-semibold">Choose the service that suits your day</p>
      </li>
      <li class="rounded-xl border border-border bg-muted/30 p-5">
        <p class="text-xs font-medium uppercase tracking-widest text-brand">Step 2</p>
        <p class="mt-2 font-semibold">Send your date and area</p>
      </li>
      <li class="rounded-xl border border-border bg-muted/30 p-5">
        <p class="text-xs font-medium uppercase tracking-widest text-brand">Step 3</p>
        <p class="mt-2 font-semibold">Receive your quote and secure your booking</p>
      </li>
      <li class="rounded-xl border border-border bg-muted/30 p-5">
        <p class="text-xs font-medium uppercase tracking-widest text-brand">Step 4</p>
        <p class="mt-2 font-semibold">We plan your final look together</p>
      </li>
    </ol>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button
        href="/contact"
        class="GA4_BookingBtn bg-brand text-brand-foreground hover:bg-brand/90"
      >
        Send an Enquiry
      </Button>
      <Button href={whatsappBookingUrl} variant="outline">WhatsApp Megan</Button>
    </div>
  </div>
</section>

<section class="border-t bg-brand/5">
  <div class="mx-auto max-w-5xl px-4 py-12 text-center">
    <p class="text-sm text-muted-foreground sm:text-base">
      Not sure which option fits best? Send me your date, area, and event
      type, and I’ll point you in the right direction.
    </p>
  </div>
</section>
