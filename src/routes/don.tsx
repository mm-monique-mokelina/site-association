import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Scissors, Sprout, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";
import { useText, DONATIONS } from "@/lib/labels";
import { pledgeSchema } from "@/lib/submission-schemas";
import { sendPledge } from "@/lib/submissions";
import { PageHero, Lines } from "@/components/site/RichText";
import { BankInfo, MobileInfo, PaypalButton } from "@/components/site/PaymentInfo";
import { Field, inputClass, Feedback } from "@/components/forms/Fields";

export const Route = createFileRoute("/don")({
  head: () => seo("Faire un don", "Soutenez les enfants et les jeunes, les filles-mères et les femmes maraîchères en RDC."),
  component: Don,
});

type Dest = (typeof DONATIONS)[number]["id"];

function Don() {
  const x = useText();
  const [dest, setDest] = useState<Dest>("general");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");
  const current = DONATIONS.find((d) => d.id === dest) ?? DONATIONS[3];
  const usage = [
    { icon: BookOpen, t: x("Des fournitures et des kits pour l'école", "School supplies and kits", "Biloko mpe bisaleli ya kelasi") },
    { icon: Scissors, t: x("Des formations aux métiers pour les filles-mères", "Vocational training for young mothers", "Mateya ya misala mpo na bamama ya bilenge") },
    { icon: Sprout, t: x("Des semences et des outils pour les maraîchères", "Seeds and tools for market gardeners", "Mboto mpe bisaleli mpo na basi baloni ndunda") },
    { icon: Trophy, t: x("Des activités pour les jeunes", "Activities for young people", "Misala mpo na bilenge") },
  ];
  const pledge = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await sendPledge({ data: pledgeSchema.parse({ name: f.get("name"), email: f.get("email"), amount: f.get("amount"), method: f.get("method"), destination: dest }) });
      setState("ok");
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHero title={x("Faire un don", "Donate", "Kopesa likabo")} intro={x("Chaque don, même modeste, aide directement les enfants et les jeunes, les filles-mères et les femmes maraîchères que nous accompagnons.", "Every gift, however small, directly helps the children, young people, young mothers and women market gardeners we support.", "Likabo nyonso, ata moke, esalisaka mbala moko bana, bilenge, bamama ya bilenge mpe basi baloni ndunda.")} />
      <div className="container-page grid gap-10 py-10 lg:grid-cols-2">
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-primary">{x("À quoi servent vos dons ?", "What are your gifts used for?", "Makabo na bino esalaka nini?")}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {usage.map((u) => (
                <li key={u.t} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                  <u.icon className="mt-0.5 size-5 shrink-0 text-gold" /><span>{u.t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-muted-foreground">{x("Chaque don est suivi et présenté aux membres lors de l'assemblée générale.", "Every gift is tracked and presented to members at the general assembly.", "Likabo nyonso elandamaka mpe emonisamaka na bato ya lisangani na likita monene.")}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-primary">{x("Dons en matériel", "Donations in kind", "Makabo ya biloko")}</h2>
            <Lines className="mt-4" text={[
              x("Fournitures scolaires, livres, jeux", "School supplies, books, games", "Biloko ya kelasi, mikanda, masano"),
              x("Vêtements de bébé et kits d'hygiène", "Baby clothes and hygiene kits", "Bilamba ya bana mike mpe biloko ya bopeto"),
              x("Machines à coudre, tissus et fil", "Sewing machines, fabric and thread", "Masini ya kotonga, bilamba mpe nsinga"),
              x("Outils de jardinage et semences", "Gardening tools and seeds", "Bisaleli ya bilanga mpe mboto"),
              x("Ordinateurs portables et matériel de sport", "Laptops and sports equipment", "Ba ordinateur mpe biloko ya masano"),
            ].join("\n")} />
            <p className="mt-4">{x("Écrivez-nous avant d'apporter un don, pour qu'on organise la collecte.", "Write to us before bringing a donation so we can organise the collection.", "Bokomela biso liboso ya komema likabo, mpo tobongisa kosangisa.")}</p>
            <Button asChild variant="outline" className="mt-4"><Link to="/benevole" search={{ kind: "materiel" }}>{x("Proposer un don en matériel", "Offer a donation in kind", "Kopesa likabo ya biloko")}</Link></Button>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-5">
            <h2 className="text-2xl font-semibold text-primary">{x("Je choisis à quoi sert mon don", "I choose what my gift is for", "Naponi likabo na ngai mpo na nini")}</h2>
            <fieldset className="mt-4 grid gap-2">
              <legend className="sr-only">{x("Destination du don", "Gift destination", "Esika ya likabo")}</legend>
              {DONATIONS.map((d) => (
                <label key={d.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${dest === d.id ? "border-primary bg-primary/5" : ""}`}>
                  <input type="radio" name="dest" value={d.id} checked={dest === d.id} onChange={() => setDest(d.id)} className="size-4 accent-primary" />
                  {x(d.fr, d.en, d.ln)}
                </label>
              ))}
            </fieldset>
            <p className="mt-3 text-sm">{x("Référence à indiquer dans le libellé du virement :", "Reference to write on your transfer:", "Liloba ya kokoma na kotinda:")} <strong className="font-mono">{current.reference}</strong></p>
          </section>
          <BankInfo reference={current.reference} />
          <MobileInfo />
          <PaypalButton />
          <section className="rounded-2xl border p-5">
            <h3 className="text-lg font-semibold text-primary">{x("Je fais une promesse de don", "I make a pledge", "Nalaki likabo")}</h3>
            {state === "ok" ? <Feedback success /> : (
              <form onSubmit={pledge} className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label={x("Nom", "Name", "Nkombo")}><input name="name" required maxLength={150} className={inputClass} /></Field>
                <Field label="Email"><input name="email" type="email" required maxLength={255} className={inputClass} /></Field>
                <Field label={x("Montant prévu", "Planned amount", "Motango")}><input name="amount" type="number" min="1" step="0.01" required className={inputClass} /></Field>
                <Field label={x("Moyen", "Method", "Lolenge")}>
                  <select name="method" className={inputClass}><option>Virement</option><option>PayPal</option><option>Mobile money</option></select>
                </Field>
                <p className="text-sm text-muted-foreground sm:col-span-2">{x("Destination :", "Destination:", "Esika:")} {x(current.fr, current.en, current.ln)}</p>
                <Feedback error={state === "error"} />
                <Button type="submit" disabled={busy} className="sm:col-span-2">{busy ? "…" : x("Envoyer", "Send", "Kotinda")}</Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
