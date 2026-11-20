import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useText } from "@/lib/labels";
import { openPrivateFile, type Member } from "@/lib/auth";
import { Logo } from "@/components/site/Logo";
import { Flag } from "@/components/site/Flags";

export type MemberFile = { id: string; member_id: string; title: string; category: "identity" | "card" | "document"; year: number; file_path: string; created_at: string };
export type Payment = { id: string; member_id: string; kind: string; paid_at: string; amount: number; currency: string; method: string; reference: string; status: string; created_at: string };

export function MemberCard({ member }: { member: Member }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-hero p-5 text-primary-foreground shadow-soft">
      <div className="flex items-center gap-3">
        <Logo size={48} />
        <div>
          <p className="font-display text-lg font-semibold">M.M Monique Mokelina</p>
          <p className="text-xs text-gold">Carte de membre {new Date().getFullYear()}</p>
        </div>
        <Flag country={member.country} className="ml-auto h-5 w-7 rounded-sm" />
      </div>
      <p className="mt-6 font-display text-2xl">{member.first_name} {member.last_name}</p>
      <p className="mt-1 text-sm text-primary-foreground/80">N° {String(member.member_number).padStart(4, "0")} · {member.category === "effectif" ? "Membre effectif" : member.founder ? "Membre fondateur" : "Membre sympathisant"}</p>
      <div className="kente-band absolute inset-x-0 bottom-0" />
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

