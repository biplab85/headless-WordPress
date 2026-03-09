import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/services/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let postSlugs: string[] = [];
  try {
    postSlugs = await getPostSlugs();
  } catch {
    // WordPress not connected
  }

  return [
    { url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${url}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${url}/startup-visa`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${url}/portfolio`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${url}/pricing`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${url}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${url}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postSlugs.map((slug) => ({
      url: `${url}/blog/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
