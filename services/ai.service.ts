export interface AiRequest {
  prompt: string;
  context: Record<string, unknown>;
}

export async function runAiCommand(payload: AiRequest) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error("AI command failed");
  }
  return (await response.json()) as { analysis: string; commands: string[]; destructive: boolean };
}
