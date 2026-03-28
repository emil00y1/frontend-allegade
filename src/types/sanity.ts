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
