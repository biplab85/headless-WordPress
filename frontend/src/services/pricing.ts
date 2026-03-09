import { fetchAPI } from "@/lib/wordpress";
import type { WPPricingPlan } from "@/types/pricing";

export async function getPricingPlans(): Promise<WPPricingPlan[]> {
  return fetchAPI<WPPricingPlan[]>(
    "/wp/v2/pricing-plans?per_page=10",
    { revalidate: 3600, tags: ["pricing"] }
  );
}
