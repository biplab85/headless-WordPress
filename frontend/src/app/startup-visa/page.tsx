import type { Metadata } from "next";
import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage } from "@/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getElementorPage("startup-visa").catch(() => null);
  return {
    title: page?.title
      ? `${page.title} | Sklentr`
      : "Startup Visa MVP Development - Build Your SUV Application MVP",
    description:
      page?.excerpt ||
      "Need an MVP for your Startup Visa application? We've built 15+ SUV MVPs. 4-week delivery. $15,000 CAD. 100% on-time.",
  };
}

export default async function StartupVisaPage() {
  const page = await getElementorPage("startup-visa").catch(() => null);

  if (!page || !page.is_elementor || !page.content?.trim()) {
    return (
      <div className="pt-32 pb-20 text-center">
        <p className="text-sm text-muted-foreground">
          This page is being built in Elementor. Visit WordPress Admin to design it.
        </p>
      </div>
    );
  }

  return <ElementorPage page={page} />;
}
