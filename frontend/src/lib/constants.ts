export const SITE_NAME = "Sklentr Inc.";
export const SITE_DESCRIPTION =
  "Toronto-based MVP development studio. We build launch-ready products in weeks, not months.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost";

export const CONTACT = {
  email: "info@sklentr.com",
  phone: "+1 647-997-0557",
  location: "Toronto, Ontario, Canada",
  calendly: "https://calendly.com/sklentr",
} as const;

export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/company/sklentr",
  facebook: "https://facebook.com/sklentr",
  instagram: "https://instagram.com/sklentr",
  twitter: "https://x.com/sklentr",
} as const;

export const NAV_ITEMS = [
  { label: "Services", href: "/services" },
  { label: "Startup Visa", href: "/startup-visa" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export const STATS = {
  avgDelivery: "14",
  onTimeRate: "98",
  projectsShipped: "50",
  successRate: "98",
} as const;
