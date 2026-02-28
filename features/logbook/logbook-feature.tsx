"use client";

import { useMemo, useRef } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useLogbookStore } from "@/store/use-logbook-store";
import { LogEntry } from "@/types/domain";
import { shiftColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { exportCsv, exportPdf } from "@/services/export.service";
import { LogEntryForm } from "@/features/logbook/log-entry-form";

export function LogbookFeature() {
  const entries = useLogbookStore((s) => s.entries);
  const applyChange = useLogbookStore((s) => s.applyChange);
  const undo = useLogbookStore((s) => s.undo);
  const redo = useLogbookStore((s) => s.redo);
  const syncStatus = useLogbookStore((s) => s.syncStatus);
  const tableRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<LogEntry>[]>(
    () => [
      { accessorKey: "date", header: "Date" },
      {
        accessorKey: "shift",
        header: "Shift",
        cell: ({ row }) => <span className={`rounded px-2 py-1 text-xs ${shiftColor(row.original.shift)}`}>{row.original.shift}</span>
      },
      { accessorKey: "machine_id", header: "Machine" },
      { accessorKey: "line_ids", header: "Lines", cell: ({ row }) => row.original.line_ids.join(", ") },
      { accessorKey: "engineer_ids", header: "Engineers", cell: ({ row }) => row.original.engineer_ids.join(", ") },
      { accessorKey: "downtime_minutes", header: "Downtime (m)" },
      { accessorKey: "notes", header: "Notes" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button className="bg-red-600 px-2 py-1 text-xs" onClick={() => applyChange(entries.map((e) => (e.id === row.original.id ? { ...e, deleted_at: new Date().toISOString() } : e)))}>
              Soft Delete
            </Button>
            <Button className="bg-emerald-700 px-2 py-1 text-xs" onClick={() => applyChange(entries.map((e) => (e.id === row.original.id ? { ...e, deleted_at: null } : e)))}>
              Restore
            </Button>
          </div>
        )
      }
    ],
    [applyChange, entries]
  );

  const table = useReactTable({ data: entries, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-4">
      <LogEntryForm />
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={undo}>Undo</Button>
        <Button onClick={redo}>Redo</Button>
        <Button onClick={() => exportCsv(entries, "maintlog.csv")}>CSV</Button>
        <Button onClick={() => tableRef.current && exportPdf(tableRef.current, "maintlog.pdf")}>PDF</Button>
        <span className="ml-auto rounded bg-slate-200 px-2 py-1 text-xs dark:bg-slate-700">Sync: {syncStatus}</span>
      </div>
      <div ref={tableRef} className="max-h-[60vh] overflow-auto rounded-lg border bg-white dark:bg-slate-900">
        <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 bg-slate-200 dark:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="border-b p-2 text-left" key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-slate-50 dark:even:bg-slate-800/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b p-2 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
