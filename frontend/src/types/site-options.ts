export interface HeroStat {
  value: string;
  label: string;
}

export interface ProblemItem {
  icon: string;
  title: string;
  text: string;
}

export interface WhyItem {
  icon: string;
  num: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface ProcessStep {
  icon: string;
  week: string;
  title: string;
  description: string;
}

export interface SVBenefit {
  text: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutOffice {
  city: string;
  type: string;
  description: string;
}

export interface SiteOptions {
  // Hero
  hero_label: string;
  hero_headline: string;
  hero_highlight_word: string;
  hero_muted_text: string;
  hero_subheading: string;
  hero_tagline: string;
  hero_cta_primary_text: string;
  hero_cta_primary_url: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_url: string;
  hero_stats: HeroStat[];

  // Problem
  problem_label: string;
  problem_title: string;
  problem_items: ProblemItem[];

  // Why Choose
  why_label: string;
  why_title: string;
  why_items: WhyItem[];

  // Stats
  stats_items: StatItem[];

  // Process
  process_label: string;
  process_title: string;
  process_subtitle: string;
  process_steps: ProcessStep[];

  // Startup Visa CTA
  sv_label: string;
  sv_title: string;
  sv_highlight: string;
  sv_benefits: SVBenefit[];
  sv_cta_text: string;
  sv_cta_url: string;

  // Final CTA
  fcta_label: string;
  fcta_title: string;
  fcta_description: string;
  fcta_primary_text: string;
  fcta_primary_url: string;
  fcta_secondary_text: string;
  fcta_secondary_url: string;

  // About Page
  about_label: string;
  about_title: string;
  about_description: string;
  about_stats: AboutStat[];
  about_values: AboutValue[];
  about_team_title: string;
  about_team_subtitle: string;
  about_offices: AboutOffice[];

  // About Page (continued)
  about_values_title: string;
  about_offices_title: string;

  // Marquee
  marquee_items_1: string[];
  marquee_items_2: string[];

  // Portfolio Page
  portfolio_label: string;
  portfolio_title: string;
  portfolio_subtitle: string;
  portfolio_stats: HeroStat[];

  // Services Page
  services_label: string;
  services_title: string;
  services_subtitle: string;

  // Blog Page
  blog_label: string;
  blog_title: string;
  blog_subtitle: string;

  // Pricing Page
  pricing_label: string;
  pricing_title: string;
  pricing_subtitle: string;
  pricing_guarantees_title: string;
  pricing_faq_title: string;

  // Startup Visa Page
  suv_hero_title: string;
  suv_hero_highlight: string;
  suv_hero_subtitle: string;
  suv_hero_stats: HeroStat[];
  suv_hard_truth_title: string;
  suv_hard_truth_points: string[];
  suv_mvp_title: string;
  suv_mvp_subtitle: string;
  suv_mvp_items: string[];
  suv_pricing_title: string;
  suv_pricing_price: string;
  suv_pricing_delivery: string;
  suv_pricing_comparison: string;
  suv_final_title: string;
  suv_final_subtitle: string;

  // Footer
  footer_company_links: NavItem[];
  footer_service_links: NavItem[];
  footer_legal_links: NavItem[];

  // General
  site_name: string;
  site_description: string;
  site_logo_url: string;
  site_favicon_url: string;
  nav_items: NavItem[];
  contact_email: string;
  contact_phone: string;
  contact_location: string;
  calendly_url: string;
  social_linkedin: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
}
