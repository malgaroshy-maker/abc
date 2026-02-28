"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TodoItem } from "@/types/domain";

const seed: TodoItem[] = [];

export function TodoFeature() {
  const [items, setItems] = useState<TodoItem[]>(seed);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TodoItem["priority"]>("medium");

  const add = () => {
    if (!title.trim()) return;
    setItems((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        priority,
        completed: false,
        section_id: "local-section",
        created_by: "local-user"
      },
      ...prev
    ]);
    setTitle("");
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 dark:bg-slate-900">
      <div className="flex flex-wrap gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded border px-3 py-2" placeholder="Task title" />
        <select value={priority} onChange={(e) => setPriority(e.target.value as TodoItem["priority"])} className="rounded border px-3 py-2">
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <Button onClick={add}>Add</Button>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 rounded border p-2">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, completed: !i.completed } : i)))}
            />
            <span className="flex-1">{item.title}</span>
            <span className="text-xs uppercase">{item.priority}</span>
            <Button className="bg-red-600" onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
