import { getThemeTemplate } from "@/services/pages";
import ElementorHeader from "./ElementorHeader";
import Header from "./Header";
import type { NavItem } from "@/types/site-options";

interface ThemeHeaderProps {
  logoUrl?: string;
  navItems?: NavItem[];
  calendlyUrl?: string;
  siteName?: string;
  ctaText?: string;
}

/**
 * Fetches the Elementor Theme Builder header template.
 * Falls back to the static Header component if no template is found.
 */
export default async function ThemeHeader(props: ThemeHeaderProps) {
  const template = await getThemeTemplate("header");

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
        <ElementorHeader
          html={template.content}
          inlineCss={template.inline_css}
          frontendJs={template.frontend_js}
          proJs={template.pro_js}
        />
      </>
    );
  }

  return <Header {...props} />;
}
