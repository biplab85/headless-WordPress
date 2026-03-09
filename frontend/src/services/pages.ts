import { fetchAPI } from "@/lib/wordpress";
import type { WPBasePost } from "@/types/wordpress";

export interface WPPageContent {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  featured_image: string | null;
  elementor_css: string | null;
  global_css: string | null;
  frontend_css: string | null;
  pro_css: string | null;
  inline_css: string | null;
  is_elementor: boolean;
  modified: string;
}

export async function getPageBySlug(
  slug: string
): Promise<WPBasePost | null> {
  const pages = await fetchAPI<WPBasePost[]>(
    `/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`,
    { revalidate: 3600, tags: ["pages", `page-${slug}`] }
  );
  return pages[0] ?? null;
}

/**
 * Fetch a WordPress page with Elementor-rendered HTML + CSS asset URLs.
 */
export async function getElementorPage(
  slug: string
): Promise<WPPageContent | null> {
  try {
    const page = await fetchAPI<WPPageContent>(
      `/sklentr/v1/page/${encodeURIComponent(slug)}`,
      { revalidate: 60, tags: ["pages", `page-${slug}`] }
    );
    return page ?? null;
  } catch {
    return null;
  }
}

export interface ThemeTemplate {
  content: string;
  inline_css: string;
  frontend_css: string | null;
  pro_css: string | null;
  global_css: string | null;
  elementor_css: string | null;
  frontend_js: string | null;
  pro_js: string | null;
  template_id?: number;
  found: boolean;
}

/**
 * Fetch an Elementor Theme Builder template (header or footer).
 */
export async function getThemeTemplate(
  type: "header" | "footer"
): Promise<ThemeTemplate | null> {
  try {
    const template = await fetchAPI<ThemeTemplate>(
      `/sklentr/v1/theme-template/${type}`,
      { revalidate: 60, tags: ["theme-templates", `theme-${type}`] }
    );
    return template?.found ? template : null;
  } catch {
    return null;
  }
}

export async function getPageSlugs(): Promise<string[]> {
  const pages = await fetchAPI<{ slug: string }[]>(
    "/wp/v2/pages?per_page=100&_fields=slug",
    { revalidate: 3600 }
  );
  return pages.map((p) => p.slug);
}
