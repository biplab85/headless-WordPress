import { fetchAPI } from "@/lib/wordpress";
import type { WPTestimonial } from "@/types/testimonial";

export async function getTestimonials(): Promise<WPTestimonial[]> {
  return fetchAPI<WPTestimonial[]>(
    "/wp/v2/testimonials?per_page=20&_embed",
    { revalidate: 3600, tags: ["testimonials"] }
  );
}
