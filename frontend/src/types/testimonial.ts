export interface WPTestimonial {
  id: number;
  title: { rendered: string };
  acf: {
    quote: string;
    client_name: string;
    client_role: string;
    company_name: string;
    client_photo: {
      url: string;
      alt: string;
      width: number;
      height: number;
    } | false;
    display_order: number;
  };
}
