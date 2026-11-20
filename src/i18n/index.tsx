import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fr, type Dict } from "./fr";
import { en } from "./en";
import { ln } from "./ln";

export type Lang = "fr" | "en" | "ln";
export const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ln", label: "Lingala" },
];
const dicts: Record<Lang, Dict> = { fr, en, ln };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof Dict) => string };
const I18nContext = createContext<Ctx>({ lang: "fr", setLang: () => {}, t: (k) => fr[k] });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    const saved = localStorage.getItem("mm-lang") as Lang | null;
    if (saved && saved in dicts) setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    localStorage.setItem("mm-lang", l);
    setLangState(l);
  };
  const t = (k: keyof Dict) => dicts[lang][k] || fr[k];
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
