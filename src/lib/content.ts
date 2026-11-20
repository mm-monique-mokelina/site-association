import { PUBLIC_CONTENT } from "./public-content";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, type Lang } from "@/i18n";

export type ContentField = {
  key: string;
  label: string;
  fr: string;
  en?: string;
  long?: boolean;
  image?: boolean;
};
export type ContentSection = { id: string; title: string; fields: ContentField[] };

const T = "[À compléter]";
const TE = "[To be completed]";

export const POLES = [
  { id: "direction", fr: "Direction", en: "Leadership" },
  { id: "admin", fr: "Administratif, financier et juridique", en: "Administration, finance & legal" },
  { id: "terrain", fr: "Programmes et terrain", en: "Programmes & field work" },
  { id: "com", fr: "Communication et partenariats", en: "Communication & partnerships" },
  { id: "vie", fr: "Vie associative", en: "Community life" },
] as const;

export const CONTENT: ContentSection[] = [
  {
    id: "home",
    title: "Accueil",
    fields: [
      { key: "home.hero_title", label: "Titre principal", fr: "Association M.M Monique Mokelina", en: "M.M Monique Mokelina Association" },
      { key: "home.slogan", label: "Slogan", fr: "Ensemble pour un avenir meilleur", en: "Together for a better future" },
      { key: "home.mission", label: "Mission en une phrase", fr: `${T} — Notre mission en une phrase.`, en: `${TE} — Our mission in one sentence.`, long: true },
      { key: "home.hero_image", label: "Image d'accueil (facultative)", fr: "", image: true },
      { key: "home.intro_title", label: "Titre présentation", fr: "Qui nous sommes", en: "Who we are" },
      { key: "home.intro", label: "Texte de présentation", fr: `Association sans but lucratif de droit congolais, dont le siège est à Kinshasa, avec des membres en France et au Congo. ${T}`, en: `Non-profit association under Congolese law, headquartered in Kinshasa, with members in France and Congo. ${TE}`, long: true },
      { key: "home.public1_title", label: "Public 1 — titre", fr: "Les filles-mères", en: "Young mothers" },
      { key: "home.public1_text", label: "Public 1 — texte", fr: `Formation aux métiers et accompagnement. ${T}`, en: `Vocational training and support. ${TE}`, long: true },
      { key: "home.public2_title", label: "Public 2 — titre", fr: "Les femmes maraîchères", en: "Women market gardeners" },
      { key: "home.public2_text", label: "Public 2 — texte", fr: `Accompagnement de leur activité. ${T}`, en: `Support for their activity. ${TE}`, long: true },
      { key: "home.public3_title", label: "Public 3 — titre", fr: "Les jeunes et les enfants", en: "Youth and children" },
      { key: "home.public3_text", label: "Public 3 — texte", fr: `Activités pour les jeunes et protection de l'enfance. ${T}`, en: `Youth activities and child protection. ${TE}`, long: true },
      { key: "home.cta_title", label: "Titre appel à l'action", fr: "Agissez avec nous", en: "Act with us" },
      { key: "home.cta_text", label: "Texte appel à l'action", fr: "Adhérez, faites un don ou rejoignez-nous comme bénévole, en France ou au Congo.", en: "Join, donate or volunteer with us, in France or in Congo.", long: true },
    ],
  },
  {
    id: "about",
    title: "Qui sommes-nous",
    fields: [
      { key: "about.intro", label: "Introduction", fr: T, en: TE, long: true },
      { key: "about.tribute_title", label: "Hommage — titre", fr: "Hommage à Monique Mokelina", en: "Tribute to Monique Mokelina" },
      { key: "about.tribute", label: "Hommage — texte", fr: `Monique Mokelina, mère du fondateur, a toujours œuvré dans le social. ${T}`, en: `Monique Mokelina, the founder's mother, always worked for social causes. ${TE}`, long: true },
      { key: "about.tribute_image", label: "Hommage — photo", fr: "", image: true },
      { key: "about.vision_title", label: "Vision — titre", fr: "Notre vision", en: "Our vision" },
      { key: "about.vision", label: "Vision — texte", fr: T, en: TE, long: true },
      { key: "about.founder_title", label: "Fondateur — titre", fr: "Le fondateur", en: "The founder" },
      { key: "about.founder", label: "Fondateur — texte", fr: T, en: TE, long: true },
      { key: "about.founder_image", label: "Fondateur — photo", fr: "", image: true },
      { key: "about.board_title", label: "Bureau — titre", fr: "Le bureau", en: "The board" },
      { key: "about.board", label: "Bureau — membres (une ligne par personne : Fonction — Nom)", fr: `Président fondateur — ${T}\nVice-présidente — ${T}\nSecrétaire — ${T}\nTrésorier — ${T}`, en: `Founding President — ${TE}\nVice-President — ${TE}\nSecretary — ${TE}\nTreasurer — ${TE}`, long: true },
    ],
  },
  {
    id: "actions",
    title: "Notre but et nos actions",
    fields: [
      { key: "actions.goal_title", label: "But — titre", fr: "Notre but", en: "Our goal" },
      { key: "actions.goal", label: "But — texte", fr: T, en: TE, long: true },
      { key: "actions.pole_direction", label: "Pôle Direction", fr: T, en: TE, long: true },
      { key: "actions.pole_admin", label: "Pôle Administratif, financier et juridique", fr: T, en: TE, long: true },
      { key: "actions.pole_terrain", label: "Pôle Programmes et terrain (une action par ligne)", fr: "Formation aux métiers des filles-mères\nAccompagnement des femmes maraîchères\nActivités pour les jeunes\nProtection de l'enfance\nLutte contre les violences basées sur le genre", en: "Vocational training for young mothers\nSupport for women market gardeners\nYouth activities\nChild protection\nFighting gender-based violence", long: true },
      { key: "actions.pole_com", label: "Pôle Communication et partenariats", fr: T, en: TE, long: true },
      { key: "actions.pole_vie", label: "Pôle Vie associative", fr: T, en: TE, long: true },
    ],
  },
  {
    id: "fc",
    title: "France et Congo",
    fields: [
      { key: "fc.intro", label: "Introduction", fr: T, en: TE, long: true },
      { key: "fc.france", label: "En France (une action par ligne)", fr: "Mobilisation de la diaspora\nCollecte de dons et de matériel\nParrainage\nFormation à distance", en: "Mobilising the diaspora\nCollecting donations and equipment\nSponsorship\nRemote training", long: true },
      { key: "fc.france_text", label: "En France — détails", fr: T, en: TE, long: true },
      { key: "fc.congo", label: "Au Congo (une action par ligne)", fr: "Projets de terrain à Kinshasa", en: "Field projects in Kinshasa", long: true },
      { key: "fc.congo_text", label: "Au Congo — détails", fr: T, en: TE, long: true },
    ],
  },
  {
    id: "donate",
    title: "Faire un don",
    fields: [
      { key: "donate.intro", label: "Introduction", fr: "Chaque don, même modeste, aide directement les femmes, les jeunes et les enfants que nous accompagnons.", en: "Every gift, however small, directly helps the women, young people and children we support.", long: true },
      { key: "donate.usage", label: "Utilisation des dons", fr: T, en: TE, long: true },
      { key: "donate.material", label: "Dons en matériel", fr: T, en: TE, long: true },
    ],
  },
  {
    id: "volunteer",
    title: "Bénévole / partenaire",
    fields: [{ key: "volunteer.intro", label: "Introduction", fr: "Vous souhaitez donner de votre temps, apporter votre expertise ou soutenir nos projets ? Écrivez-nous.", en: "Want to give your time, share your expertise or support our projects? Write to us.", long: true }],
  },
  {
    id: "join",
    title: "Adhésion",
    fields: [{ key: "join.intro", label: "Introduction", fr: "Devenez membre de l'association et participez à la vie de nos projets, en France comme au Congo. L'adhésion se règle au mois.", en: "Become a member and take part in our projects, in France and in Congo. Membership is paid monthly.", long: true }],
  },
  {
    id: "contact",
    title: "Contact",
    fields: [{ key: "contact.intro", label: "Introduction", fr: "Une question, une idée, une proposition ? Écrivez-nous.", en: "A question, an idea, a proposal? Write to us.", long: true }],
  },
  {
    id: "legal",
    title: "Pages légales",
    fields: [
      { key: "legal.text", label: "Mentions légales", fr: `Éditeur : Association M.M Monique Mokelina, association sans but lucratif de droit congolais.\nSiège : Kinshasa — adresse ${T}\nResponsable de la publication : ${T}\nHébergement : ${T}`, long: true },
      { key: "privacy.text", label: "Protection des données", fr: `Données collectées : nom, prénom, email, téléphone, pays, ville, informations d'adhésion et de cotisation.\nFinalité : gestion des adhésions, des cotisations et de la vie associative.\nDurée de conservation : ${T}\nVos droits (RGPD, membres résidant en France) : accès, rectification, effacement, opposition et portabilité. Pour les exercer : ${T}\nResponsable du traitement : ${T}`, long: true },
    ],
  },
];

export const FIELD_MAP: Record<string, ContentField> = Object.fromEntries(
  CONTENT.flatMap((s) => s.fields).map((f) => [f.key, f]),
);

export type SiteData = {
  content: Record<string, Partial<Record<Lang, string>>>;
  settings: Record<string, string>;
};

export const siteDataQuery = {
  queryKey: ["site-data"],
  queryFn: async (): Promise<SiteData> => {
    const [c, s] = await Promise.all([
      supabase.from("page_content").select("key,lang,value"),
      supabase.from("site_settings").select("key,value"),
    ]);
    const content: SiteData["content"] = {};
    for (const r of c.data ?? []) (content[r.key] ??= {})[r.lang as Lang] = r.value;
    const settings: Record<string, string> = {};
    for (const r of s.data ?? []) settings[r.key] = r.value;
    return { content, settings };
  },
  staleTime: 5 * 60_000,
};

export function useSiteData() {
  const { lang } = useI18n();
  const q = useQuery(siteDataQuery);
  const data = q.data;
  const c = (key: string): string => {
    if (PUBLIC_CONTENT[key]) return PUBLIC_CONTENT[key]?.[lang] ?? "";
    const f = FIELD_MAP[key];
    const db = data?.content[key];
    const pick = (v?: string) => (v && v.trim() ? v : undefined);
    if (f?.image) return pick(db?.fr) ?? "";
    return (
      pick(db?.[lang]) ??
      pick(lang === "fr" ? f?.fr : lang === "en" ? f?.en : undefined) ??
      pick(db?.fr) ??
      (f?.fr?.includes("À compléter") ? "" : f?.fr) ??
      ""
    );
  };
  const s = (key: string) => data?.settings[key] ?? "";
  return { c, s, ready: !!data };
}
