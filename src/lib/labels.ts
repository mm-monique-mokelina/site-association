import { useI18n } from '@/i18n';
export function useText() { const {lang}=useI18n(); return (fr:string,en:string,ln:string)=>lang==='en'?en:lang==='ln'?ln:fr; }
export const DONATIONS = [
 {id:'enfants',reference:'DON-ENFANTS',fr:'Enfants et jeunes',en:'Children and young people',ln:'Bana mpe bilenge'},
 {id:'fillesmeres',reference:'DON-FILLESMERES',fr:'Filles-mères',en:'Young mothers',ln:'Bamama ya bilenge'},
 {id:'maraicheres',reference:'DON-MARAICHERES',fr:'Femmes maraîchères',en:'Women market gardeners',ln:'Basi baloni ndunda'},
 {id:'general',reference:'DON-GENERAL',fr:'Là où le besoin est le plus grand',en:'Where the need is greatest',ln:'Esika oyo bosenga ezali monene koleka'},
] as const;
export const SIGNED_URL_SECONDS=300;
export const ASSOCIATION_FOLDERS=['Statuts et règlement intérieur','Banque','Assemblées générales et procès-verbaux','Dossier officiel RDC','Financements et subventions','Divers'] as const;
