import { fetchAPI } from "@/lib/wordpress";
import type { WPGallery } from "@/types/gallery";

export async function getGalleries(): Promise<WPGallery[]> {
  return fetchAPI<WPGallery[]>(
    "/wp/v2/galleries?_embed&per_page=50",
    { revalidate: 3600, tags: ["galleries"] }
  );
}

export async function getGalleryBySlug(
  slug: string
): Promise<WPGallery | null> {
  const galleries = await fetchAPI<WPGallery[]>(
    `/wp/v2/galleries?slug=${encodeURIComponent(slug)}&_embed`,
    { revalidate: 3600, tags: ["galleries", `gallery-${slug}`] }
  );
  return galleries[0] ?? null;
}
