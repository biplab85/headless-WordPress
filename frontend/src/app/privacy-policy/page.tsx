import type { Metadata } from "next";
import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage, getPageBySlug } from "@/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getElementorPage("privacy-policy").catch(() => null);
  return {
    title: page?.title
      ? `${page.title} | Sklentr`
      : "Privacy Policy",
    description: "Sklentr Inc. privacy policy.",
  };
}

export default async function PrivacyPolicyPage() {
  // Try Elementor first
  const elementorPage = await getElementorPage("privacy-policy").catch(() => null);

  if (elementorPage?.is_elementor && elementorPage.content?.trim()) {
    return <ElementorPage page={elementorPage} />;
  }

  // Fallback to standard WordPress content for simple text pages
  const page = await getPageBySlug("privacy-policy").catch(() => null);

  if (page) {
    return (
      <article className="pt-32 pb-20 lg:pt-40">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
          <div
            className="prose dark:text-foreground max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />
        </div>
      </article>
    );
  }

  return (
    <div className="pt-32 pb-20 text-center">
      <p className="text-sm text-muted-foreground">
        This page is being built. Visit WordPress Admin to add content.
      </p>
    </div>
  );
}
