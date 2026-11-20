import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { PageHero, RichText } from "@/components/site/RichText";
import { useSiteData } from "@/lib/content";

export const Route = createFileRoute("/confidentialite")({
  head: () => seo("Protection des données", "Protection des données — Association M.M Monique Mokelina."),
  component: Page,
});

function Page() {
  const { c } = useSiteData();
  void c;
  return (
    <>
      <PageHero title="Protection des données" />
      <div className="container-page py-10"><RichText text={c("privacy.text")} /></div>
    </>
  );
}
