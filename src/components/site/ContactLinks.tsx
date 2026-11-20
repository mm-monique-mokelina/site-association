import { Mail, MessageCircle, Phone } from "lucide-react";
import { useSiteData } from "@/lib/content";
import { useText } from "@/lib/labels";

export function ContactLinks({ dark = false }: { dark?: boolean }) {
  const x = useText();
  const { s } = useSiteData();
  const phone = s("contact_phone") || "07 58 45 22 75";
  const wa = (s("whatsapp_number") || "33758452275").replace(/\D/g, "");
  const email = s("contact_email") || "m.mokelina@hotmail.com";
  const tel = "+" + wa;
  const link = dark ? "text-primary-foreground/85 hover:text-gold" : "hover:text-primary";
  return (
    <div className="space-y-3">
      <a className={`flex items-center gap-2 ${link}`} href={`tel:${tel}`}><Phone className="size-4" />{phone}</a>
      <a className={`flex items-center gap-2 break-all ${link}`} href={`mailto:${email}`}><Mail className="size-4" />{email}</a>
      <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1ebe5a]">
        <MessageCircle className="size-4" />{x("Écrire sur WhatsApp", "Write on WhatsApp", "Kokoma na WhatsApp")}
      </a>
    </div>
  );
}
