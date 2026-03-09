import { fetchAPI } from "@/lib/wordpress";
import type { WPTeamMember } from "@/types/team";

export async function getTeamMembers(): Promise<WPTeamMember[]> {
  return fetchAPI<WPTeamMember[]>(
    "/wp/v2/team-members?_embed&per_page=20",
    { revalidate: 3600, tags: ["team"] }
  );
}
