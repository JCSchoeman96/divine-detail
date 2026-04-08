export interface ServicePriceRow {
  item: string;
  price: string;
}

export interface ServicePriceGroup {
  label: string;
  rows: ServicePriceRow[];
  note?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  updated_at?: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  badge?: string;
  icon: 'gem' | 'scissors' | 'star' | 'sparkles' | 'users';
  included: string[];
  excluded: string[];
  process: ProcessStep[];
  audience: {
    description: string;
    items: string[];
  };
  pricing: ServicePriceGroup[];
  addOns?: ServicePriceRow[];
  faq: FAQ[];
  relatedSlugs: string[];
}

const data: Record<string, ServiceData> = {
  'bridal-makeup': {
    slug: 'bridal-makeup',
    updated_at: '2026-02-17',
    title: 'Bridal Makeup',
    shortTitle: 'Bridal Makeup',
    metaTitle: 'Bridal Makeup Artist Pretoria | Divine Detail',
    metaDescription:
      'Bridal makeup artist in Pretoria, Gauteng for brides who want soft, timeless glam that still feels like them. Includes trial and lashes. Serving Centurion, Midrand, Sandton, and Johannesburg.',
    heroDescription:
      'Your wedding makeup should feel beautiful, comfortable, and true to you. This service is for brides who want a calm, well-planned experience and a look that lasts from the first photo to the last dance without feeling heavy or overdone.',
    badge: 'Most Popular',
    icon: 'gem',
    included: [
      'A pre-wedding chat about your look, dress, venue, and overall feel',
      'A full bridal trial 2 to 4 weeks before the wedding',
      'Wedding-day makeup application',
      'Premium lashes, if they suit the look you want',
      'Long-wearing makeup designed for real South African wedding days',
      'A simple touch-up kit to keep with you',
    ],
    excluded: [
      'Hair styling (available separately or as a combo package)',
      'Skincare products or facial treatments',
      'Travel beyond 30\u00A0km from Moreleta Park (travel fee applies)',
    ],
    process: [
      {
        title: 'Consultation',
        description:
          'We talk through your wedding style, your dress, your venue, your inspiration, and what makes you feel most like yourself.',
      },
      {
        title: 'Trial Session',
        description:
          'Your trial is where we shape the final look together. We make adjustments, check how it photographs, and make sure you feel fully comfortable before the day arrives.',
      },
      {
        title: 'Wedding Day',
        description:
          'On the day, everything is done with calm timing in mind. Your makeup is finished fresh for photos and the ceremony, and you leave the chair feeling ready, not rushed.',
      },
    ],
    audience: {
      description:
        'This is for brides who want their makeup to feel polished but still personal.',
      items: [
        'Brides who want a soft, timeless look that lasts well',
        'Brides who want a proper trial before the day',
        'Brides who want to feel like themselves, only more radiant and confident',
      ],
    },
    pricing: [
      {
        label: 'Bridal',
        rows: [
          { item: 'Bridal Makeup (incl. trial & lashes)', price: 'R1,500' },
        ],
      },
      {
        label: 'Wedding Party',
        rows: [
          { item: 'Bridesmaid Makeup', price: 'R500' },
          { item: 'Mother of Bride / Groom', price: 'R400' },
        ],
      },
    ],
    addOns: [
      { item: 'Standalone Trial Session', price: 'R400' },
      { item: 'Lash Application', price: 'R50' },
      { item: 'Extra Person', price: 'R400' },
    ],
    faq: [
      {
        question: 'How far in advance should I book?',
        answer:
          'For weddings, earlier is always better. I recommend 3 to 6 months ahead, especially for busy seasons and popular weekends.',
      },
      {
        question: 'Do you travel to my venue?',
        answer:
          'Yes. I\u2019m based in Pretoria and travel across Gauteng. Travel is quoted based on distance.',
      },
      {
        question: 'What makeup brands do you use?',
        answer:
          'I use long-wearing professional products chosen around your skin type, tone, and how your day is likely to unfold.',
      },
      {
        question: 'What if I don\u2019t like my trial look?',
        answer:
          'That\u2019s exactly why the trial matters. We adjust the look until it feels right for you.',
      },
      {
        question: 'Is the trial included?',
        answer:
          'Yes. The bridal makeup price includes your trial, wedding-day application, and lashes.',
      },
      {
        question: 'Can you do bridesmaids and my mom as well?',
        answer:
          'Yes, absolutely. I can include bridesmaids, mothers, and other key people in your morning plan.',
      },
    ],
    relatedSlugs: ['bridal-hair', 'bridal-hair-and-makeup', 'wedding-packages'],
  },

  'bridal-hair': {
    slug: 'bridal-hair',
    updated_at: '2026-02-17',
    title: 'Bridal Hair Styling',
    shortTitle: 'Bridal Hair',
    metaTitle: 'Bridal Hair Stylist Pretoria | Divine Detail',
    metaDescription:
      'Bridal hair styling in Pretoria, Gauteng with soft waves and elegant upstyles for brides and bridal parties. Serving Centurion, Midrand, and Johannesburg.',
    heroDescription:
      'Your wedding hair should feel like part of the whole picture \u2014 your dress, your neckline, your veil, your features, and the mood of your day. Whether you love soft waves or something more structured, the goal is a style that feels beautiful and secure without feeling stiff.',
    icon: 'scissors',
    included: [
      'A pre-wedding discussion about the hairstyle you want',
      'Wedding-morning styling',
      'Heat protection and finishing products',
      'Secure pinning for styles that need to hold all day',
      'Styling chosen with Gauteng weather and real wedding movement in mind',
    ],
    excluded: [
      'Makeup application (available separately or as a combo package)',
      'Hair extensions or hairpieces (bring your own and they will be styled in)',
      'Hair washing or blow-dry prep (arrive with clean, dry hair)',
    ],
    process: [
      {
        title: 'Consultation',
        description:
          'We talk through the look you want, what will suit your dress and accessories, and what makes sense for your hair length and texture.',
      },
      {
        title: 'Hair Preparation',
        description:
          'I\u2019ll tell you how to prep your hair beforehand so it holds properly and feels its best on the day.',
      },
      {
        title: 'Wedding Day',
        description:
          'Your hair is styled on the wedding morning in a calm, planned order so everything flows well and no one feels rushed.',
      },
    ],
    audience: {
      description:
        'For brides and bridal parties who want elegant, well-finished hair that still feels soft and wearable.',
      items: [
        'Brides wanting a blow wave, upstyle, or half-up-half-down look',
        'Bridal parties who want coordinated styling for everyone',
        'Mothers and grandmothers of the bride or groom',
      ],
    },
    pricing: [
      {
        label: 'Bridal Hair',
        rows: [
          { item: 'Blow wave (short hair)', price: 'R450' },
          { item: 'Blow wave (long hair)', price: 'R550' },
          { item: 'Upstyle (short hair)', price: 'R850' },
          { item: 'Upstyle (long hair)', price: 'R1,100' },
        ],
      },
      {
        label: 'Bridesmaid Hair',
        rows: [
          { item: 'Blow wave (short)', price: 'R350' },
          { item: 'Blow wave (long)', price: 'R450' },
          { item: 'Upstyle (short)', price: 'R650' },
          { item: 'Upstyle (long)', price: 'R850' },
        ],
      },
      {
        label: 'Mother of Bride / Groom',
        rows: [
          { item: 'Blow wave (short)', price: 'R350' },
          { item: 'Blow wave (long)', price: 'R450' },
          { item: 'Upstyle (short)', price: 'R650' },
          { item: 'Upstyle (long)', price: 'R850' },
        ],
      },
      {
        label: 'Grandmother',
        rows: [
          { item: 'Short hair', price: 'R300' },
          { item: 'Long hair', price: 'R400' },
        ],
      },
    ],
    faq: [
      {
        question: 'What\u2019s the difference between a blow wave and an upstyle?',
        answer:
          'A blow wave gives you soft volume, curls, or waves that fall naturally. An upstyle is more pinned and structured.',
      },
      {
        question: 'How do you decide short vs long hair?',
        answer:
          'Usually shoulder length or above counts as short, and below the shoulders counts as long. If you\u2019re unsure, send a photo and I\u2019ll confirm.',
      },
      {
        question: 'Can you work with hair extensions?',
        answer:
          'Yes. Bring your own extensions and I\u2019ll blend and style them with your natural hair.',
      },
      {
        question: 'Should I wash my hair before the wedding?',
        answer:
          'I\u2019ll guide you based on your hair type, but in many cases hair that isn\u2019t freshly washed holds styling better.',
      },
      {
        question: 'Do you offer a hair trial?',
        answer:
          'Hair trials can be arranged separately if needed.',
      },
    ],
    relatedSlugs: ['bridal-makeup', 'bridal-hair-and-makeup', 'wedding-packages'],
  },

  'wedding-packages': {
    slug: 'wedding-packages',
    updated_at: '2026-02-17',
    title: 'Wedding Packages',
    shortTitle: 'Wedding Packages',
    metaTitle: 'Wedding Hair & Makeup Packages Pretoria | Divine Detail',
    metaDescription:
      'Wedding hair and makeup packages in Pretoria for brides and bridal parties who want a calm, organised morning. Packages from R2,650 across Gauteng.',
    heroDescription:
      'Wedding mornings can become chaotic very quickly when several people need hair and makeup. These packages are designed to make the morning feel smoother, more organised, and easier for everyone involved.',
    badge: 'Best Value',
    icon: 'star',
    included: [
      'Bridal service for the bride',
      'Services for 3 additional people',
      'A bridal trial where makeup is included',
      'On-location service',
      'A proper getting-ready timeline so no one is rushed',
    ],
    excluded: [
      'Travel beyond 30\u00A0km from Moreleta Park (travel fee of R5/km applies)',
      'Hair extensions or hairpieces (bring your own)',
      'Skincare or facial treatments',
    ],
    process: [
      {
        title: 'Package Consultation',
        description:
          'We talk through exactly who needs what, where everyone will be getting ready, and how to make the morning run smoothly.',
      },
      {
        title: 'Bridal Trial',
        description:
          'If makeup is part of your package, we use the trial to finalise your bridal look in advance.',
      },
      {
        title: 'Wedding Morning',
        description:
          'Everyone is worked through in an organised order so the bride is ready fresh and the group feels calm.',
      },
    ],
    audience: {
      description:
        'For bridal parties who want everything handled properly, with less stress and better value.',
      items: [
        'Brides with a bridal party of 4 or more people',
        'Anyone wanting to bundle hair and makeup for savings',
        'Wedding planners coordinating beauty services for the full party',
      ],
    },
    pricing: [
      {
        label: 'Makeup Packages',
        rows: [
          { item: 'Wedding Package \u2014 Makeup (Bride + 3)', price: 'R4,000' },
          { item: 'Additional Person', price: 'R400' },
        ],
        note: 'Includes bridal makeup with trial and lashes, plus 3 additional people.',
      },
      {
        label: 'Hair Packages',
        rows: [
          { item: 'Wedding Package \u2014 Hair (Bride + 3)', price: 'R2,650' },
        ],
        note: 'Includes bridal hair styling plus 3 additional people. Style and length upgrades available.',
      },
      {
        label: 'Full Hair & Makeup',
        rows: [
          { item: 'Full Wedding Package (Bride + 3)', price: 'From R6,650' },
        ],
        note: 'Complete hair and makeup for the bride and 3 additional people. Best value for full bridal parties.',
      },
    ],
    faq: [
      {
        question: 'Who counts as the \u201c3 additional people\u201d?',
        answer:
          'Anyone important to your morning \u2014 bridesmaids, moms, grandmothers, maid of honour, or others in your bridal party.',
      },
      {
        question: 'Can I add more than 3 people?',
        answer:
          'Yes. Extra people can be added and quoted clearly once I know the full group.',
      },
      {
        question: 'How long does the morning take for a full bridal party?',
        answer:
          'That depends on the services and the group size, but I\u2019ll give you a realistic timeline once I know the details.',
      },
      {
        question: 'Do you do hair and makeup simultaneously?',
        answer:
          'For larger groups, I may bring help or rotate services so the morning keeps moving well.',
      },
      {
        question: 'Is there a deposit to secure the package?',
        answer:
          'Yes. A 50% deposit secures your date. The remaining balance is due on the wedding day.',
      },
    ],
    relatedSlugs: ['bridal-makeup', 'bridal-hair', 'bridal-hair-and-makeup'],
  },

  'matric-farewell': {
    slug: 'matric-farewell',
    updated_at: '2026-02-17',
    title: 'Matric Farewell Makeup',
    shortTitle: 'Matric Farewell',
    metaTitle: 'Matric Farewell Makeup Pretoria | Divine Detail',
    metaDescription:
      'Matric farewell makeup in Pretoria, Gauteng with age-appropriate glam that feels fresh, lasts all evening, and photographs beautifully. Group bookings available.',
    heroDescription:
      'Matric farewell is a big moment, and your makeup should feel special without making you feel unlike yourself. The goal is fresh, flattering glam that suits your dress, your age, and your personality.',
    icon: 'sparkles',
    included: [
      'A look consultation around your dress and accessories',
      'Full makeup application with age-appropriate product choices',
      'Lash options if you want them',
      'Long-wearing makeup for the full evening',
      'A finish that still looks beautiful in every photo',
    ],
    excluded: [
      'Hair styling (available as an add-on \u2014 see pricing below)',
      'Skincare or facial treatments',
      'Travel beyond 30\u00A0km from Moreleta Park (travel fee applies)',
    ],
    process: [
      {
        title: 'Consultation',
        description:
          'We chat about your dress, your accessories, and the style you\u2019re going for, from soft and natural to more glam.',
      },
      {
        title: 'Farewell Day',
        description:
          'Your makeup is done with enough time for photos before you leave, so everything feels smooth and not rushed.',
      },
    ],
    audience: {
      description:
        'For matric girls who want to feel confident, beautiful, and still like themselves on farewell night.',
      items: [
        'Matric learners in Pretoria, Centurion, Midrand, and surrounding areas',
        'Parents booking a professional makeup experience for their child',
        'Friend groups wanting to get ready together with a professional artist',
      ],
    },
    pricing: [
      {
        label: 'Farewell Makeup',
        rows: [{ item: 'Matric Farewell Makeup', price: 'R500' }],
      },
      {
        label: 'Add Hair Styling',
        rows: [
          { item: 'Blow wave (short hair)', price: 'R350' },
          { item: 'Blow wave (long hair)', price: 'R450' },
        ],
      },
    ],
    addOns: [{ item: 'Lash Application', price: 'R50' }],
    faq: [
      {
        question: 'How early should I book for my matric farewell?',
        answer:
          'Farewell dates fill quickly, especially in peak season, so don\u2019t leave it too late.',
      },
      {
        question: 'Can my friends and I get ready together?',
        answer:
          'Yes, definitely. Group bookings are a fun option, and I can advise on timing once I know the group size.',
      },
      {
        question: 'Will the makeup be age-appropriate?',
        answer:
          'Yes. The look is always tailored so it feels special, flattering, and suitable for farewell.',
      },
      {
        question: 'How long does the application take?',
        answer:
          'About 45\u201360 minutes per person. For a group of 3 friends, plan for about 2.5\u20133 hours total. I\u2019ll give you a timeline once the booking is confirmed.',
      },
      {
        question: 'What should I do to prepare my skin?',
        answer:
          'Moisturise well in the days leading up. Avoid trying new skincare products the week before. Come with a clean, moisturised face \u2014 no foundation or base products.',
      },
      {
        question: 'Do you travel to my location?',
        answer:
          'Yes. I\u2019m based in Moreleta Park, Pretoria, and travel across Centurion, Midrand, and surrounding areas. Travel is charged at R5 per kilometre (to your location and back).',
      },
    ],
    relatedSlugs: ['special-events', 'bridal-makeup'],
  },

  'special-events': {
    slug: 'special-events',
    updated_at: '2026-02-17',
    title: 'Special Event Makeup',
    shortTitle: 'Special Events',
    metaTitle: 'Event Makeup Artist Pretoria | Divine Detail',
    metaDescription:
      'Special event makeup artist in Pretoria, Gauteng for birthdays, engagements, shoots, and formal events. Soft glam to elevated glam with on-location service across Centurion, Midrand, and Johannesburg.',
    heroDescription:
      'Whether it\u2019s a birthday, engagement, shoot, dinner, or formal event, this service is for women who want to feel beautiful, confident, and a little more polished than everyday \u2014 without feeling too done.',
    icon: 'sparkles',
    included: [
      'A quick look consultation around your outfit and event',
      'Soft glam or fuller glam, depending on what you love',
      'Long-wearing application',
      'Makeup that looks good in daylight, evening light, and photos',
    ],
    excluded: [
      'Hair styling (available as an add-on \u2014 see pricing below)',
      'Skincare or facial treatments',
      'Travel beyond 30\u00A0km from Moreleta Park (travel fee applies)',
    ],
    process: [
      {
        title: 'Consultation',
        description:
          'We talk about your outfit, the mood of the event, and how soft or glam you want to go.',
      },
      {
        title: 'Application',
        description:
          'I arrive with everything needed, and your makeup is applied to feel comfortable, flattering, and event-ready.',
      },
    ],
    audience: {
      description:
        'For women who want to feel dressed up, confident, and beautifully put together for a special occasion.',
      items: [
        'Birthday celebrations and milestone events',
        'Engagement parties and anniversary dinners',
        'Professional photo shoots and personal branding sessions',
        'Corporate events, galas, and formal functions',
      ],
    },
    pricing: [
      {
        label: 'Event Makeup',
        rows: [{ item: 'Special Event Makeup', price: 'R500' }],
      },
      {
        label: 'Add Hair Styling',
        rows: [
          { item: 'Blow wave (short hair)', price: 'R350' },
          { item: 'Blow wave (long hair)', price: 'R450' },
        ],
      },
    ],
    addOns: [
      { item: 'Lash Application', price: 'R50' },
      { item: 'Extra Person', price: 'R400' },
    ],
    faq: [
      {
        question: 'What occasions do you cater for?',
        answer:
          'Birthdays, dinners, engagement parties, shoots, work functions, galas, and any event where you want to feel extra beautiful.',
      },
      {
        question: 'Can you do makeup for a group?',
        answer:
          'Yes. Group bookings are welcome. Tell me how many people need makeup and I\u2019ll plan the timing accordingly.',
      },
      {
        question: 'How long does the makeup last?',
        answer:
          'It is designed to wear beautifully for the full event, with the right prep and products for your skin.',
      },
      {
        question: 'Do you do on-location makeup?',
        answer:
          'Yes. I bring everything to your home, hotel, or event venue. Based in Moreleta Park, Pretoria, with travel across Centurion, Midrand, Sandton, and Johannesburg at R5 per kilometre.',
      },
    ],
    relatedSlugs: ['matric-farewell', 'bridal-makeup'],
  },

  'bridal-hair-and-makeup': {
    slug: 'bridal-hair-and-makeup',
    updated_at: '2026-02-17',
    title: 'Bridal Hair & Makeup',
    shortTitle: 'Hair & Makeup',
    metaTitle: 'Bridal Hair & Makeup Pretoria | Divine Detail',
    metaDescription:
      'Bridal hair and makeup in Pretoria, Gauteng for brides who want one calm, coordinated booking. Packages from R1,950 with bridal party rates available.',
    heroDescription:
      'If you\u2019d rather have one trusted person guide both your hair and your makeup, this is the easiest way to do it. Everything is planned together so your full look feels balanced, calm, and beautifully put together.',
    badge: 'Most Popular',
    icon: 'gem',
    included: [
      'One pre-wedding discussion covering both hair and makeup',
      'Bridal makeup trial before the wedding',
      'Wedding-day makeup with lashes',
      'Wedding-day hair styling',
      'A coordinated morning timeline',
      'A simple touch-up kit for later in the day',
    ],
    excluded: [
      'Hair extensions or hairpieces (bring your own and they\u2019ll be styled in)',
      'Skincare or facial treatments',
      'Travel beyond 30\u00A0km from Moreleta Park (travel fee of R5/km applies)',
    ],
    process: [
      {
        title: 'Consultation',
        description:
          'We plan your full look together so your hair, makeup, dress, and accessories all work together naturally.',
      },
      {
        title: 'Makeup Trial',
        description:
          'We finalise the makeup beforehand and use that time to confirm the overall direction for the full bridal look.',
      },
      {
        title: 'Wedding Morning',
        description:
          'Hair and makeup are done in a calm sequence so the final result feels cohesive and the morning flows smoothly.',
      },
    ],
    audience: {
      description:
        'For brides who want one point of contact, one calm process, and one beautifully coordinated final look.',
      items: [
        'Brides who prefer a single point of contact for all beauty services',
        'Brides who want their hair and makeup to work together as a cohesive look',
        'Smaller weddings where one artist can comfortably handle the full party',
      ],
    },
    pricing: [
      {
        label: 'Bridal',
        rows: [
          { item: 'Bridal Hair & Makeup', price: 'From R1,950' },
        ],
        note: 'Includes bridal makeup (with trial & lashes) plus hair styling. Final price depends on hair length and style choice.',
      },
      {
        label: 'Wedding Party',
        rows: [
          { item: 'Bridesmaid Hair & Makeup', price: 'From R850' },
          { item: 'Mother Hair & Makeup', price: 'From R750' },
        ],
        note: 'Final price depends on hair length and style choice.',
      },
      {
        label: 'Full Wedding Package',
        rows: [
          { item: 'Full Package (Bride + 3)', price: 'From R6,650' },
        ],
        note: 'Complete hair and makeup for the bride and 3 additional people. Best value for full bridal parties.',
      },
    ],
    faq: [
      {
        question: 'Is it better to book one person for both hair and makeup?',
        answer:
          'For many brides, yes. It simplifies the morning and helps the overall look feel more seamless.',
      },
      {
        question: 'Do you do hair or makeup first?',
        answer:
          'Usually hair first, then makeup, so your face feels fresh for photos and the ceremony.',
      },
      {
        question: 'What does \u201cFrom R1,950\u201d mean?',
        answer:
          'It means the final total depends on the hair option you choose, since different lengths and styles take different amounts of time.',
      },
      {
        question: 'How long does the full service take?',
        answer:
          'For the bride alone, allow around 1.5 to 2 hours. For bigger groups, I\u2019ll map out the timing properly.',
      },
      {
        question: 'Can I book just one of the two?',
        answer:
          'Yes. Hair and makeup can both be booked separately as standalone services.',
      },
    ],
    relatedSlugs: ['bridal-makeup', 'bridal-hair', 'wedding-packages'],
  },
};

export const services = data;
export const serviceList = Object.values(data);

export function getService(slug: string): ServiceData | undefined {
  return data[slug];
}
