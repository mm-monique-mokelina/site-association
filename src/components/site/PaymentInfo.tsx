import { Landmark, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/lib/content";
import { useText } from "@/lib/labels";
import { Flag } from "./Flags";

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}

export function BankInfo({ reference }: { reference?: string }) {
  const { s } = useSiteData();
  const x = useText();
  const filled = s("bank_iban").trim() !== "";
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="flex items-center gap-2 font-semibold text-primary"><Landmark className="size-5" /> {x("Virement bancaire", "Bank transfer", "Kotinda na banque")} <Flag country="FR" className="h-4 w-6 rounded-[2px]" /></h3>
      {filled ? (
        <div className="mt-3">
          <Row label={x("Titulaire", "Account holder", "Nkolo ya compte")} value={s("bank_holder")} />
          <Row label={x("Banque", "Bank", "Banque")} value={s("bank_name")} />
          <Row label="IBAN" value={s("bank_iban")} />
          <Row label="BIC" value={s("bank_bic")} />
          {reference && <Row label={x("Libellé à indiquer", "Reference to write", "Liloba ya kokoma")} value={reference} />}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{x("Coordonnées bancaires bientôt disponibles.", "Bank details coming soon.", "Makambo ya banque ekoya noki.")}</p>
      )}
    </div>
  );
}

export function MobileInfo() {
  const { s } = useSiteData();
  const x = useText();
  const nums = [["M-Pesa", s("mpesa_number")], ["Orange Money", s("orange_number")], ["Airtel Money", s("airtel_number")]].filter(([, v]) => v);
  if (!nums.length) return null;
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="flex items-center gap-2 font-semibold text-primary"><Smartphone className="size-5" /> Mobile money · Congo (RDC) <Flag country="CD" className="h-4 w-6 rounded-[2px]" /></h3>
      <div className="mt-3">
        {s("mobile_holder") && <Row label={x("Bénéficiaire", "Beneficiary", "Mozwi")} value={s("mobile_holder")} />}
        {nums.map(([k, v]) => <Row key={k} label={k ?? ""} value={v ?? ""} />)}
      </div>
    </div>
  );
}

export function PaypalButton() {
  const { s } = useSiteData();
  const x = useText();
  const url = s("paypal_url").trim();
  if (!/^https:\/\//.test(url)) return null;
  return (
    <Button asChild size="lg" className="w-full bg-[#0070ba] text-white hover:bg-[#005ea6]">
      <a href={url} target="_blank" rel="noopener noreferrer">{x("Donner avec PayPal", "Give with PayPal", "Kopesa na PayPal")}</a>
    </Button>
  );
}
