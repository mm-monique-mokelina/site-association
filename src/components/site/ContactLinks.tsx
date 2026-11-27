import { Mail, MessageCircle } from "lucide-react";
import { useSiteData } from "@/lib/content";
import { useText } from "@/lib/labels";
import { Flag } from "./Flags";

export function ContactLinks({ dark = false }: { dark?: boolean }) {
  const x = useText();
  const { s } = useSiteData();
  const phoneFr = s("contact_phone") || "07 58 45 22 75";
  const waFr = (s("whatsapp_number") || "33758452275").replace(/\D/g, "");
  const phoneCd = s("contact_phone_cd") || "+243 890 704 411";
  const waCd = (s("whatsapp_number_cd") || "243890704411").replace(/\D/g, "");
  const email = s("contact_email") || "m.mokelina@hotmail.com";
  const link = dark ? "text-primary-foreground/85 hover:text-gold" : "hover:text-primary";
  const lines = [
    { c: "FR" as const, label: "France", phone: phoneFr, wa: waFr },
    { c: "CD" as const, label: "Congo (RDC)", phone: phoneCd, wa: waCd },
  ];
  return (
    <div className="space-y-3">
      {lines.map((l) => (
        <div key={l.c} className="space-y-1.5">
          <a className={`flex items-center gap-2 ${link}`} href={`tel:+${l.wa}`}>
            <Flag country={l.c} className="h-3.5 w-5 shrink-0 rounded-[2px]" />
            <span><span className="opacity-75">{l.label} :</span> {l.phone}</span>
          </a>
          <a href={`https://wa.me/${l.wa}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#1ebe5a]">
            <MessageCircle className="size-4" />{x("WhatsApp", "WhatsApp", "WhatsApp")} {l.label}
          </a>
        </div>
      ))}
      <a className={`flex items-center gap-2 break-all ${link}`} href={`mailto:${email}`}><Mail className="size-4" />{email}</a>
    </div>
  );
}
