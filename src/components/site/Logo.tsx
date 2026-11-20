import { useSiteData } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Logo({ size = 48, className }: { size?: number; className?: string }) {
  const { s } = useSiteData();
  const url = s("logo_url");
  if (url)
    return (
      <img src={url} alt="Logo M.M Monique Mokelina" width={size} height={size}
        className={cn("rounded-full object-cover", className)} style={{ width: size, height: size }} />
    );
  return (
    <span
      aria-label="Logo M.M Monique Mokelina"
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-gold ring-2 ring-gold", className)}
      style={{ width: size, height: size, fontSize: size * 0.32, boxShadow: "inset 0 0 0 3px var(--primary), inset 0 0 0 5px var(--gold)" }}
    >
      M.M
    </span>
  );
}
