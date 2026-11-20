import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { useSiteData } from "@/lib/content";
import { seo } from "@/lib/seo";
import { PageHero, RichText, Lines } from "@/components/site/RichText";
import { Flag, CountriesBadge } from "@/components/site/Flags";

export const Route = createFileRoute("/france-congo")({
  head: () => seo("France et Congo (RDC)", "Mobilisation de la diaspora en France et projets de terrain à Kinshasa."),
  component: FC,
});

function FC() {
  const { t } = useI18n();
  const { c } = useSiteData();
  const Side = ({ title, list, text, color, flag }: { title: string; list: string; text: string; color: string; flag: "FR" | "CD" }) => (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className={`h-2 ${color}`} />
      <div className="p-6">
        <h2 className="flex items-center gap-3 text-2xl font-semibold text-primary"><Flag country={flag} className="h-6 w-9 rounded-sm shadow" />{title}</h2>
        <Lines text={list} className="mt-4" />
        <RichText text={text} className="mt-4 text-muted-foreground" />
      </div>
    </article>
  );
  return (
    <>
      <PageHero title={t("nav.franceCongo")} intro={c("fc.intro")} />
      <div className="container-page pt-8"><span className="inline-block rounded-full bg-primary px-1"><CountriesBadge /></span></div>
      <div className="container-page grid gap-6 py-6 md:grid-cols-2">
        <Side title={t("country.FR")} list={c("fc.france")} text={c("fc.france_text")} color="bg-sky" flag="FR" />
        <Side title={`${t("country.CD")} — Kinshasa`} list={c("fc.congo")} text={c("fc.congo_text")} color="bg-gold" flag="CD" />
      </div>
    </>
  );
}
