import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { Logo } from "./Logo";
import { NAV } from "./SiteHeader";
import { ContactLinks } from "./ContactLinks";
import { Flag } from "./Flags";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 bg-primary-deep text-primary-foreground">
      <div className="kente-band" />
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo size={64} />
          <p className="mt-3 font-display text-lg">M.M Monique Mokelina</p>
          <p className="text-sm text-gold">Ensemble pour un avenir meilleur</p>
          <p className="mt-2 text-xs text-primary-foreground/70">{t("footer.rights")}</p>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="text-primary-foreground/80 hover:text-gold">{t(n.k)}</Link>)}
          <Link to="/adhesion" className="text-primary-foreground/80 hover:text-gold">{t("nav.join")}</Link>
          <Link to="/don" className="text-primary-foreground/80 hover:text-gold">{t("nav.donate")}</Link>
        </nav>
        <div className="text-sm md:col-span-2">
          <p className="mb-3 flex items-center gap-2 font-semibold text-gold"><Flag country="CD" className="h-3.5 w-5 rounded-[2px]" /> Congo (RDC) · France <Flag country="FR" className="h-3.5 w-5 rounded-[2px]" /></p>
          <ContactLinks dark />
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-wrap gap-4 py-4 text-xs text-primary-foreground/70">
          <span>© {new Date().getFullYear()} M.M Monique Mokelina</span>
          <Link to="/mentions-legales" className="hover:text-gold">{t("footer.legal")}</Link>
          <Link to="/confidentialite" className="hover:text-gold">{t("footer.privacy")}</Link>
          <Link to="/connexion" className="hover:text-gold">{t("nav.login")}</Link>
        </div>
      </div>
    </footer>
  );
}
