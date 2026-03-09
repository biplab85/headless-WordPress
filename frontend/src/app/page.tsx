import ElementorPage from "@/components/ui/ElementorPage";
import { getElementorPage } from "@/services/pages";

export default async function HomePage() {
  const page = await getElementorPage("home").catch(() => null);

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
