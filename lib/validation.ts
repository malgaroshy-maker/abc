import { z } from "zod";

export const stoppageSchema = z.object({
  start_time: z.string().min(4),
  end_time: z.string().min(4)
});

export const logEntrySchema = z.object({
  date: z.string(),
  shift: z.enum(["night", "morning", "evening"]),
  machine_id: z.string().uuid(),
  line_ids: z.array(z.string().uuid()).min(1),
  engineer_ids: z.array(z.string().uuid()).min(1),
  work_description: z.string().min(3),
  notes: z.string().default(""),
  stoppages: z.array(stoppageSchema).min(1)
});

export type LogEntryInput = z.infer<typeof logEntrySchema>;
