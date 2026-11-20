import { Fragment } from "react";
import { cn } from "@/lib/utils";

const MARK = /(\[(?:À compléter|To be completed|Ekozala kotondisama)\])/g;

export function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(MARK).map((part, i) =>
        MARK.test(part) ? (
          <span key={i} className="todo-mark text-muted-foreground">{part}</span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const paras = text.split(/\n{2,}/);
  return (
    <div className={cn("space-y-3", className)}>
      {paras.map((p, i) => (
        <p key={i} className="whitespace-pre-line"><Marked text={p} /></p>
      ))}
    </div>
  );
}

export function Lines({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <ul className={cn("space-y-2", className)}>
      {lines.map((l, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 size-2 shrink-0 rounded-full bg-gold" />
          <span><Marked text={l} /></span>
        </li>
      ))}
    </ul>
  );
}

export function PageHero({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="bg-hero text-primary-foreground">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl font-semibold md:text-5xl">{title}</h1>
        {intro && <div className="mt-4 max-w-2xl text-primary-foreground/85 md:text-lg"><RichText text={intro} /></div>}
      </div>
      <div className="kente-band" />
    </section>
  );
}
