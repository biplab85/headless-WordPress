import { fetchAPI } from "@/lib/wordpress";
import type { WPPost } from "@/types/post";

export async function getPosts(
  page = 1,
  perPage = 10
): Promise<WPPost[]> {
  return fetchAPI<WPPost[]>(
    `/wp/v2/posts?_embed&per_page=${perPage}&page=${page}&orderby=date&order=desc`,
    { revalidate: 60, tags: ["posts"] }
  );
}

export async function getPostBySlug(
  slug: string
): Promise<WPPost | null> {
  const posts = await fetchAPI<WPPost[]>(
    `/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
    { revalidate: 60, tags: ["posts", `post-${slug}`] }
  );
  return posts[0] ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await fetchAPI<{ slug: string }[]>(
    "/wp/v2/posts?per_page=100&_fields=slug",
    { revalidate: 3600 }
  );
  return posts.map((p) => p.slug);
}

export async function getPostsByCategory(
  categoryId: number,
  perPage = 10
): Promise<WPPost[]> {
  return fetchAPI<WPPost[]>(
    `/wp/v2/posts?_embed&categories=${categoryId}&per_page=${perPage}`,
    { revalidate: 60, tags: ["posts"] }
  );
}

export async function searchPosts(query: string): Promise<WPPost[]> {
  return fetchAPI<WPPost[]>(
    `/wp/v2/posts?_embed&search=${encodeURIComponent(query)}&per_page=20`,
    { revalidate: 0 }
  );
}
