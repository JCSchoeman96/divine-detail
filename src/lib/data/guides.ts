export type GuideCategory = 'Skin Prep' | 'Bridal' | 'Matric' | 'Events';

export interface GuideData {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  updated_at: string; // YYYY-MM-DD
  hero_image: string;
  read_time_minutes: number;
  featured?: boolean;
}

const data: Record<string, GuideData> = {
  'skin-prep-before-makeup': {
    slug: 'skin-prep-before-makeup',
    title: 'Essential Skin Prep Checklist for Flawless Makeup',
    description:
      'Perfect makeup starts with calm, hydrated, and smooth skin. Use this checklist to prep for your wedding, matric farewell, or special event in Pretoria.',
    category: 'Skin Prep',
    updated_at: '2026-02-23',
    hero_image: '/images/guides/skin-prep-before-makeup.jpg',
    read_time_minutes: 10,
    featured: true,
  },
  'wedding-day-makeup-timeline-pretoria': {
    slug: 'wedding-day-makeup-timeline-pretoria',
    title: 'Wedding Day Makeup Timeline (Pretoria): A Calm, Photo-Ready Schedule',
    description:
      'Planning your wedding morning in Pretoria? Here\u2019s the realistic bridal makeup timeline I use\u2014from skin prep to final powder\u2014so you\u2019re radiant, not rushed.',
    category: 'Bridal',
    updated_at: '2026-03-04',
    hero_image: '/images/guides/woman-applies-makeup-home-front-mirror.webp',
    read_time_minutes: 8,
    featured: true,
  },
};

export const guides = data;

/**
 * Curated list of guides (manual order).
 */
export const guideList: GuideData[] = [
  data['skin-prep-before-makeup'],
  data['wedding-day-makeup-timeline-pretoria'],
];

/**
 * Helper to get the guide URL.
 */
export function getGuideUrl(slug: string) {
  return `/makeup-guides/${slug}`;
}
