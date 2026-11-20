/** Drapeaux en SVG (RDC et France). */
export function Flag({ country, className }: { country: "FR" | "CD"; className?: string }) {
  if (country === "FR")
    return (
      <svg viewBox="0 0 3 2" className={className} role="img" aria-label="France">
        <rect width="1" height="2" fill="#002395" />
        <rect x="1" width="1" height="2" fill="#ffffff" />
        <rect x="2" width="1" height="2" fill="#ED2939" />
      </svg>
    );
  return (
    <svg viewBox="0 0 800 600" className={className} role="img" aria-label="Congo (RDC)">
      <rect width="800" height="600" fill="#007fff" />
      <path d="M0 450 L600 0 H800 V150 L200 600 H0 Z" fill="#f7d618" />
      <path d="M0 480 L640 0 H800 V120 L160 600 H0 Z" fill="#ce1021" />
      <path d="M136 60 l23 71 h75 l-61 44 23 71 -60 -44 -61 44 23 -71 -61 -44 h75 z" fill="#f7d618" />
    </svg>
  );
}

export function CountriesBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-3 py-1 text-xs uppercase tracking-widest text-gold">
      <Flag country="CD" className="h-3.5 w-5 rounded-[2px]" /> Congo (RDC) · France <Flag country="FR" className="h-3.5 w-5 rounded-[2px]" />
    </span>
  );
}
