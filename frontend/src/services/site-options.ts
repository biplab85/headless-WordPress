import type { SiteOptions } from "@/types/site-options";

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL || "http://localhost/sklentr/headless-WordPress/wordpress/wp-json";

export async function getSiteOptions(): Promise<SiteOptions> {
  const res = await fetch(`${WORDPRESS_API_URL}/sklentr/v1/site-options`, {
    next: { revalidate: 60, tags: ["site-options"] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch site options: ${res.status}`);
  }

  return res.json();
}
