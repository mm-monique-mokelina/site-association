import { useEffect, useState } from "react";
import { FileText, Download, Printer, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import QRCode from "qrcode";
import { renderMemberCard, downloadCard, printCard, categoryLabel, cardDates, SITE_URL } from "@/lib/member-card";
import { Button } from "@/components/ui/button";
import { useText } from "@/lib/labels";
import { openPrivateFile, compressImage, type Member } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { Flag } from "@/components/site/Flags";

export type MemberFile = { id: string; member_id: string; title: string; category: "identity" | "card" | "document"; year: number; file_path: string; created_at: string };
export type Payment = { id: string; member_id: string; kind: string; paid_at: string; amount: number; currency: string; method: string; reference: string; status: string; created_at: string };

export function usePhotoUrl(member: Member) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (!member.photo_path) { setUrl(null); return; }
    supabase.storage.from("member-files").createSignedUrl(member.photo_path, 3600).then(({ data }) => { if (alive) setUrl(data?.signedUrl ?? null); });
    return () => { alive = false; };
  }, [member.photo_path]);
  return url;
}

export function MemberCard({ member }: { member: Member }) {
  const x = useText();
  const photo = usePhotoUrl(member);
  const [qr, setQr] = useState("");
  useEffect(() => { QRCode.toDataURL(SITE_URL, { width: 160, margin: 1, color: { dark: "#3a0f4f", light: "#ffffff" } }).then(setQr).catch(() => setQr("")); }, []);
  const [busy, setBusy] = useState<"" | "dl" | "print">("");
  const act = async (kind: "dl" | "print") => {
    setBusy(kind);
    try { const blob = await renderMemberCard(member, photo); if (kind === "dl") downloadCard(blob, member); else printCard(blob); }
    finally { setBusy(""); }
  };
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-hero p-5 text-primary-foreground shadow-soft">
        <div className="flex items-center gap-3">
          <Logo size={52} />
          <div>
            <p className="font-display text-lg font-semibold">Fondation Monique Mokelina</p>
            <p className="text-xs text-gold">{x("Carte de membre", "Membership card", "Carte ya lisangani")}</p>
          </div>
          <span className="ml-auto flex gap-1.5"><Flag country="FR" className="h-5 w-7 rounded-sm" /><Flag country="CD" className="h-5 w-7 rounded-sm" /></span>
        </div>
        <div className="mt-5 flex items-center gap-4 pb-3">
          {photo ? (
            <img src={photo} alt="" className="h-28 w-[5.5rem] shrink-0 rounded-lg object-cover ring-2 ring-gold" />
          ) : (
            <span className="flex h-28 w-[5.5rem] shrink-0 items-center justify-center rounded-lg bg-white/15 font-display text-3xl text-gold ring-2 ring-gold">
              {`${member.first_name.charAt(0)}${member.last_name.charAt(0)}`.toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl leading-tight">{member.first_name} <span className="uppercase">{member.last_name}</span></p>
            <p className="mt-1 text-sm text-gold">{categoryLabel(member)}</p>
            <p className="flex items-center gap-2 text-sm text-primary-foreground/80"><Flag country={member.country} className="h-3.5 w-5 rounded-[2px]" />{member.country === "CD" ? "Congo (RDC)" : "France"}</p>
            <p className="mt-2 text-xs text-primary-foreground/80">{x("Délivrée le", "Issued", "Epesami")} <strong>{cardDates(member).issued}</strong> · {x("valable jusqu'au", "valid until", "ekosila")} <strong>{cardDates(member).valid}</strong></p>
          </div>
          {qr && (
            <figure className="hidden shrink-0 text-center sm:block">
              <img src={qr} alt={x("QR code du site de la Fondation", "QR code of the Foundation website", "QR code ya site")} className="size-20 rounded-md bg-white p-1" />
              <figcaption className="mt-1 text-[10px] text-primary-foreground/70">{x("Site de la Fondation", "Foundation website", "Site ya lisangani")}</figcaption>
            </figure>
          )}
        </div>
        <div className="kente-band absolute inset-x-0 bottom-0" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => act("dl")}><Download />{busy === "dl" ? "…" : x("Télécharger la carte", "Download the card", "Kokitisa carte")}</Button>
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => act("print")}><Printer />{busy === "print" ? "…" : x("Imprimer la carte", "Print the card", "Kobimisa carte")}</Button>
      </div>
    </div>
  );
}

/** Ajout ou remplacement de la photo de la carte (membre ou administratrice). */
export function PhotoUpload({ member, onDone }: { member: Member; onDone: (m: Member) => void }) {
  const x = useText();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const blob = await compressImage(file, 800, 0.85);
      const path = `${member.id}/photo-${Date.now()}.webp`;
      const up = await supabase.storage.from("member-files").upload(path, blob, { contentType: "image/webp" });
      if (up.error) throw up.error;
      const { data, error } = await supabase.from("members").update({ photo_path: path }).eq("id", member.id).select().single();
      if (error || !data) { await supabase.storage.from("member-files").remove([path]); throw error; }
      if (member.photo_path) await supabase.storage.from("member-files").remove([member.photo_path]);
      onDone(data as Member);
    } catch {
      setErr(x("Envoi de la photo impossible.", "Photo upload failed.", "Foto ekoki kotindama te."));
    } finally { setBusy(false); }
  };
  return (
    <div className="space-y-1">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm font-semibold hover:bg-accent">
        <Camera className="size-4" />{busy ? "…" : member.photo_path ? x("Changer la photo", "Change photo", "Kobongola foto") : x("Ajouter une photo", "Add a photo", "Kobakisa foto")}
        <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={change} />
      </label>
      <p className="text-xs text-muted-foreground">{x("Photo d'identité, de face, sur fond clair.", "ID-style photo, facing forward, light background.", "Foto ya elongi, na mokongo ya pole.")}</p>
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
    </div>
  );
}

export function PaymentsList({ payments }: { payments: Payment[] }) {
  const x = useText();
  if (!payments.length) return <p className="text-muted-foreground">{x("Aucun paiement enregistré.", "No payments recorded.", "Lifuti moko te.")}</p>;
  const label = (s: string) => s === "validated" ? x("Confirmé", "Confirmed", "Endimami") : s === "refused" ? x("Refusé", "Refused", "Eboyami") : x("En attente", "Pending", "Ezali kozela");
  return (
    <ul className="divide-y rounded-xl border">
      {payments.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
          <span>{new Date(p.paid_at).toLocaleDateString("fr-FR")} · {p.kind === "adhesion" ? x("Adhésion", "Membership", "Bokoti") : x("Mensualité", "Monthly", "Sanza")} · {p.method}</span>
          <span className="font-semibold">{Number(p.amount).toFixed(2)} {p.currency}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${p.status === "validated" ? "bg-success/15 text-success" : p.status === "refused" ? "bg-destructive/15 text-destructive" : "bg-gold/20"}`}>{label(p.status)}</span>
        </li>
      ))}
    </ul>
  );
}

export function FileList({ files, empty, bucket = "member-files", onDelete }: { files: { id: string; title: string; file_path: string; created_at: string }[]; empty: string; bucket?: string; onDelete?: (f: { id: string; file_path: string }) => void }) {
  const x = useText();
  if (!files.length) return empty ? <p className="text-muted-foreground">{empty}</p> : null;
  return (
    <ul className="divide-y rounded-xl border">
      {files.map((f) => (
        <li key={f.id} className="flex items-center gap-3 p-3 text-sm">
          <FileText className="size-4 shrink-0 text-primary" />
          <span className="flex-1 break-words">{f.title} <span className="text-xs text-muted-foreground">· {new Date(f.created_at).toLocaleDateString("fr-FR")}</span></span>
          <Button size="sm" variant="outline" onClick={() => openPrivateFile(bucket, f.file_path).catch(() => alert(x("Fichier indisponible.", "File unavailable.", "Fichier ezali te.")))}><Download />{x("Télécharger", "Download", "Kokitisa")}</Button>
          {onDelete && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (window.confirm(x("Supprimer ce document ? Cette action est définitive.", "Delete this document? This cannot be undone.", "Kolongola mokanda oyo?"))) onDelete(f); }}>{x("Supprimer", "Delete", "Kolongola")}</Button>}
        </li>
      ))}
    </ul>
  );
}

