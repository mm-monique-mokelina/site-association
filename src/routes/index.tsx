import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HandHeart, Sprout, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useSiteData } from "@/lib/content";
import { publicNewsQuery } from "@/lib/news";
import { RichText, Marked } from "@/components/site/RichText";
import { NewsCard } from "@/components/site/NewsCard";
import { Logo } from "@/components/site/Logo";
import { CountriesBadge } from "@/components/site/Flags";
import hero from "@/assets/hero-solidarite.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "M.M Monique Mokelina — Ensemble pour un avenir meilleur" },
      { name: "description", content: "Association congolaise au service des jeunes, des enfants et des femmes en RDC, avec des membres en France et au Congo." },
      { property: "og:title", content: "M.M Monique Mokelina — Ensemble pour un avenir meilleur" },
      { property: "og:description", content: "Association au service des jeunes, des enfants et des femmes en RDC." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { c } = useSiteData();
  const news = useQuery(publicNewsQuery(3));
  const heroImg = c("home.hero_image") || hero;
  const publics = [
    { icon: Users, color: "bg-sky", n: 1 },
    { icon: HandHeart, color: "bg-rose", n: 2 },
    { icon: Sprout, color: "bg-sun", n: 3 },
  ];
  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-page grid items-center gap-8 py-10 md:grid-cols-2 md:py-20">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={56} />
              <CountriesBadge />
            </div>
            <h1 className="mt-5 text-4xl font-semibold md:text-6xl">{c("home.hero_title")}</h1>
            <p className="mt-3 font-display text-2xl italic text-gold md:text-3xl">« {c("home.slogan")} »</p>
            <p className="mt-5 max-w-xl text-primary-foreground/85 md:text-lg"><Marked text={c("home.mission")} /></p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg"><Link to="/adhesion">{t("cta.join")}</Link></Button>
              <Button asChild variant="light" size="lg"><Link to="/don">{t("cta.donate")}</Link></Button>
              <Button asChild variant="light" size="lg"><Link to="/benevole">{t("cta.volunteer")}</Link></Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm md:max-w-md">
            <div className="absolute -inset-3 rounded-full bg-gold-gradient opacity-80" aria-hidden />
            <img src={heroImg} alt="Une femme et trois enfants, symbole de l'association" width={720} height={720}
              fetchPriority="high" className="relative aspect-square w-full rounded-full object-cover ring-4 ring-primary-deep" />
          </div>
        </div>
        <div className="kente-band" />
      </section>

      <section className="container-page py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-semibold text-primary md:text-4xl">{c("home.intro_title")}</h2>
          <RichText text={c("home.intro")} className="text-lg text-foreground/85" />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {publics.map(({ icon: Icon, color, n }) => (
            <article key={n} className="rounded-2xl border bg-card p-6 shadow-soft">
              <span className={`inline-flex size-12 items-center justify-center rounded-full ${color} text-primary-foreground`}>
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-primary">{c(`home.public${n}_title`)}</h3>
              <RichText text={c(`home.public${n}_text`)} className="mt-2 text-muted-foreground" />
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/actions" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">{t("nav.actions")} <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-page grid gap-6 py-14 md:grid-cols-[2fr_3fr] md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-primary">{c("home.cta_title")}</h2>
            <RichText text={c("home.cta_text")} className="mt-3 text-foreground/80" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { to: "/adhesion" as const, k: "cta.join" as const, cls: "bg-primary text-primary-foreground" },
              { to: "/don" as const, k: "cta.donate" as const, cls: "bg-gold text-gold-foreground" },
              { to: "/benevole" as const, k: "cta.volunteer" as const, cls: "bg-card text-primary border" },
            ].map((x) => (
              <Link key={x.to} to={x.to} className={`flex items-center justify-between rounded-xl p-5 font-display text-lg font-semibold shadow-soft ${x.cls}`}>
                {t(x.k)} <ArrowRight className="size-5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-primary">{t("nav.news")}</h2>
          <Link to="/actualites" className="text-sm font-semibold text-primary hover:underline">{t("cta.allNews")}</Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {news.data?.length ? news.data.map((n) => <NewsCard key={n.id} n={n} />) : (
            <p className="text-muted-foreground">{news.isLoading ? t("common.loading") : t("common.noNews")}</p>
          )}
        </div>
      </section>
    </>
  );
}
