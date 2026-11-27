import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";
import { useText } from "@/lib/labels";
import { PageHero } from "@/components/site/RichText";
import { Field, inputClass } from "@/components/forms/Fields";

export const Route = createFileRoute("/connexion")({
  head: () => seo("Connexion", "Connexion à l'espace membre — Fondation Monique Mokelina."),
  component: Page,
});

type Mode = "login" | "forgot" | "reset";

function Page() {
  const x = useText();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setMode("reset");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const goToSpace = async () => {
    const { data } = await supabase.auth.getUser();
    const uid = data.user?.id;
    const r = uid ? await supabase.from("user_roles").select("role").eq("user_id", uid) : null;
    const admin = (r?.data ?? []).some((v: { role: string }) => v.role === "admin");
    navigate({ to: admin ? "/admin" : "/membre", replace: true });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await goToSpace();
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/connexion` });
        if (error) throw error;
        setMsg({ ok: true, text: x("Si cette adresse a un compte, un lien vient de vous être envoyé par email.", "If this address has an account, a link has just been emailed to you.", "Soki adresi oyo ezali na compte, lien etindami na email na bino.") });
      } else {
        if (password.length < 8) throw new Error("short");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        await goToSpace();
      }
    } catch (err) {
      const short = err instanceof Error && err.message === "short";
      setMsg({ ok: false, text: short
        ? x("Le mot de passe doit faire au moins 8 caractères.", "The password must be at least 8 characters.", "Mot de passe esengeli kozala na bilembo 8 to koleka.")
        : x("Email ou mot de passe incorrect, ou compte pas encore confirmé.", "Wrong email or password, or account not yet confirmed.", "Email to mot de passe ezali malamu te, to compte endimami naino te.") });
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "login" ? x("Connexion", "Log in", "Kokota") : mode === "forgot" ? x("Mot de passe oublié", "Forgot password", "Mot de passe ebungi") : x("Nouveau mot de passe", "New password", "Mot de passe ya sika");

  return (
    <>
      <PageHero title={title} />
      <div className="container-page py-10">
        <form onSubmit={submit} className="grid max-w-md gap-5">
          {mode !== "reset" && (
            <Field label="Email"><input name="email" type="email" required autoComplete="email" className={inputClass} /></Field>
          )}
          {mode !== "forgot" && (
            <Field label={mode === "reset" ? x("Nouveau mot de passe (8 caractères minimum)", "New password (min. 8 characters)", "Mot de passe ya sika (bilembo 8 to koleka)") : x("Mot de passe", "Password", "Mot de passe")}>
              <input name="password" type="password" required minLength={mode === "reset" ? 8 : undefined} autoComplete={mode === "reset" ? "new-password" : "current-password"} className={inputClass} />
            </Field>
          )}
          {msg && <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "rounded-md border border-success bg-success/10 p-3" : "text-destructive"}>{msg.text}</p>}
          <Button type="submit" disabled={busy}>
            {busy ? "…" : mode === "login" ? x("Se connecter", "Log in", "Kokota") : mode === "forgot" ? x("Recevoir le lien", "Send me the link", "Kozwa lien") : x("Enregistrer", "Save", "Kobomba")}
          </Button>
          {mode === "login" && (
            <div className="flex flex-wrap justify-between gap-3 text-sm">
              <button type="button" className="text-primary underline" onClick={() => { setMode("forgot"); setMsg(null); }}>{x("Mot de passe oublié ?", "Forgot password?", "Mot de passe ebungi?")}</button>
              <Link to="/adhesion" className="text-primary underline">{x("Pas encore membre ? Adhérer", "Not a member yet? Join", "Ozali naino moto ya lisangani te? Kokota")}</Link>
            </div>
          )}
          {mode === "forgot" && (
            <button type="button" className="text-left text-sm text-primary underline" onClick={() => { setMode("login"); setMsg(null); }}>{x("Retour à la connexion", "Back to log in", "Kozonga na kokota")}</button>
          )}
        </form>
      </div>
    </>
  );
}
