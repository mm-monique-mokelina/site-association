import { supabase } from "@/integrations/supabase/client";

export const publicNewsQuery = (limit?: number) => ({
  queryKey: ["news-public", limit ?? "all"],
  queryFn: async () => {
    let q = supabase.from("news").select("id,title,excerpt,image_url,published_at")
      .eq("published", true).eq("is_public", true).order("published_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    return data ?? [];
  },
});

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
