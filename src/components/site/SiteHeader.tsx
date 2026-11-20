import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Globe, User } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useI18n, LANGS } from "@/i18n";
import { useMe } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./Logo";

export const NAV = [
  { to: "/", k: "nav.home" },
  { to: "/qui-sommes-nous", k: "nav.about" },
  { to: "/actions", k: "nav.actions" },
  { to: "/france-congo", k: "nav.franceCongo" },
  { to: "/actualites", k: "nav.news" },
  { to: "/benevole", k: "nav.volunteer" },
  { to: "/contact", k: "nav.contact" },
] as const;

export function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="flex items-center gap-1">
      <Globe className="size-4 text-muted-foreground" aria-hidden />
      <select aria-label="Langue" value={lang} onChange={(e) => setLang(e.target.value as never)}
        className="rounded-md border bg-background px-2 py-1 text-sm">
        {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
      </select>
      {lang === "ln" && <span className="hidden text-xs text-muted-foreground lg:inline">({t("lang.reviewNote")})</span>}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const { session, isAdmin } = useMe();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={42} />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold text-primary">M.M Monique Mokelina</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Ensemble pour un avenir meilleur</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 2xl:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground data-[status=active]:font-semibold data-[status=active]:text-primary">
              {t(n.k)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 2xl:ml-2">
          <div className="hidden md:block"><LangSwitch /></div>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex"><Link to="/don">{t("nav.donate")}</Link></Button>
          {session ? (
            <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
              <Link to={isAdmin ? "/admin" : "/membre"}><User />{isAdmin ? t("nav.admin") : t("nav.member")}</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden md:inline-flex"><Link to="/adhesion">{t("nav.join")}</Link></Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="2xl:hidden" aria-label={t("nav.menu")}><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetTitle className="font-display text-primary">{t("nav.menu")}</SheetTitle>
              <nav className="mt-4 flex flex-col gap-1" onClick={() => setOpen(false)}>
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 hover:bg-accent">{t(n.k)}</Link>
                ))}
                <Link to="/don" className="rounded-md px-3 py-2 hover:bg-accent">{t("nav.donate")}</Link>
                <Link to="/adhesion" className="rounded-md px-3 py-2 hover:bg-accent">{t("nav.join")}</Link>
                <hr className="my-2" />
                {session ? (
                  <>
                    <Link to="/membre" className="rounded-md px-3 py-2 hover:bg-accent">{t("nav.member")}</Link>
                    {isAdmin && <Link to="/admin" className="rounded-md px-3 py-2 hover:bg-accent">{t("nav.admin")}</Link>}
                    <button onClick={logout} className="rounded-md px-3 py-2 text-left hover:bg-accent">{t("nav.logout")}</button>
                  </>
                ) : (
                  <Link to="/connexion" className="rounded-md px-3 py-2 hover:bg-accent">{t("nav.login")}</Link>
                )}
              </nav>
              <div className="mt-4 px-3"><LangSwitch /></div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
