import type { WPBasePost } from "./wordpress";

export interface WPPost extends WPBasePost {
  categories: number[];
  tags: number[];
  author: number;
  acf?: {
    read_time?: string;
  };
}
