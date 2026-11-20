import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { contactSchema, volunteerSchema, pledgeSchema } from "./submission-schemas";

export async function sendContact({ data }: { data: z.infer<typeof contactSchema> }) {
  const { consent: _c, ...v } = data;
  const { error } = await supabase.from("contact_messages").insert({ ...v, consent_at: new Date().toISOString() });
  if (error) throw new Error("Envoi impossible");
  return { ok: true };
}
export async function sendVolunteer({ data }: { data: z.infer<typeof volunteerSchema> }) {
  const { consent: _c, ...v } = data;
  const { error } = await supabase.from("volunteer_requests").insert({ ...v, consent_at: new Date().toISOString() });
  if (error) throw new Error("Envoi impossible");
  return { ok: true };
}
export async function sendPledge({ data }: { data: z.infer<typeof pledgeSchema> }) {
  const { error } = await supabase.from("donation_pledges").insert(data);
  if (error) throw new Error("Envoi impossible");
  return { ok: true };
}
