import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";
import { useText } from "@/lib/labels";
import { useSiteData, POLES } from "@/lib/content";
import { PageHero } from "@/components/site/RichText";
import { Field, inputClass } from "@/components/forms/Fields";
import { BankInfo, MobileInfo, PaypalButton } from "@/components/site/PaymentInfo";
import { PaymentDeclare } from "@/components/site/PaymentDeclare";
import { Flag } from "@/components/site/Flags";

export const Route = createFileRoute("/adhesion")({
  head: () => seo("Adhérer", "Devenez membre de la Fondation Monique Mokelina, en France ou au Congo (RDC)."),
  component: Page,
});

type Info = { first_name: string; last_name: string; email: string; phone: string; city: string; category: string; pole: string };

function Page() {
  const x = useText();
  const { s } = useSiteData();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState<"FR" | "CD">("FR");
  const [info, setInfo] = useState<Info | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [memberId, setMemberId] = useState<string | null>(null);

  const steps = [x("Pays", "Country", "Mboka"), x("Coordonnées", "Details", "Makambo"), x("Engagements", "Agreements", "Bondimi"), x("Compte", "Account", "Compte"), x("Paiement", "Payment", "Kofuta"), x("Validation", "Approval", "Bondimi")];
  const cur = country === "CD" ? s("fee_cd_currency") || "USD" : "€";
  const fee = (k: string) => (s(k) ? `${s(k)} ${cur}` : x("communiqué prochainement", "to be announced", "ekoyebisama"));

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!info) return;
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    if (password !== String(f.get("password2"))) { setError(x("Les deux mots de passe sont différents.", "The two passwords differ.", "Ba mot de passe mibale ekokani te.")); return; }
    setBusy(true); setError("");
    const { data, error: err } = await supabase.auth.signUp({
      email: info.email, password,
      options: { emailRedirectTo: `${window.location.origin}/membre`, data: { ...info, country, accept_statutes: "true", rgpd: "true" } },
    });
    setBusy(false);
    if (err) { setError(x("Création impossible : cette adresse a peut-être déjà un compte. Essayez « Connexion ».", "Could not create the account: this address may already have one. Try “Log in”.", "Compte ekoki kosalema te: adresi oyo ekoki kozala na compte. Meka « Kokota ».")); return; }
    if (data.session) {
      const m = await supabase.from("members").select("id").eq("user_id", data.session.user.id).maybeSingle();
      setMemberId((m.data as { id: string } | null)?.id ?? null);
    }
    setStep(5);
  };

  return (
    <>
      <PageHero title={x("Adhérer à la Fondation", "Join the Foundation", "Kokota na lisangani")} intro={x("Rejoignez-nous en France ou au Congo (RDC), en quelques étapes.", "Join us in France or Congo (RDC) in a few steps.", "Bokota elongo na biso na France to na Kongo (RDC), na mwa matambe.")} />
      <div className="container-page py-10">
        <ol className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label={x("Étapes", "Steps", "Matambe")}>
          {steps.map((label, i) => (
            <li key={label} className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold ${i + 1 === step ? "border-primary bg-primary text-primary-foreground" : i + 1 < step ? "border-gold bg-gold/15 text-primary" : "text-muted-foreground"}`}>
              {i + 1 < step ? <Check className="mx-auto size-4" /> : `${i + 1}.`} {label}
            </li>
          ))}
        </ol>

        <div className="max-w-2xl">
          {step === 1 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-primary">{x("Où habitez-vous ?", "Where do you live?", "Ofandaka wapi?")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {(["FR", "CD"] as const).map((c) => (
                  <button key={c} type="button" onClick={() => setCountry(c)} className={`flex items-center gap-3 rounded-xl border-2 p-5 text-left ${country === c ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Flag country={c} className="h-6 w-9 rounded-sm" />
                    <span className="font-display text-lg font-semibold">{c === "FR" ? "France" : x("Congo (RDC)", "Congo (RDC)", "Kongo (RDC)")}</span>
                  </button>
                ))}
              </div>
              <div className="rounded-xl border bg-card p-5">
                <p><strong>{x("Droit d'adhésion", "Membership fee", "Mbongo ya kokota")} :</strong> {fee(country === "FR" ? "fee_fr_join" : "fee_cd_join")}</p>
                <p className="mt-1"><strong>{x("Mensualité", "Monthly fee", "Mbongo ya sanza")} :</strong> {fee(country === "FR" ? "fee_fr_monthly" : "fee_cd_monthly")}</p>
              </div>
              <Button onClick={() => setStep(2)}>{x("Continuer", "Continue", "Kokoba")}</Button>
            </section>
          )}

          {step === 2 && (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              setInfo({ first_name: String(f.get("first_name")).trim(), last_name: String(f.get("last_name")).trim(), email: String(f.get("email")).trim().toLowerCase(), phone: String(f.get("phone")).trim(), city: String(f.get("city")).trim(), category: String(f.get("category")), pole: String(f.get("pole")) });
              setStep(3);
            }}>
              <Field label={x("Prénom", "First name", "Nkombo ya batisimo")}><input name="first_name" required maxLength={150} defaultValue={info?.first_name} className={inputClass} /></Field>
              <Field label={x("Nom", "Last name", "Nkombo")}><input name="last_name" required maxLength={150} defaultValue={info?.last_name} className={inputClass} /></Field>
              <Field label="Email"><input name="email" type="email" required maxLength={255} defaultValue={info?.email} className={inputClass} /></Field>
              <Field label={x("Téléphone / WhatsApp", "Phone / WhatsApp", "Telefone / WhatsApp")}><input name="phone" type="tel" maxLength={40} defaultValue={info?.phone} className={inputClass} /></Field>
              <Field label={x("Ville", "City", "Engumba")}><input name="city" required maxLength={150} defaultValue={info?.city} className={inputClass} /></Field>
              <Field label={x("Catégorie", "Category", "Lolenge")}>
                <select name="category" defaultValue={info?.category ?? "sympathisant"} className={inputClass}>
                  <option value="effectif">{x("Membre effectif", "Full member", "Moto ya lisangani mobimba")}</option>
                  <option value="sympathisant">{x("Membre sympathisant", "Supporting member", "Moto oyo asungaka")}</option>
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label={x("Pôle qui vous intéresse", "Area of interest", "Etuluku oyo olingi")}>
                  <select name="pole" defaultValue={info?.pole ?? ""} className={inputClass}>
                    <option value="">{x("Je ne sais pas encore", "Not sure yet", "Nayebi naino te")}</option>
                    {POLES.map((p) => <option key={p.id} value={p.id}>{p.fr}</option>)}
                  </select>
                </Field>
              </div>
              <div className="flex gap-3 sm:col-span-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>{x("Retour", "Back", "Kozonga")}</Button>
                <Button type="submit">{x("Continuer", "Continue", "Kokoba")}</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
              <label className="flex items-start gap-3"><input type="checkbox" required className="mt-1 size-4 accent-primary" /><span>{x("J'accepte les statuts et le règlement intérieur de la Fondation.", "I accept the Foundation's statutes and internal rules.", "Nandimi mibeko mpe malako ya lisangani.")}</span></label>
              <label className="flex items-start gap-3"><input type="checkbox" required className="mt-1 size-4 accent-primary" /><span>{x("J'accepte que la Fondation utilise mes données pour gérer mon adhésion (voir ", "I agree that the Foundation uses my data to manage my membership (see ", "Nandimi ete lisangani esalela ba données na ngai mpo na bokoti na ngai (tala ")}<Link to="/confidentialite" className="text-primary underline">{x("Protection des données", "Data protection", "Kobatela ba données")}</Link>).</span></label>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>{x("Retour", "Back", "Kozonga")}</Button>
                <Button type="submit">{x("Continuer", "Continue", "Kokoba")}</Button>
              </div>
            </form>
          )}

          {step === 4 && info && (
            <form className="grid gap-4" onSubmit={createAccount}>
              <p>{x("Choisissez un mot de passe pour votre espace membre. Vous vous connecterez avec", "Choose a password for your member area. You will log in with", "Pona mot de passe mpo na esika na yo. Okokota na")} <strong>{info.email}</strong>.</p>
              <Field label={x("Mot de passe (8 caractères minimum)", "Password (min. 8 characters)", "Mot de passe (bilembo 8 to koleka)")}><input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} /></Field>
              <Field label={x("Confirmez le mot de passe", "Confirm password", "Kokoma lisusu mot de passe")}><input name="password2" type="password" required minLength={8} autoComplete="new-password" className={inputClass} /></Field>
              {error && <p role="alert" className="text-destructive">{error}</p>}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>{x("Retour", "Back", "Kozonga")}</Button>
                <Button type="submit" disabled={busy}>{busy ? "…" : x("Créer mon compte", "Create my account", "Kosala compte na ngai")}</Button>
              </div>
            </form>
          )}

          {step === 5 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-primary">{x("Réglez votre adhésion", "Pay your membership", "Futa bokoti na yo")}</h2>
              <p>{x("Droit d'adhésion", "Membership fee", "Mbongo ya kokota")} : <strong>{fee(country === "FR" ? "fee_fr_join" : "fee_cd_join")}</strong></p>
              {country === "FR" ? <BankInfo reference={`ADHESION-${(info?.last_name ?? "").toUpperCase()}`} /> : <MobileInfo />}
              <PaypalButton />
              {memberId ? (
                <div className="rounded-xl border p-5"><h3 className="mb-3 font-semibold text-primary">{x("Déclarer mon paiement", "Declare my payment", "Koyebisa lifuti na ngai")}</h3><PaymentDeclare memberId={memberId} country={country} /></div>
              ) : (
                <p className="rounded-md border border-gold bg-gold/10 p-4">{x("Un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu'il contient, puis connectez-vous : vous pourrez déclarer votre paiement dans « Mon dossier ».", "A confirmation email has just been sent. Click its link, then log in: you can declare your payment in “My file”.", "Email ya kondima etindami. Finá lien, sima kota: okoki koyebisa lifuti na « Dossier na ngai ».")}</p>
              )}
              <Button onClick={() => setStep(6)}>{x("Terminer", "Finish", "Kosilisa")}</Button>
            </section>
          )}

          {step === 6 && (
            <section className="space-y-4 rounded-2xl border bg-card p-6">
              <h2 className="text-2xl font-semibold text-primary">{x("Merci pour votre adhésion !", "Thank you for joining!", "Matondi mpo na bokoti na yo!")}</h2>
              <p>{x("Votre demande est en attente de validation. Le bureau la vérifie et vous donne accès à votre espace membre.", "Your request is awaiting approval. The board will check it and give you access to your member area.", "Bosenga na yo ezali kozela. Biro ekotala yango mpe ekofungola esika na yo.")}</p>
              <Button asChild><Link to="/connexion">{x("Aller à la connexion", "Go to log in", "Kokende na kokota")}</Link></Button>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
