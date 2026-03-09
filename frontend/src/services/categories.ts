import { fetchAPI } from "@/lib/wordpress";
import type { WPTerm } from "@/types/wordpress";

export async function getCategories(): Promise<WPTerm[]> {
  return fetchAPI<WPTerm[]>(
    "/wp/v2/categories?per_page=50",
    { revalidate: 3600, tags: ["categories"] }
  );
}

export async function getCategoryBySlug(
  slug: string
): Promise<WPTerm | null> {
  const categories = await fetchAPI<WPTerm[]>(
    `/wp/v2/categories?slug=${encodeURIComponent(slug)}`,
    { revalidate: 3600, tags: ["categories"] }
  );
  return categories[0] ?? null;
}
