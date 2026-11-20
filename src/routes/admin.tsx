import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LayoutDashboard, UserCheck, Users, Wallet, Gift, Mail, HandHeart, FolderLock, Settings, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/lib/seo";
import { useMe, safeFileName, type Member } from "@/lib/auth";
import { DONATIONS, ASSOCIATION_FOLDERS } from "@/lib/labels";
import { PageHero } from "@/components/site/RichText";
import { Field, inputClass } from "@/components/forms/Fields";
import { MemberCard, PaymentsList, FileList, type MemberFile, type Payment } from "@/components/member/shared";
import { Flag } from "@/components/site/Flags";

export const Route = createFileRoute("/admin")({
  head: () => seo("Administration", "Administration — Association M.M Monique Mokelina."),
  component: Page,
});

type Tab = "dash" | "pending" | "members" | "payments" | "dons" | "messages" | "volunteers" | "docs" | "settings";
const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "dash", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "pending", label: "Adhésions à valider", icon: UserCheck },
  { id: "members", label: "Membres", icon: Users },
  { id: "payments", label: "Cotisations et paiements", icon: Wallet },
  { id: "dons", label: "Dons", icon: Gift },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "volunteers", label: "Bénévoles et partenaires", icon: HandHeart },
  { id: "docs", label: "Documents de l'association", icon: FolderLock },
  { id: "settings", label: "Réglages du site", icon: Settings },
];

const fmt = (d: string) => new Date(d).toLocaleDateString("fr-FR");
const fullName = (m: { first_name: string; last_name: string }) => `${m.first_name} ${m.last_name}`.trim();

function useTable<T>(table: string, order = "created_at") {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(order, { ascending: false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}

function Page() {
  const { session, loading, isAdmin } = useMe();
  const [tab, setTab] = useState<Tab>("dash");
  if (loading) return <div className="container-page py-16">Chargement…</div>;
  if (!session || !isAdmin)
    return (
      <>
        <PageHero title="Administration" />
        <div className="container-page space-y-4 py-10">
          <p>Cet espace est réservé à l'administration de l'association.</p>
          <Button asChild><Link to="/connexion">Connexion</Link></Button>
        </div>
      </>
    );
  return (
    <>
      <PageHero title="Administration" />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Menu administration">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold ${tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
              <t.icon className="size-4" />{t.label}
            </button>
          ))}
        </nav>
        <div className="min-w-0">
          {tab === "dash" && <Dashboard go={setTab} />}
          {tab === "pending" && <PendingMembers />}
          {tab === "members" && <MembersTab />}
          {tab === "payments" && <PaymentsTab />}
          {tab === "dons" && <DonsTab />}
          {tab === "messages" && <MessagesTab />}
          {tab === "volunteers" && <VolunteersTab />}
          {tab === "docs" && <DocsTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </div>
    </>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-2xl font-semibold text-primary">{children}</h2>;
}

function Dashboard({ go }: { go: (t: Tab) => void }) {
  const members = useTable<Member>("members");
  const pays = useTable<Payment>("payments");
  const msgs = useTable<{ handled: boolean }>("contact_messages");
  const vols = useTable<{ handled: boolean }>("volunteer_requests");
  const dons = useTable<{ handled: boolean }>("donation_pledges");
  const cards: { label: string; n: number; tab: Tab }[] = [
    { label: "Adhésions à valider", n: (members.data ?? []).filter((m) => m.status === "pending").length, tab: "pending" },
    { label: "Paiements à confirmer", n: (pays.data ?? []).filter((p) => p.status === "pending").length, tab: "payments" },
    { label: "Messages non traités", n: (msgs.data ?? []).filter((m) => !m.handled).length, tab: "messages" },
    { label: "Bénévoles et partenaires", n: (vols.data ?? []).filter((m) => !m.handled).length, tab: "volunteers" },
    { label: "Promesses de don", n: (dons.data ?? []).filter((m) => !m.handled).length, tab: "dons" },
    { label: "Membres validés", n: (members.data ?? []).filter((m) => m.status === "validated").length, tab: "members" },
  ];
  return (
    <>
      <H>Tableau de bord</H>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <button key={c.label} onClick={() => go(c.tab)} className="rounded-2xl border bg-card p-5 text-left shadow-soft hover:border-primary">
            <p className="font-display text-4xl font-semibold text-primary">{c.n}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
          </button>
        ))}
      </div>
    </>
  );
}

function PendingMembers() {
  const qc = useQueryClient();
  const members = useTable<Member>("members");
  const list = (members.data ?? []).filter((m) => m.status === "pending");
  const setStatus = async (id: string, status: "validated" | "refused") => {
    await supabase.from("members").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin"] });
  };
  return (
    <>
      <H>Adhésions à valider</H>
      {!list.length && <p className="text-muted-foreground">Aucune adhésion en attente.</p>}
      <ul className="space-y-3">
        {list.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
            <div className="flex-1">
              <p className="font-semibold">{fullName(m)} <span className="text-sm font-normal text-muted-foreground">· <Flag country={m.country} className="inline h-3 w-4 rounded-[2px]" /> {m.country === "CD" ? "Congo (RDC)" : "France"} · {m.city}</span></p>
              <p className="text-sm text-muted-foreground">{m.email} · {m.phone} · {m.category} · demandé le {fmt(m.created_at)}</p>
            </div>
            <Button size="sm" onClick={() => setStatus(m.id, "validated")}>Valider</Button>
            <Button size="sm" variant="outline" onClick={() => { if (window.confirm(`Refuser l'adhésion de ${fullName(m)} ?`)) setStatus(m.id, "refused"); }}>Refuser</Button>
          </li>
        ))}
      </ul>
    </>
  );
}

function MembersTab() {
  const members = useTable<Member>("members", "member_number");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"number" | "name">("name");
  const [open, setOpen] = useState<Member | null>(null);
  const [adding, setAdding] = useState(false);
  if (open) return <MemberSheet member={open} back={() => { setOpen(null); members.refetch(); }} />;
  const filtered = (members.data ?? [])
    .filter((m) => `${m.first_name} ${m.last_name} ${m.email ?? ""}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === "number" ? a.member_number - b.member_number
      : a.last_name.localeCompare(b.last_name, "fr") || a.first_name.localeCompare(b.first_name, "fr"));
  const statusLabel: Record<string, string> = { pending: "En attente", validated: "Validé", refused: "Refusé", founder: "Fondateur · à compléter" };
  const groups: { country: "FR" | "CD"; title: string }[] = [{ country: "FR", title: "France" }, { country: "CD", title: "Congo (RDC)" }];
  return (
    <>
      <H>Membres</H>
      <div className="mb-6 flex flex-wrap gap-3">
        <input placeholder="Rechercher un nom ou un email" value={q} onChange={(e) => setQ(e.target.value)} className={`${inputClass} max-w-xs`} />
        <select value={sort} onChange={(e) => setSort(e.target.value as "number" | "name")} className={`${inputClass} max-w-[240px]`} aria-label="Trier">
          <option value="name">Ordre alphabétique (A → Z)</option><option value="number">Ordre des numéros de membre</option>
        </select>
        <Button variant="outline" onClick={() => setAdding((v) => !v)}>Ajouter une fiche</Button>
      </div>
      {adding && <AddMember onDone={() => { setAdding(false); members.refetch(); }} />}
      <div className="space-y-8">
        {groups.map((g) => {
          const list = filtered.filter((m) => m.country === g.country);
          return (
            <section key={g.country}>
              <h3 className="mb-3 flex items-center gap-3 text-xl font-semibold text-primary">
                <Flag country={g.country} className="h-5 w-7 rounded-sm shadow" />{g.title}
                <span className="rounded-full bg-muted px-2 py-0.5 text-sm font-normal text-muted-foreground">{list.length} membre{list.length > 1 ? "s" : ""}</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left"><tr><th className="w-12 p-3">#</th><th className="p-3">Nom</th><th className="p-3">N° de membre</th><th className="p-3">Statut</th><th className="p-3">Compte</th></tr></thead>
                  <tbody>
                    {list.map((m, i) => (
                      <tr key={m.id} className="cursor-pointer border-t hover:bg-accent" onClick={() => setOpen(m)}>
                        <td className="p-3 font-semibold">{i + 1}</td>
                        <td className="p-3 font-semibold text-primary underline">{m.last_name} {m.first_name}</td>
                        <td className="p-3 text-muted-foreground">{String(m.member_number).padStart(4, "0")}</td>
                        <td className="p-3">{statusLabel[m.status] ?? m.status}</td>
                        <td className="p-3">{m.user_id ? "Oui" : "Non"}</td>
                      </tr>
                    ))}
                    {!list.length && <tr><td colSpan={5} className="p-3 text-muted-foreground">Aucun membre.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

function AddMember({ onDone }: { onDone: () => void }) {
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim().toLowerCase();
    await supabase.from("members").insert({
      first_name: String(f.get("first_name")).trim(), last_name: String(f.get("last_name")).trim().toUpperCase(),
      email: email || null, country: String(f.get("country")), city: String(f.get("city")).trim(), status: "founder", founder: f.get("founder") === "on",
    });
    onDone();
  };
  return (
    <form onSubmit={submit} className="mb-6 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
      <Field label="Prénom"><input name="first_name" className={inputClass} /></Field>
      <Field label="Nom"><input name="last_name" required className={inputClass} /></Field>
      <Field label="Email (pour relier son futur compte)"><input name="email" type="email" className={inputClass} /></Field>
      <Field label="Pays"><select name="country" className={inputClass}><option value="FR">France</option><option value="CD">Congo (RDC)</option></select></Field>
      <Field label="Ville"><input name="city" className={inputClass} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="founder" className="size-4 accent-primary" /> Membre fondateur</label>
      <Button type="submit" className="sm:col-span-3">Enregistrer la fiche</Button>
    </form>
  );
}

function MemberSheet({ member: initial, back }: { member: Member; back: () => void }) {
  const [member, setMember] = useState(initial);
  const files = useQuery({ queryKey: ["admin-files", member.id], queryFn: async () => ((await supabase.from("member_files").select("*").eq("member_id", member.id).order("year", { ascending: false })).data ?? []) as MemberFile[] });
  const pays = useQuery({ queryKey: ["admin-pays", member.id], queryFn: async () => ((await supabase.from("payments").select("*").eq("member_id", member.id).order("paid_at", { ascending: false })).data ?? []) as Payment[] });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const patch = {
      first_name: String(f.get("first_name")).trim(), last_name: String(f.get("last_name")).trim(),
      email: String(f.get("email")).trim().toLowerCase() || null, phone: String(f.get("phone")).trim(), city: String(f.get("city")).trim(),
      country: String(f.get("country")), category: String(f.get("category")), status: String(f.get("status")),
      member_number: Number(f.get("member_number")) || member.member_number,
    };
    const { data, error } = await supabase.from("members").update(patch).eq("id", member.id).select().single();
    if (error) { setErr(error.code === "23505" ? "Ce numéro (ou cet email) est déjà utilisé par un autre membre. Libérez-le d'abord." : "Enregistrement impossible."); return; }
    setErr("");
    if (data) { setMember(data as Member); setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };
  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("file") as File | null;
    if (!file || !file.size) return;
    setBusy(true);
    const path = `${member.id}/${safeFileName(file.name)}`;
    const up = await supabase.storage.from("member-files").upload(path, file, { contentType: file.type || "application/octet-stream" });
    if (!up.error) await supabase.from("member_files").insert({ member_id: member.id, title: String(f.get("title")).trim() || file.name, category: String(f.get("category")), year: Number(f.get("year")), file_path: path });
    setBusy(false);
    form.reset();
    files.refetch();
  };
  const removeFile = async (file: { id: string; file_path: string }) => {
    await supabase.storage.from("member-files").remove([file.file_path]);
    await supabase.from("member_files").delete().eq("id", file.id);
    files.refetch();
  };
  return (
    <>
      <Button variant="ghost" onClick={back} className="mb-4"><ArrowLeft />Retour à la liste</Button>
      <H>{fullName(member)}</H>
      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-6">
          <MemberCard member={member} />
          <form onSubmit={save} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
            <Field label="Numéro de membre"><input name="member_number" type="number" min={1} defaultValue={member.member_number} className={inputClass} /></Field>
            <Field label="Prénom"><input name="first_name" defaultValue={member.first_name} className={inputClass} /></Field>
            <Field label="Nom"><input name="last_name" defaultValue={member.last_name} className={inputClass} /></Field>
            <Field label="Email"><input name="email" type="email" defaultValue={member.email ?? ""} className={inputClass} /></Field>
            <Field label="Téléphone"><input name="phone" defaultValue={member.phone} className={inputClass} /></Field>
            <Field label="Ville"><input name="city" defaultValue={member.city} className={inputClass} /></Field>
            <Field label="Pays"><select name="country" defaultValue={member.country} className={inputClass}><option value="FR">France</option><option value="CD">Congo (RDC)</option></select></Field>
            <Field label="Catégorie"><select name="category" defaultValue={member.category} className={inputClass}><option value="effectif">Effectif</option><option value="sympathisant">Sympathisant</option></select></Field>
            <Field label="Statut"><select name="status" defaultValue={member.status} className={inputClass}><option value="pending">En attente</option><option value="validated">Validé</option><option value="refused">Refusé</option><option value="founder">Fondateur · à compléter</option></select></Field>
            <p className="text-xs text-muted-foreground sm:col-span-2">Compte relié : {member.user_id ? "oui" : "non"} · Consentement documents : {member.documents_consent_at ? `oui, le ${fmt(member.documents_consent_at)}` : "pas encore"}</p>
            {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
            <Button type="submit" className="sm:col-span-2">{saved ? "Enregistré ✓" : "Enregistrer"}</Button>
          </form>
          <section><h3 className="mb-2 font-semibold text-primary">Cotisations</h3><PaymentsList payments={pays.data ?? []} /></section>
        </div>
        <div className="space-y-6">
          <section><h3 className="mb-2 font-semibold text-primary">Documents du membre</h3><FileList files={files.data ?? []} empty="Aucun document." onDelete={removeFile} /></section>
          <form onSubmit={upload} className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2">
            <h3 className="flex items-center gap-2 font-semibold text-primary sm:col-span-2"><Upload className="size-4" />Ajouter un document</h3>
            <p className="rounded-md bg-gold/10 p-2 text-xs sm:col-span-2">Pour une pièce d'identité, gardez l'accord écrit du membre (un message WhatsApp suffit).</p>
            <div className="sm:col-span-2"><Field label="Titre"><input name="title" required maxLength={150} className={inputClass} /></Field></div>
            <Field label="Type"><select name="category" className={inputClass}><option value="identity">Pièce d'identité (carte d'électeur…)</option><option value="card">Carte de membre</option><option value="document">Autre document</option></select></Field>
            <Field label="Année"><input name="year" type="number" defaultValue={new Date().getFullYear()} className={inputClass} /></Field>
            <div className="sm:col-span-2"><Field label="Fichier (PDF ou photo)"><input name="file" type="file" required accept=".pdf,image/*" className={inputClass} /></Field></div>
            <Button type="submit" disabled={busy} className="sm:col-span-2">{busy ? "Envoi…" : "Ajouter"}</Button>
          </form>
        </div>
      </div>
    </>
  );
}

function PaymentsTab() {
  const qc = useQueryClient();
  const pays = useTable<Payment>("payments");
  const members = useTable<Member>("members");
  const name = (id: string) => { const m = (members.data ?? []).find((x) => x.id === id); return m ? fullName(m) : "—"; };
  const setStatus = async (id: string, status: string) => { await supabase.from("payments").update({ status }).eq("id", id); qc.invalidateQueries({ queryKey: ["admin"] }); };
  return (
    <>
      <H>Cotisations et paiements</H>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Date</th><th className="p-3">Membre</th><th className="p-3">Type</th><th className="p-3">Montant</th><th className="p-3">Moyen / réf.</th><th className="p-3">Statut</th></tr></thead>
          <tbody>
            {(pays.data ?? []).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{fmt(p.paid_at)}</td><td className="p-3">{name(p.member_id)}</td>
                <td className="p-3">{p.kind === "adhesion" ? "Adhésion" : "Mensualité"}</td>
                <td className="p-3 font-semibold">{Number(p.amount).toFixed(2)} {p.currency}</td>
                <td className="p-3">{p.method} {p.reference && `· ${p.reference}`}</td>
                <td className="p-3">{p.status === "pending" ? (
                  <span className="flex gap-2"><Button size="sm" onClick={() => setStatus(p.id, "validated")}>Confirmer</Button><Button size="sm" variant="outline" onClick={() => setStatus(p.id, "refused")}>Refuser</Button></span>
                ) : p.status === "validated" ? "Confirmé" : "Refusé"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!pays.data?.length && <p className="p-4 text-muted-foreground">Aucun paiement déclaré.</p>}
      </div>
    </>
  );
}

function Handled({ table, id, handled }: { table: string; id: string; handled: boolean }) {
  const qc = useQueryClient();
  return (
    <label className="flex items-center gap-2 text-xs">
      <input type="checkbox" checked={handled} className="size-4 accent-primary" onChange={async (e) => { await supabase.from(table).update({ handled: e.target.checked }).eq("id", id); qc.invalidateQueries({ queryKey: ["admin", table] }); }} />
      Traité
    </label>
  );
}

type Pledge = { id: string; name: string; email: string; amount: number; method: string; destination: string; handled: boolean; created_at: string };
function DonsTab() {
  const dons = useTable<Pledge>("donation_pledges");
  const [dest, setDest] = useState("");
  const list = (dons.data ?? []).filter((d) => !dest || d.destination === dest);
  const total = (id: string) => (dons.data ?? []).filter((d) => d.destination === id).reduce((s, d) => s + Number(d.amount), 0);
  return (
    <>
      <H>Promesses de don</H>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DONATIONS.map((d) => <div key={d.id} className="rounded-xl border bg-card p-4"><p className="text-sm text-muted-foreground">{d.fr}</p><p className="font-display text-2xl text-primary">{total(d.id).toFixed(2)}</p></div>)}
      </div>
      <select value={dest} onChange={(e) => setDest(e.target.value)} className={`${inputClass} mb-4 max-w-xs`}>
        <option value="">Toutes les destinations</option>
        {DONATIONS.map((d) => <option key={d.id} value={d.id}>{d.fr}</option>)}
      </select>
      <ul className="space-y-2">
        {list.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3 text-sm">
            <span className="flex-1"><strong>{d.name}</strong> · {d.email} · {fmt(d.created_at)}</span>
            <span>{DONATIONS.find((x) => x.id === d.destination)?.fr}</span>
            <span className="font-semibold">{Number(d.amount).toFixed(2)} · {d.method}</span>
            <Handled table="donation_pledges" id={d.id} handled={d.handled} />
          </li>
        ))}
        {!list.length && <p className="text-muted-foreground">Aucune promesse de don.</p>}
      </ul>
    </>
  );
}

type Msg = { id: string; name: string; email: string; country: string; subject: string; message: string; handled: boolean; created_at: string };
function MessagesTab() {
  const msgs = useTable<Msg>("contact_messages");
  return (
    <>
      <H>Messages</H>
      <ul className="space-y-3">
        {(msgs.data ?? []).map((m) => (
          <li key={m.id} className={`rounded-xl border p-4 ${m.handled ? "bg-muted/40" : "bg-card"}`}>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <strong>{m.name}</strong><a href={`mailto:${m.email}`} className="text-primary underline">{m.email}</a>
              <span className="text-muted-foreground">· {m.country} · {m.subject} · {fmt(m.created_at)}</span>
              <span className="ml-auto"><Handled table="contact_messages" id={m.id} handled={m.handled} /></span>
            </div>
            <p className="mt-2 whitespace-pre-line">{m.message}</p>
          </li>
        ))}
        {!msgs.data?.length && <p className="text-muted-foreground">Aucun message.</p>}
      </ul>
    </>
  );
}

type Vol = { id: string; kind: string; name: string; email: string; phone: string; country: string; city: string; activities: string[]; availability: string; structure_type: string; proposal: string; message: string; handled: boolean; created_at: string };
function VolunteersTab() {
  const vols = useTable<Vol>("volunteer_requests");
  const kindLabel: Record<string, string> = { benevole: "Bénévole", partenaire: "Partenaire", materiel: "Donateur de matériel" };
  return (
    <>
      <H>Bénévoles et partenaires</H>
      <ul className="space-y-3">
        {(vols.data ?? []).map((v) => (
          <li key={v.id} className={`rounded-xl border p-4 text-sm ${v.handled ? "bg-muted/40" : "bg-card"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{kindLabel[v.kind] ?? v.kind}</span>
              <strong>{v.name}</strong><a href={`mailto:${v.email}`} className="text-primary underline">{v.email}</a>
              {v.phone && <span>· {v.phone}</span>}
              <span className="text-muted-foreground">· {v.city} ({v.country}) · {fmt(v.created_at)}</span>
              <span className="ml-auto"><Handled table="volunteer_requests" id={v.id} handled={v.handled} /></span>
            </div>
            {v.activities?.length > 0 && <p className="mt-2">Activités : {v.activities.join(", ")} · {v.availability}</p>}
            {v.structure_type && <p className="mt-2">Structure : {v.structure_type} — {v.proposal}</p>}
            {v.message && <p className="mt-2 whitespace-pre-line">{v.message}</p>}
          </li>
        ))}
        {!vols.data?.length && <p className="text-muted-foreground">Aucune demande.</p>}
      </ul>
    </>
  );
}

type Doc = { id: string; folder: string; title: string; file_path: string; created_at: string };
function DocsTab() {
  const docs = useTable<Doc>("association_documents");
  const [folder, setFolder] = useState<string>(ASSOCIATION_FOLDERS[0]);
  const [busy, setBusy] = useState(false);
  const upload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const file = f.get("file") as File | null;
    if (!file || !file.size) return;
    setBusy(true);
    const path = `${ASSOCIATION_FOLDERS.indexOf(folder as never)}/${safeFileName(file.name)}`;
    const up = await supabase.storage.from("association").upload(path, file, { contentType: file.type || "application/octet-stream" });
    if (!up.error) await supabase.from("association_documents").insert({ folder, title: String(f.get("title")).trim() || file.name, file_path: path });
    setBusy(false);
    form.reset();
    docs.refetch();
  };
  const remove = async (d: { id: string; file_path: string }) => {
    await supabase.storage.from("association").remove([d.file_path]);
    await supabase.from("association_documents").delete().eq("id", d.id);
    docs.refetch();
  };
  return (
    <>
      <H>Documents de l'association</H>
      <div className="mb-4 flex flex-wrap gap-2">
        {ASSOCIATION_FOLDERS.map((f) => (
          <button key={f} onClick={() => setFolder(f)} className={`rounded-full border px-3 py-1.5 text-sm ${folder === f ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
            {f} ({(docs.data ?? []).filter((d) => d.folder === f).length})
          </button>
        ))}
      </div>
      <FileList bucket="association" files={(docs.data ?? []).filter((d) => d.folder === folder)} empty="Ce dossier est vide." onDelete={remove} />
      <form onSubmit={upload} className="mt-6 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label={`Ajouter dans « ${folder} » — titre`}><input name="title" required maxLength={200} className={inputClass} /></Field>
        <Field label="Fichier"><input name="file" type="file" required className={inputClass} /></Field>
        <Button type="submit" disabled={busy}>{busy ? "Envoi…" : "Ajouter"}</Button>
      </form>
    </>
  );
}

const SETTINGS: { key: string; label: string; help?: string }[] = [
  { key: "bank_holder", label: "Titulaire du compte" },
  { key: "bank_name", label: "Banque" },
  { key: "bank_iban", label: "IBAN" },
  { key: "bank_bic", label: "BIC" },
  { key: "paypal_url", label: "Lien PayPal", help: "Commence par https:// — le bouton PayPal reste caché tant que c'est vide." },
  { key: "mobile_holder", label: "Mobile money — bénéficiaire" },
  { key: "mpesa_number", label: "M-Pesa" },
  { key: "orange_number", label: "Orange Money" },
  { key: "airtel_number", label: "Airtel Money" },
  { key: "contact_phone", label: "Téléphone affiché" },
  { key: "whatsapp_number", label: "Numéro WhatsApp (format international sans +, ex. 33758452275)" },
  { key: "contact_email", label: "Email de contact" },
  { key: "fee_fr_join", label: "France — droit d'adhésion (€)" },
  { key: "fee_fr_monthly", label: "France — mensualité (€)" },
  { key: "fee_cd_join", label: "Congo (RDC) — droit d'adhésion" },
  { key: "fee_cd_monthly", label: "Congo (RDC) — mensualité" },
  { key: "fee_cd_currency", label: "Congo (RDC) — devise (USD ou CDF)" },
];
function SettingsTab() {
  const qc = useQueryClient();
  const rows = useQuery({ queryKey: ["admin", "settings"], queryFn: async () => Object.fromEntries(((await supabase.from("site_settings").select("key,value")).data ?? []).map((r: { key: string; value: string }) => [r.key, r.value])) as Record<string, string> });
  const [saved, setSaved] = useState(false);
  if (!rows.data) return <p>Chargement…</p>;
  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = SETTINGS.map((s) => ({ key: s.key, value: String(f.get(s.key) ?? "").trim(), updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_settings").upsert(payload);
    if (!error) { setSaved(true); qc.invalidateQueries(); setTimeout(() => setSaved(false), 2500); }
  };
  return (
    <>
      <H>Réglages du site</H>
      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        {SETTINGS.map((s) => (
          <Field key={s.key} label={s.label}>
            <input name={s.key} defaultValue={rows.data?.[s.key] ?? ""} className={inputClass} />
            {s.help && <span className="text-xs font-normal text-muted-foreground">{s.help}</span>}
          </Field>
        ))}
        <Button type="submit" className="sm:col-span-2">{saved ? "Enregistré ✓" : "Enregistrer les réglages"}</Button>
      </form>
    </>
  );
}
