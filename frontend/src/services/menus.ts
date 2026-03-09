import { fetchAPI } from "@/lib/wordpress";
import type { WPMenu } from "@/types/menu";

export async function getMenuByLocation(
  location: string
): Promise<WPMenu | null> {
  try {
    return await fetchAPI<WPMenu>(
      `/wp-api-menus/v2/menu-locations/${location}`,
      { revalidate: 3600, tags: ["menus"] }
    );
  } catch {
    return null;
  }
}

export async function getPrimaryMenu(): Promise<WPMenu | null> {
  return getMenuByLocation("primary");
}
