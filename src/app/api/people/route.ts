import { NextResponse } from "next/server";
import { verifyInitData } from "@/lib/telegram-auth";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { mapPerson, type PersonRow } from "@/lib/mappers";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !isSupabaseServerConfigured()) {
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    initData?: string;
    name?: string;
    goal?: string;
    interests?: unknown;
  };

  const verified = verifyInitData(body.initData ?? "", botToken);
  if (!verified) {
    return NextResponse.json({ error: "invalid initData" }, { status: 401 });
  }

  const name = String(body.name ?? "").trim();
  const goal = String(body.goal ?? "").trim();
  if (!name || !goal) {
    return NextResponse.json({ error: "name and goal are required" }, { status: 400 });
  }

  const interests = Array.isArray(body.interests)
    ? body.interests.map((s) => String(s).trim()).filter(Boolean).slice(0, 12)
    : [];

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("people")
    .insert({
      telegram_id: verified.user.id,
      name: name.slice(0, 60),
      username: verified.user.username ?? null,
      goal: goal.slice(0, 200),
      interests,
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "insert failed" }, { status: 500 });
  }
  return NextResponse.json({ person: mapPerson(data as PersonRow) });
}
