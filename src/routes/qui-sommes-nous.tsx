import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { useSiteData } from "@/lib/content";
import { seo } from "@/lib/seo";
import { PageHero, RichText, Marked } from "@/components/site/RichText";

export const Route = createFileRoute("/qui-sommes-nous")({
  head: () => seo("Qui sommes-nous", "L'hommage à Monique Mokelina, notre vision, le fondateur et le bureau de la Fondation."),
  component: About,
});

function Block({ title, text, img }: { title: string; text: string; img?: string | undefined }) {
  return (
    <section className="grid gap-6 border-b py-10 md:grid-cols-[1fr_2fr]">
      <div>
        <h2 className="text-2xl font-semibold text-primary md:text-3xl">{title}</h2>
        {img && <img src={img} alt={title} loading="lazy" className="mt-4 aspect-square w-40 rounded-full object-cover ring-4 ring-gold" />}
      </div>
      <RichText text={text} className="text-lg text-foreground/85" />
    </section>
  );
}

function About() {
  const { t } = useI18n();
  const { c } = useSiteData();
  const board = c("about.board").split("\n").filter(Boolean);
  return (
    <>
      <PageHero title={t("nav.about")} intro={c("about.intro")} />
      <div className="container-page">
        <Block title={c("about.tribute_title")} text={c("about.tribute")} img={c("about.tribute_image") || undefined} />
        <Block title={c("about.vision_title")} text={c("about.vision")} />
        <Block title={c("about.founder_title")} text={c("about.founder")} img={c("about.founder_image") || undefined} />
        <section className="py-10">
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">{c("about.board_title")}</h2>
          <RichText text={c("about.board")} className="mt-4 text-lg" />
        </section>
      </div>
    </>
  );
}
