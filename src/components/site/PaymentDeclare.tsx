import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useText } from "@/lib/labels";
import { Field, inputClass } from "@/components/forms/Fields";

/** Formulaire « J'ai payé » : le membre déclare un paiement, l'administration le confirme. */
export function PaymentDeclare({ memberId, defaultKind = "adhesion", country = "FR", onDone }: {
  memberId: string; defaultKind?: "adhesion" | "mensualite"; country?: string; onDone?: () => void;
}) {
  const x = useText();
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "ok" | "error">("idle");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.from("payments").insert({
      member_id: memberId,
      kind: String(f.get("kind")),
      method: String(f.get("method")),
      paid_at: String(f.get("paid_at")),
      amount: Number(f.get("amount")),
      currency: String(f.get("currency")),
      reference: String(f.get("reference") ?? "").slice(0, 120),
    });
    setBusy(false);
    setState(error ? "error" : "ok");
    if (!error) onDone?.();
  };
  if (state === "ok")
    return <p role="status" className="rounded-md border border-success bg-success/10 p-4">{x("Merci ! Votre paiement est déclaré. Il sera confirmé par l'association.", "Thank you! Your payment has been declared and will be confirmed by the association.", "Matondi! Lifuti na bino eyebisami. Lisangani ekondima yango.")}</p>;
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label={x("Type", "Type", "Lolenge")}>
        <select name="kind" defaultValue={defaultKind} className={inputClass}>
          <option value="adhesion">{x("Droit d'adhésion", "Membership fee", "Mbongo ya kokota")}</option>
          <option value="mensualite">{x("Mensualité", "Monthly fee", "Mbongo ya sanza")}</option>
        </select>
      </Field>
      <Field label={x("Moyen de paiement", "Payment method", "Lolenge ya kofuta")}>
        <select name="method" className={inputClass}>
          <option>Virement</option><option>Mobile money</option><option>PayPal</option><option>Espèces</option>
        </select>
      </Field>
      <Field label={x("Date du paiement", "Payment date", "Mokolo ya kofuta")}>
        <input name="paid_at" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputClass} />
      </Field>
      <div className="grid grid-cols-[2fr_1fr] gap-2">
        <Field label={x("Montant", "Amount", "Motango")}>
          <input name="amount" type="number" min="0" step="0.01" required className={inputClass} />
        </Field>
        <Field label={x("Devise", "Currency", "Mbongo")}>
          <select name="currency" defaultValue={country === "CD" ? "USD" : "EUR"} className={inputClass}>
            <option>EUR</option><option>USD</option><option>CDF</option>
          </select>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label={x("Référence (facultatif)", "Reference (optional)", "Référence (soki olingi)")}>
          <input name="reference" maxLength={120} className={inputClass} />
        </Field>
      </div>
      {state === "error" && <p role="alert" className="text-destructive sm:col-span-2">{x("Envoi impossible. Réessayez.", "Could not send. Try again.", "Ekoki kotindama te. Meka lisusu.")}</p>}
      <Button type="submit" disabled={busy} className="sm:col-span-2">{busy ? "…" : x("J'ai payé", "I have paid", "Nafuti")}</Button>
    </form>
  );
}
