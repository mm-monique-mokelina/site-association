import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, Coins, Sprout, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { useText } from "@/lib/labels";
import { seo } from "@/lib/seo";
import { PageHero } from "@/components/site/RichText";

export const Route = createFileRoute("/actions")({
  head: () => seo("Notre but", "Éducation, protection, autonomie, nourrir les familles, jeunesse : les 5 axes de la Fondation."),
  component: Actions,
});

function Actions() {
  const { t } = useI18n();
  const x = useText();
  const goals = [
    { icon: GraduationCap, color: "bg-sky", title: x("Éducation et formation", "Education and training", "Boyekoli mpe mateya"), text: x("Soutien scolaire, apprendre à lire et à écrire, apprendre un métier.", "School support, learning to read and write, learning a trade.", "Lisungi na kelasi, koyekola kotanga mpe kokoma, koyekola mosala.") },
    { icon: ShieldCheck, color: "bg-rose", title: x("Protection", "Protection", "Bobateli"), text: x("Accompagner les filles-mères, lutter contre les violences faites aux femmes et les mariages précoces, protéger les enfants.", "Supporting young mothers, fighting violence against women and early marriage, protecting children.", "Kosalisa bamama ya bilenge, kobunda na mobulu oyo esalemaka basi mpe na libala ya bana mike, kobatela bana.") },
    { icon: Coins, color: "bg-gold", title: x("Autonomie", "Independence", "Komikamba"), text: x("Aider les femmes à lancer une petite activité et les orienter vers des organismes de microcrédit agréés.", "Helping women start a small business and directing them to approved microcredit organisations.", "Kosalisa basi bábandisa mwa mosala mpe kolakisa bango bibongiseli ya microcrédit oyo endimami.") },
    { icon: Sprout, color: "bg-sun", title: x("Nourrir les familles", "Feeding families", "Koleisa mabota"), text: x("Accompagner les femmes maraîchères et lutter contre la malnutrition des enfants.", "Supporting women market gardeners and fighting child malnutrition.", "Kosalisa basi baloni ndunda mpe kobunda na bokono ya kozanga bilei malamu na bana.") },
    { icon: Sparkles, color: "bg-primary", title: x("Jeunesse", "Youth", "Bilenge"), text: x("Révéler les talents, encourager la prise de parole et l'engagement citoyen.", "Revealing talents, encouraging young people to speak up and get involved as citizens.", "Komonisa makoki, kolendisa koloba na miso ya bato mpe kosala mpo na ekolo.") },
  ];
  return (
    <>
      <PageHero title={x("Notre but", "Our goal", "Mokano na biso")} intro={x("Aider les enfants et les jeunes, les filles-mères et les femmes maraîchères de RDC à prendre leur avenir en main, autour de cinq axes.", "Helping children and young people, young mothers and women market gardeners in the DRC take their future into their own hands, around five areas.", "Kosalisa bana mpe bilenge, bamama ya bilenge mpe basi baloni ndunda na RDC bámikamba mpo na lobi na bango, na banzela mitano.")} />
      <div className="container-page py-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((g, i) => (
            <article key={g.title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className={`inline-flex size-11 items-center justify-center rounded-full ${g.color} text-primary-foreground`}><g.icon className="size-5" /></span>
                <h2 className="text-xl font-semibold text-primary">{i + 1}. {g.title}</h2>
              </div>
              <p className="mt-4 text-foreground/85">{g.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="gold"><Link to="/don">{t("cta.donate")}</Link></Button>
          <Button asChild variant="outline"><Link to="/benevole">{t("cta.volunteer")}</Link></Button>
        </div>
      </div>
    </>
  );
}
