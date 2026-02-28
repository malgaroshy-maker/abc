"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { runAiCommand } from "@/services/ai.service";

export function AiAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string>("");
  const [pendingAction, setPendingAction] = useState<string[] | null>(null);

  const execute = async () => {
    const result = await runAiCommand({ prompt, context: { module: "logbook" } });
    setResponse(result.analysis);
    if (result.destructive) {
      setPendingAction(result.commands);
      return;
    }
    setPendingAction(null);
  };

  return (
    <div className="w-full max-w-2xl space-y-2 rounded-lg border bg-white p-3 dark:bg-slate-900">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="w-full rounded border px-3 py-2"
          placeholder='e.g. "Which machine had most downtime last month?"'
        />
        <Button onClick={execute}>Ask AI</Button>
      </div>
      {response && <p className="text-sm">{response}</p>}
      {pendingAction && (
        <div className="rounded border border-red-500 p-2 text-sm">
          <p className="mb-2 font-semibold">Destructive operation detected. Confirm before execute:</p>
          <ul className="list-disc pl-6">
            {pendingAction.map((command) => (
              <li key={command}>{command}</li>
            ))}
          </ul>
          <Button className="mt-2 bg-red-600" onClick={() => setPendingAction(null)}>
            Confirm and Execute
          </Button>
        </div>
      )}
    </div>
  );
}
