import { fetchAPI } from "@/lib/wordpress";
import type { WPService } from "@/types/service";

export async function getServices(): Promise<WPService[]> {
  return fetchAPI<WPService[]>(
    "/wp/v2/services?_embed&per_page=20",
    { revalidate: 3600, tags: ["services"] }
  );
}

export async function getServiceBySlug(
  slug: string
): Promise<WPService | null> {
  const services = await fetchAPI<WPService[]>(
    `/wp/v2/services?slug=${encodeURIComponent(slug)}&_embed`,
    { revalidate: 3600, tags: ["services", `service-${slug}`] }
  );
  return services[0] ?? null;
}
