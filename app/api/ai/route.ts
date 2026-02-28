import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, context } = (await req.json()) as { prompt: string; context: unknown };
  const apiKey = process.env.AI_API_KEY;
  const endpoint = process.env.AI_API_ENDPOINT;

  if (!apiKey || !endpoint) {
    return NextResponse.json({ error: "AI config missing" }, { status: 500 });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are MaintLog AI. Return strict JSON with keys: analysis (string), commands (string array), destructive (boolean)."
        },
        {
          role: "user",
          content: JSON.stringify({ prompt, context })
        }
      ]
    })
  });

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  const parsed = typeof content === "string" ? JSON.parse(content) : content;
  return NextResponse.json(parsed);
}
