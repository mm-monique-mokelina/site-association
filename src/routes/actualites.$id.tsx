import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, RichText } from "@/components/site/RichText";
import { useSiteData } from "@/lib/content";

export const Route = createFileRoute("/actualites/$id")({
  head: () => seo("Actualité", "Actualité — Association M.M Monique Mokelina."),
  component: Page,
});

function Page() {
  const { c } = useSiteData();
  void c;
  return (
    <>
      <PageHero title="Actualité" />
      <div className="container-page py-10"><RichText text={"Détail en cours de construction."} /></div>
    </>
  );
}
