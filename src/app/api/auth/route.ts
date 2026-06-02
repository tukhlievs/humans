import { NextResponse } from "next/server";
import { verifyInitData } from "@/lib/telegram-auth";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !isSupabaseServerConfigured()) {
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as { initData?: string };
  const verified = await verifyInitData(body.initData ?? "", botToken);
  if (!verified) {
    return NextResponse.json({ error: "invalid initData" }, { status: 401 });
  }

  const adminUsername = (process.env.ADMIN_USERNAME ?? "imnotsheikh").toLowerCase();
  const isAdmin = (verified.user.username ?? "").toLowerCase() === adminUsername;

  const { user } = verified;
  const supabase = getSupabaseAdmin();
  await supabase.from("users").upsert(
    {
      telegram_id: user.id,
      first_name: user.firstName,
      last_name: user.lastName ?? null,
      username: user.username ?? null,
      photo_url: user.photoUrl ?? null,
      is_admin: isAdmin,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "telegram_id" },
  );

  return NextResponse.json({ user, isAdmin });
}
