import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Member = {
  id: string; user_id: string | null; member_number: number; email: string | null;
  first_name: string; last_name: string; phone: string; country: "FR" | "CD"; city: string;
  category: string; pole: string; status: "pending" | "validated" | "refused" | "founder";
  founder: boolean; photo_path: string | null; documents_consent_at: string | null; validated_at: string | null; created_at: string;
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, loading };
}

export function useMe() {
  const { session, loading } = useSession();
  const uid = session?.user.id;
  const q = useQuery({
    queryKey: ["me", uid],
    enabled: !!uid,
    queryFn: async () => {
      const [m, r] = await Promise.all([
        supabase.from("members").select("*").eq("user_id", uid ?? "").maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid ?? ""),
      ]);
      const roles = (r.data ?? []).map((x: { role: string }) => x.role);
      return { member: (m.data as Member | null) ?? null, isAdmin: roles.includes("admin") };
    },
  });
  return {
    session,
    uid,
    loading: loading || (!!uid && q.isLoading),
    member: q.data?.member ?? null,
    profile: q.data?.member ?? null,
    isAdmin: q.data?.isAdmin ?? false,
    refetch: q.refetch,
  };
}

/** Lien de téléchargement temporaire (5 minutes) pour un fichier privé. */
export async function openPrivateFile(bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
  if (error || !data) throw error ?? new Error("Fichier indisponible");
  window.open(data.signedUrl, "_blank", "noopener");
}

export function safeFileName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

export const MONTH_FMT = (d: string | Date, lang = "fr") =>
  new Date(d).toLocaleDateString(lang === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric" });

export function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

/** Months from validation month up to current month (inclusive). */
export function monthsSince(start: string | null, now = new Date()): string[] {
  if (!start) return [];
  const s = new Date(start);
  const cur = new Date(s.getFullYear(), s.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const out: string[] = [];
  while (cur <= end) {
    out.push(monthKey(cur));
    cur.setMonth(cur.getMonth() + 1);
  }
  return out;
}

/** Status of a month for the dues table. */
export function monthStatus(
  month: string,
  payments: { month: string; status: string; kind: string }[],
  now = new Date(),
): "paid" | "pending" | "late" | "due" {
  const ps = payments.filter((p) => p.kind === "mensualite" && p.month.slice(0, 7) === month.slice(0, 7));
  if (ps.some((p) => p.status === "validated")) return "paid";
  if (ps.some((p) => p.status === "pending")) return "pending";
  return month < monthKey(now) ? "late" : "due";
}

export async function uploadMedia(file: File): Promise<string> {
  const blob = await compressImage(file);
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const up = await supabase.storage.from("media").upload(path, blob, { contentType: "image/webp" });
  if (up.error) throw up.error;
  const signed = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signed.error) throw signed.error;
  return signed.data.signedUrl;
}

/** Resize to max 1200px and convert to WebP for light pages. */
export async function compressImage(file: File, max = 1200, quality = 0.78): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image indisponible");
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return await new Promise((res, reject) => canvas.toBlob((b) => b ? res(b) : reject(new Error("Image indisponible")), "image/webp", quality));
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0] ?? {});
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(";"), ...rows.map((r) => cols.map((c) => esc(r[c])).join(";"))].join("\n");
}

export function downloadFile(name: string, content: string | Blob, type = "text/csv;charset=utf-8") {
  const blob = typeof content === "string" ? new Blob(["\ufeff" + content], { type }) : content;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
