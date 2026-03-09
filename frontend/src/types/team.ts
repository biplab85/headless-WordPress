import type { WPBasePost } from "./wordpress";

export interface WPTeamMember extends WPBasePost {
  acf: {
    position: string;
    department: string;
    location: string;
    bio: string;
    linkedin_url: string;
    display_order: number;
  };
}
