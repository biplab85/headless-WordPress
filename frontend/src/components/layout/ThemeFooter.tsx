import { getThemeTemplate } from "@/services/pages";
import ElementorFooter from "./ElementorFooter";
import Footer from "./Footer";

interface ThemeFooterProps {
  /** Fallback props passed to the static Footer when no Elementor template exists */
  logoUrl?: string;
  siteName?: string;
  siteDescription?: string;
  contact?: { email: string; phone: string; location: string; calendly: string };
  socialLinks?: { linkedin: string; facebook: string; instagram: string; twitter: string };
  companyLinks?: { label: string; href: string }[];
  serviceLinks?: { label: string; href: string }[];
  legalLinks?: { label: string; href: string }[];
}

/**
 * Fetches the Elementor Theme Builder footer template.
 * Falls back to the static Footer component if no template is found.
 */
export default async function ThemeFooter(props: ThemeFooterProps) {
  const template = await getThemeTemplate("footer");

  if (template) {
    return (
      <>
        {template.frontend_css && (
          <link rel="stylesheet" href={template.frontend_css} />
        )}
        {template.pro_css && (
          <link rel="stylesheet" href={template.pro_css} />
        )}
        {template.global_css && (
          <link rel="stylesheet" href={template.global_css} />
        )}
        {template.elementor_css && (
          <link rel="stylesheet" href={template.elementor_css} />
        )}
        <ElementorFooter
          html={template.content}
          inlineCss={template.inline_css}
        />
      </>
    );
  }

  // Fallback to static Footer until Elementor footer is designed
  return <Footer {...props} />;
}
