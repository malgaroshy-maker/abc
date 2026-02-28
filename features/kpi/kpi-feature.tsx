"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { useLogbookStore } from "@/store/use-logbook-store";
import { buildKpi } from "@/services/kpi.service";

export function KpiFeature() {
  const entries = useLogbookStore((s) => s.entries);
  const kpi = buildKpi(entries);
  const machineData = Object.entries(kpi.byMachine).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
        <h2 className="mb-2 font-semibold">Summary</h2>
        <p>Total downtime: {kpi.totalDowntime} min</p>
        <p>Entries: {kpi.entryCount}</p>
        <p>MTTR: {kpi.mttr.toFixed(2)}</p>
        <p>MTBF: {kpi.mtbf.toFixed(2)}</p>
      </div>
      <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
        <h2 className="mb-2 font-semibold">Downtime per machine</h2>
        <BarChart width={500} height={250} data={machineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#10b981" />
        </BarChart>
      </div>
      <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
        <h2 className="mb-2 font-semibold">Machine share</h2>
        <PieChart width={500} height={250}>
          <Pie data={machineData} dataKey="value" nameKey="name" fill="#6366f1" />
          <Tooltip />
        </PieChart>
      </div>
      <div className="rounded-lg border bg-white p-4 dark:bg-slate-900">
        <h2 className="mb-2 font-semibold">Trend</h2>
        <LineChart width={500} height={250} data={entries.map((e) => ({ date: e.date, downtime: e.downtime_minutes }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="downtime" stroke="#f59e0b" />
        </LineChart>
      </div>
    </div>
  );
}
