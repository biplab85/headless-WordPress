import { fetchAPI } from "@/lib/wordpress";
import type { WPFAQ } from "@/types/faq";

export async function getFAQs(): Promise<WPFAQ[]> {
  return fetchAPI<WPFAQ[]>(
    "/wp/v2/faqs?per_page=50",
    { revalidate: 3600, tags: ["faqs"] }
  );
}

export async function getFAQsByContext(
  context: "pricing" | "startup-visa" | "general"
): Promise<WPFAQ[]> {
  const faqs = await getFAQs();
  return faqs
    .filter((faq) => faq.acf.page_context === context)
    .sort((a, b) => a.acf.display_order - b.acf.display_order);
}
