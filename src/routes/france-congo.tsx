import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { useSiteData } from "@/lib/content";
import { seo } from "@/lib/seo";
import { PageHero, RichText, Lines } from "@/components/site/RichText";

export const Route = createFileRoute("/france-congo")({
  head: () => seo("France et Congo", "Mobilisation de la diaspora en France et projets de terrain à Kinshasa."),
  component: FC,
});

function FC() {
  const { t } = useI18n();
  const { c } = useSiteData();
  const Side = ({ title, list, text, color }: { title: string; list: string; text: string; color: string }) => (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className={`h-2 ${color}`} />
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-primary">{title}</h2>
        <Lines text={list} className="mt-4" />
        <RichText text={text} className="mt-4 text-muted-foreground" />
      </div>
    </article>
  );
  return (
    <>
      <PageHero title={t("nav.franceCongo")} intro={c("fc.intro")} />
      <div className="container-page grid gap-6 py-10 md:grid-cols-2">
        <Side title={t("country.FR")} list={c("fc.france")} text={c("fc.france_text")} color="bg-sky" />
        <Side title={`${t("country.CD")} — Kinshasa`} list={c("fc.congo")} text={c("fc.congo_text")} color="bg-gold" />
      </div>
    </>
  );
}
