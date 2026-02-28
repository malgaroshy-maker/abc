"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { logEntrySchema, LogEntryInput } from "@/lib/validation";
import { computeDowntime } from "@/lib/utils";
import { useLogbookStore } from "@/store/use-logbook-store";
import { Button } from "@/components/ui/button";

export function LogEntryForm() {
  const applyChange = useLogbookStore((s) => s.applyChange);
  const entries = useLogbookStore((s) => s.entries);

  const { register, handleSubmit, reset } = useForm<LogEntryInput>({
    resolver: zodResolver(logEntrySchema),
    defaultValues: {
      shift: "morning",
      line_ids: [],
      engineer_ids: [],
      stoppages: [{ start_time: "08:00", end_time: "08:15" }],
      notes: "",
      work_description: ""
    }
  });

  const onSubmit = (value: LogEntryInput) => {
    const downtime_minutes = computeDowntime(value.stoppages.map((s) => ({ start: s.start_time, end: s.end_time })));
    applyChange([
      {
        id: crypto.randomUUID(),
        factory_id: "local-factory",
        section_id: "local-section",
        date: value.date,
        shift: value.shift,
        machine_id: value.machine_id,
        line_ids: value.line_ids,
        engineer_ids: value.engineer_ids,
        start_time: value.stoppages[0]?.start_time ?? "00:00",
        end_time: value.stoppages[value.stoppages.length - 1]?.end_time ?? "00:00",
        downtime_minutes,
        work_description: value.work_description,
        notes: value.notes,
        created_by: "local-user",
        deleted_at: null,
        updated_at: new Date().toISOString()
      },
      ...entries
    ]);
    reset();
  };

  return (
    <form className="grid gap-2 rounded-lg border bg-white p-3 dark:bg-slate-900 md:grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
      <input className="rounded border px-2 py-1" type="date" {...register("date")} />
      <select className="rounded border px-2 py-1" {...register("shift")}>
        <option value="night">Night</option>
        <option value="morning">Morning</option>
        <option value="evening">Evening</option>
      </select>
      <input className="rounded border px-2 py-1" placeholder="Machine UUID" {...register("machine_id")} />
      <input
        className="rounded border px-2 py-1 md:col-span-2"
        placeholder="Work description"
        {...register("work_description")}
      />
      <input className="rounded border px-2 py-1 md:col-span-2" placeholder="Notes" {...register("notes")} />
      <Button type="submit">Create Entry</Button>
    </form>
  );
}
