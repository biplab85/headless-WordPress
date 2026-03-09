import type { WPBasePost } from "./wordpress";

export interface GalleryImage {
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
    sizes?: Record<string, { source_url?: string; width: number; height: number }>;
  } | false;
  caption: string;
  link_url: string;
}

export interface WPGallery extends WPBasePost {
  acf: {
    gallery_category: string;
    gallery_images: GalleryImage[];
    display_order: number;
  };
}
