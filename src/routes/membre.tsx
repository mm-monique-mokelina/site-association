import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, IdCard, Upload, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";
import { useText } from "@/lib/labels";
import { useMe, safeFileName, type Member } from "@/lib/auth";
import { PageHero } from "@/components/site/RichText";
import { MemberCard, PaymentsList, FileList, PhotoUpload, type MemberFile, type Payment } from "@/components/member/shared";
import { Field, inputClass } from "@/components/forms/Fields";
import { BankInfo, MobileInfo, PaypalButton } from "@/components/site/PaymentInfo";
import { PaymentDeclare } from "@/components/site/PaymentDeclare";

export const Route = createFileRoute("/membre")({
  head: () => seo("Mon dossier", "Espace membre — Association M.M Monique Mokelina."),
  component: Page,
});

function Page() {
  const x = useText();
  const { session, loading, member, refetch } = useMe();
  if (loading) return <div className="container-page py-16">…</div>;
  if (!session)
    return (
      <>
        <PageHero title={x("Mon dossier", "My file", "Dossier na ngai")} />
        <div className="container-page space-y-4 py-10">
          <p>{x("Connectez-vous pour accéder à votre dossier.", "Log in to access your file.", "Kota mpo na kotala dossier na yo.")}</p>
          <Button asChild><Link to="/connexion">{x("Connexion", "Log in", "Kokota")}</Link></Button>
        </div>
      </>
    );
  if (!member) return <div className="container-page py-16">{x("Votre fiche membre est introuvable. Écrivez-nous.", "Your member record was not found. Write to us.", "Fiche na yo emonani te. Bokomela biso.")}</div>;
  return (
    <>
      <PageHero title={x("Mon dossier", "My file", "Dossier na ngai")} intro={`${member.first_name} ${member.last_name}`} />
      <div className="container-page py-10">
        {member.status === "validated" ? <Dossier member={member} onChange={() => refetch()} /> : <Pending member={member} />}
      </div>
    </>
  );
}

function Pending({ member }: { member: Member }) {
  const x = useText();
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4">
        <p className="rounded-md border border-gold bg-gold/10 p-4">
          {member.status === "refused"
            ? x("Votre demande d'adhésion n'a pas été acceptée. Écrivez-nous pour en parler.", "Your membership request was not accepted. Write to us to discuss it.", "Bosenga na yo endimami te. Bokomela biso.")
            : x("Votre adhésion est en attente de validation par le bureau. Vous pouvez déjà déclarer votre paiement.", "Your membership is awaiting approval by the board. You can already declare your payment.", "Bokoti na yo ezali kozela bondimi ya biro. Okoki koyebisa lifuti na yo.")}
        </p>
        {member.status !== "refused" && <PaymentDeclare memberId={member.id} country={member.country} />}
      </section>
      <section className="space-y-4">
        {member.country === "FR" ? <BankInfo reference={`ADHESION-${member.last_name.toUpperCase()}`} /> : <MobileInfo />}
        <PaypalButton />
      </section>
    </div>
  );
}

function Dossier({ member, onChange }: { member: Member; onChange: () => void }) {
  const x = useText();
  const files = useQuery({
    queryKey: ["my-files", member.id],
    queryFn: async () => (await supabase.from("member_files").select("*").eq("member_id", member.id).order("year", { ascending: false })).data as MemberFile[] ?? [],
  });
  const pays = useQuery({
    queryKey: ["my-payments", member.id],
    queryFn: async () => (await supabase.from("payments").select("*").eq("member_id", member.id).order("paid_at", { ascending: false })).data as Payment[] ?? [],
  });
  const identity = (files.data ?? []).filter((f) => f.category === "identity");
  const docs = (files.data ?? []).filter((f) => f.category !== "identity");
  const years = [...new Set(docs.map((d) => d.year))];
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-primary"><IdCard className="size-5" />{x("Ma carte de membre", "My membership card", "Carte na ngai")}</h2>
          <MemberCard member={member} />
          <div className="mt-3">
            {member.documents_consent_at
              ? <PhotoUpload member={member} onDone={() => onChange()} />
              : <p className="text-sm text-muted-foreground">{x("Pour ajouter votre photo, acceptez d'abord la conservation de vos documents (encadré « Déposer un document »).", "To add your photo, first accept that your documents are kept (“Upload a document” box).", "Mpo na kobakisa foto, ndima liboso ete mikanda na yo ebombama.")}</p>}
          </div>
        </section>
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-primary"><Wallet className="size-5" />{x("Mes cotisations", "My fees", "Mbongo na ngai")}</h2>
          <PaymentsList payments={pays.data ?? []} />
          <details className="mt-4 rounded-xl border p-4">
            <summary className="cursor-pointer font-semibold text-primary">{x("Déclarer un paiement", "Declare a payment", "Koyebisa lifuti")}</summary>
            <div className="mt-4"><PaymentDeclare memberId={member.id} defaultKind="mensualite" country={member.country} onDone={() => pays.refetch()} /></div>
          </details>
        </section>
      </div>
      <div className="space-y-6">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-primary"><IdCard className="size-5" />{x("Ma pièce d'identité", "My ID document", "Mokanda ya identité")}</h2>
          <FileList files={identity} empty={x("Aucune pièce déposée.", "No document yet.", "Mokanda moko te.")} />
        </section>
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-primary"><FileText className="size-5" />{x("Mes documents", "My documents", "Mikanda na ngai")}</h2>
          {years.length ? years.map((y) => (
            <div key={y} className="mb-4">
              <h3 className="mb-2 font-semibold">{y}</h3>
              <FileList files={docs.filter((d) => d.year === y)} empty="" />
            </div>
          )) : <p className="text-muted-foreground">{x("Aucun document pour l'instant.", "No documents yet.", "Mikanda te naino.")}</p>}
        </section>
        <Uploader member={member} onDone={() => { files.refetch(); onChange(); }} />
      </div>
    </div>
  );
}

function Uploader({ member, onDone }: { member: Member; onDone: () => void }) {
  const x = useText();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [consent, setConsent] = useState(!!member.documents_consent_at);
  const giveConsent = async () => {
    const { error } = await supabase.rpc("consent_documents");
    if (!error) { setConsent(true); onDone(); }
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("file") as File | null;
    if (!file || !file.size) return;
    if (file.size > 10 * 1024 * 1024) { setErr(x("Fichier trop lourd (10 Mo maximum).", "File too large (10 MB max).", "Fichier eleki monene (10 Mo).")); return; }
    setBusy(true); setErr("");
    const path = `${member.id}/${safeFileName(file.name)}`;
    const up = await supabase.storage.from("member-files").upload(path, file, { contentType: file.type || "application/octet-stream" });
    if (up.error) { setBusy(false); setErr(x("Envoi impossible.", "Upload failed.", "Ekoki kotindama te.")); return; }
    const ins = await supabase.from("member_files").insert({ member_id: member.id, title: String(f.get("title")).trim().slice(0, 150) || file.name, category: String(f.get("category")), year: Number(f.get("year")), file_path: path });
    setBusy(false);
    if (ins.error) { await supabase.storage.from("member-files").remove([path]); setErr(x("Envoi impossible.", "Upload failed.", "Ekoki kotindama te.")); return; }
    form.reset();
    onDone();
  };
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-primary"><Upload className="size-5" />{x("Déposer un document", "Upload a document", "Kotinda mokanda")}</h2>
      {!consent ? (
        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm">
            <input id="consent" type="checkbox" className="mt-1 size-4 accent-primary" />
            <span>{x("J'accepte que l'association conserve mes documents de façon confidentielle, consultables uniquement par moi et l'administratrice.", "I agree that the association keeps my documents confidentially, viewable only by me and the administrator.", "Nandimi ete lisangani ebomba mikanda na ngai na kobombama, kaka ngai mpe mokambi bakoki kotala yango.")}</span>
          </label>
          <Button onClick={() => { const c = document.getElementById("consent") as HTMLInputElement | null; if (c?.checked) giveConsent(); }}>{x("Valider", "Confirm", "Kondima")}</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label={x("Titre", "Title", "Motó ya likambo")}><input name="title" maxLength={150} required className={inputClass} /></Field></div>
          <Field label={x("Type", "Type", "Lolenge")}>
            <select name="category" className={inputClass}>
              <option value="document">{x("Document", "Document", "Mokanda")}</option>
              <option value="identity">{x("Pièce d'identité", "ID document", "Mokanda ya identité")}</option>
            </select>
          </Field>
          <Field label={x("Année", "Year", "Mobu")}><input name="year" type="number" min={1950} max={2200} defaultValue={new Date().getFullYear()} className={inputClass} /></Field>
          <div className="sm:col-span-2"><Field label={x("Fichier (PDF ou photo, 10 Mo max)", "File (PDF or photo, 10 MB max)", "Fichier (PDF to foto, 10 Mo)")}><input name="file" type="file" required accept=".pdf,image/*" className={inputClass} /></Field></div>
          {err && <p role="alert" className="text-destructive sm:col-span-2">{err}</p>}
          <Button type="submit" disabled={busy} className="sm:col-span-2">{busy ? "…" : x("Envoyer", "Send", "Kotinda")}</Button>
        </form>
      )}
    </section>
  );
}
