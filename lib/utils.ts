export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function shiftColor(shift: "night" | "morning" | "evening") {
  if (shift === "night") return "bg-shift-night text-white";
  if (shift === "morning") return "bg-shift-morning text-black";
  return "bg-shift-evening text-white";
}

export function computeDowntime(intervals: Array<{ start: string; end: string }>) {
  return intervals.reduce((sum, current) => {
    const start = new Date(`1970-01-01T${current.start}:00`);
    const end = new Date(`1970-01-01T${current.end}:00`);
    return sum + Math.max(0, (end.getTime() - start.getTime()) / 60000);
  }, 0);
}
