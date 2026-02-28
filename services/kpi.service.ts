import { LogEntry } from "@/types/domain";

export function buildKpi(entries: LogEntry[]) {
  const totalDowntime = entries.reduce((sum, e) => sum + e.downtime_minutes, 0);
  const byMachine = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.machine_id] = (acc[e.machine_id] ?? 0) + e.downtime_minutes;
    return acc;
  }, {});
  const mttr = entries.length ? totalDowntime / entries.length : 0;
  const mtbf = entries.length ? (entries.length * 24 * 60) / Math.max(1, totalDowntime) : 0;
  return { totalDowntime, byMachine, mttr, mtbf, entryCount: entries.length };
}
