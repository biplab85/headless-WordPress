export interface WPRendered {
  rendered: string;
}

export interface WPImage {
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes?: Record<
      string,
      { source_url: string; width: number; height: number }
    >;
  };
}

export interface WPYoastSEO {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width: number; height: number }[];
  twitter_card?: string;
}

export interface WPAuthor {
  name: string;
  avatar_urls?: Record<string, string>;
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WPEmbedded {
  "wp:featuredmedia"?: WPImage[];
  author?: WPAuthor[];
  "wp:term"?: WPTerm[][];
}

export interface WPBasePost {
  id: number;
  slug: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  date: string;
  modified: string;
  featured_media: number;
  _embedded?: WPEmbedded;
  yoast_head_json?: WPYoastSEO;
}
