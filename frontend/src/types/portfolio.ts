import type { WPBasePost } from "./wordpress";

export interface PortfolioGalleryImage {
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | false;
  caption: string;
}

export interface WPPortfolio extends WPBasePost {
  acf: {
    industry: string;
    client_challenge: string;
    our_solution: string;
    results_summary: string;
    dev_time: string;
    tech_stack: { technology: string }[];
    project_url: string;
    gallery_images: PortfolioGalleryImage[];
    featured_home: boolean;
    display_order: number;
  };
}
