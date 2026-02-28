import { supabase } from "@/lib/supabase";
import { LogEntry } from "@/types/domain";

export async function fetchLogEntries(sectionId: string) {
  const { data, error } = await supabase
    .from("log_entries")
    .select("*")
    .eq("section_id", sectionId)
    .is("deleted_at", null)
    .order("date", { ascending: false });
  if (error) throw error;
  return data as LogEntry[];
}

export async function upsertLogEntry(entry: Partial<LogEntry>) {
  const { data, error } = await supabase.from("log_entries").upsert(entry).select().single();
  if (error) throw error;
  return data as LogEntry;
}

export async function softDeleteLogEntry(id: string) {
  const { error } = await supabase.from("log_entries").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}
