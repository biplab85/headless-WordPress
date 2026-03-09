export interface WPPricingPlan {
  id: number;
  title: { rendered: string };
  acf: {
    price: string;
    price_range: string;
    timeline: string;
    is_popular: boolean;
    features_count: string;
    design_type: string;
    pages_screens: string;
    revisions: string;
    support_duration: string;
    inclusions: { item: string }[];
    exclusions: { item: string }[];
    cta_text: string;
    cta_link: string;
    display_order: number;
  };
}
