import { fetchAPI } from "@/lib/wordpress";
import type { WPPortfolio } from "@/types/portfolio";

export async function getPortfolioProjects(): Promise<WPPortfolio[]> {
  return fetchAPI<WPPortfolio[]>(
    "/wp/v2/portfolio?_embed&per_page=20",
    { revalidate: 3600, tags: ["portfolio"] }
  );
}

export async function getPortfolioBySlug(
  slug: string
): Promise<WPPortfolio | null> {
  const projects = await fetchAPI<WPPortfolio[]>(
    `/wp/v2/portfolio?slug=${encodeURIComponent(slug)}&_embed`,
    { revalidate: 3600, tags: ["portfolio", `portfolio-${slug}`] }
  );
  return projects[0] ?? null;
}
