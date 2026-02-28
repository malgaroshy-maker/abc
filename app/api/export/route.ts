import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { path } = (await req.json()) as { path: string };
  const { data, error } = await supabase.storage.from("logos").createSignedUrl(path, 60);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
