import {createFileRoute} from "@tanstack/react-router";
import {seo} from "@/lib/seo";
import {useI18n} from "@/i18n";
import {PageHero} from "@/components/site/RichText";
import {VolunteerForm} from "@/components/forms/VolunteerForm";
export const Route=createFileRoute("/benevole")({validateSearch:(s:Record<string,unknown>):{kind?:string}=>typeof s["kind"]==="string"&&["materiel","partenaire","benevole"].includes(s["kind"])?{kind:s["kind"]}:{},head:()=>seo("Bénévolat et partenariat","Bénévolat et partenariat — Association M.M Monique Mokelina."),component:Page});
function Page(){const {t}=useI18n();return <><PageHero title={t("nav.volunteer")} /><div className="container-page py-10"><div className="max-w-2xl"><VolunteerForm initial={Route.useSearch().kind ?? "benevole"}/></div></div></>;}
