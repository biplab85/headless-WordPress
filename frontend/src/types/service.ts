import type { WPBasePost } from "./wordpress";

export interface WPService extends WPBasePost {
  acf: {
    service_icon: {
      url: string;
      alt: string;
      width: number;
      height: number;
    } | false;
    icon_name: string;
    timeline: string;
    starting_price: string;
    sub_services: { name: string }[];
    detailed_features: { item: string }[];
    display_order: number;
  };
}
