export interface WPMenuItem {
  ID: number;
  title: string;
  url: string;
  slug: string;
  target: string;
  parent: number;
  children?: WPMenuItem[];
}

export interface WPMenu {
  ID: number;
  name: string;
  slug: string;
  items: WPMenuItem[];
}
