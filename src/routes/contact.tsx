import {createFileRoute} from "@tanstack/react-router";
import {seo} from "@/lib/seo";
import {useI18n} from "@/i18n";
import {useSiteData} from "@/lib/content";
import {PageHero} from "@/components/site/RichText";
import {ContactForm} from "@/components/forms/ContactForm";
import {ContactLinks} from "@/components/site/ContactLinks";
import {CountriesBadge} from "@/components/site/Flags";
export const Route=createFileRoute("/contact")({head:()=>seo("Contact","Contact — Association M.M Monique Mokelina."),component:Page});
function Page(){const {t}=useI18n();const {c}=useSiteData();return <><PageHero title={t("nav.contact")} intro={c("contact.intro")} /><div className="container-page grid gap-12 py-10 md:grid-cols-[1fr_2fr]"><div className="space-y-5"><span className="inline-block rounded-full bg-primary px-1"><CountriesBadge /></span><ContactLinks/></div><div className="max-w-xl"><ContactForm/></div></div></>;}
