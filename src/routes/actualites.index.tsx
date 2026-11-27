import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, RichText } from "@/components/site/RichText";
import { useSiteData } from "@/lib/content";

export const Route = createFileRoute("/actualites/")({
  head: () => seo("Actualités", "Actualités — Fondation Monique Mokelina."),
  component: Page,
});

function Page() {
  const { c } = useSiteData();
  void c;
  return (
    <>
      <PageHero title="Actualités" />
      <div className="container-page py-10"><RichText text={"Liste des actualités en cours de construction."} /></div>
    </>
  );
}
