// Shared Sanity document and field types

export interface SanityImageAsset {
  _ref?: string;
  url?: string;
}

export interface SanityImage {
  asset?: SanityImageAsset;
  alt?: string;
}

export interface SanitySlug {
  current: string;
}

export interface SanitySeo {
  metaTitle?: string;
  metaDescription?: string;
  shareImage?: SanityImage;
}

export interface SanitySection {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export interface MenuServiceItem {
  _key: string;
  title?: string;
  timeLabel?: string;
  description?: string;
  priceFrom?: number;
  priceLabel?: string;
  image?: SanityImage;
}

export interface GalleryImage extends SanityImage {
  _key: string;
  alt?: string;
}

export interface StatItem {
  _key: string;
  value?: string;
  label?: string;
}

export interface SanityHours {
  days?: string;
  hours: string;
}

export interface SanityKitchenHours {
  label?: string;
  hours: string;
}

export interface SanitySocialLink {
  platform: string;
  url: string;
}

export interface SiteSettings {
  address?: string;
  phone?: string;
  email?: string;
  footerDescription?: string;
  restaurantHours?: SanityHours[];
  kitchenHours?: SanityKitchenHours[];
  socialLinks?: SanitySocialLink[];
  newsletterLabel?: string;
  newsletterSubtext?: string;
  newsletterButtonLabel?: string;
  ctaBookTableUrl?: string;
  breadcrumbHomeLabel?: string;
}
