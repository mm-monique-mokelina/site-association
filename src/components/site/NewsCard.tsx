import { Link } from "@tanstack/react-router";
import { fmtDate } from "@/lib/news";
import { Marked } from "./RichText";

export function NewsCard({ n }: { n: { id: string; title: string; excerpt: string; image_url: string; published_at: string } }) {
  return (
    <Link to="/actualites/$id" params={{ id: n.id }} className="group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-0.5">
      {n.image_url ? (
        <img src={n.image_url} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div className="kente-band" />
      )}
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{fmtDate(n.published_at)}</p>
        <h3 className="mt-1 text-lg font-semibold text-primary group-hover:underline">{n.title}</h3>
        {n.excerpt && <p className="mt-1 line-clamp-3 text-sm text-muted-foreground"><Marked text={n.excerpt} /></p>}
      </div>
    </Link>
  );
}
