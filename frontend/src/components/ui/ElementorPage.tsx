import ElementorContent from "@/components/ui/ElementorContent";
import type { WPPageContent } from "@/services/pages";

interface ElementorPageProps {
  page: WPPageContent;
}

/**
 * Full Elementor page renderer.
 * Loads all required Elementor CSS assets and renders the page content.
 * All layout, styling, and content comes from Elementor — no hardcoded markup.
 */
export default function ElementorPage({ page }: ElementorPageProps) {
  return (
    <>
      {/* Elementor base frontend CSS */}
      {page.frontend_css && (
        <link rel="stylesheet" href={page.frontend_css} />
      )}

      {/* Elementor Pro frontend CSS */}
      {page.pro_css && (
        <link rel="stylesheet" href={page.pro_css} />
      )}

      {/* Elementor global styles (colors, fonts, etc.) */}
      {page.global_css && (
        <link rel="stylesheet" href={page.global_css} />
      )}

      {/* Page-specific Elementor CSS */}
      {page.elementor_css && (
        <link rel="stylesheet" href={page.elementor_css} />
      )}

      {/* Elementor-rendered content with inline styles */}
      <ElementorContent html={page.content} inlineCss={page.inline_css} />
    </>
  );
}
