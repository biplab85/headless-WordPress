export interface WPFAQ {
  id: number;
  title: { rendered: string };
  acf: {
    question: string;
    answer: string;
    page_context: "pricing" | "startup-visa" | "general";
    display_order: number;
  };
}
