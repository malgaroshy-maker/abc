"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PMItem {
  id: string;
  machine: string;
  yearly_frequency: number;
  last_completed: string;
}

export function PreventiveFeature() {
  const [items, setItems] = useState<PMItem[]>([]);

  return (
    <div className="space-y-3 rounded-lg border bg-white p-4 dark:bg-slate-900">
      <Button
        onClick={() =>
          setItems((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              machine: `Machine-${prev.length + 1}`,
              yearly_frequency: 4,
              last_completed: new Date().toISOString().slice(0, 10)
            }
          ])
        }
      >
        Add PM Item
      </Button>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Machine</th>
            <th className="text-left">Yearly Frequency</th>
            <th className="text-left">Last Completed</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.machine}</td>
              <td>{item.yearly_frequency}</td>
              <td>{item.last_completed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
