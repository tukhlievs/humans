import { NextResponse } from "next/server";
import { verifyInitData } from "@/lib/telegram-auth";
import { getSupabaseAdmin, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { parseChannel, fetchPhotoBytes } from "@/lib/telegram-parse";
import { mapChannel, type ChannelRow } from "@/lib/mappers";

const VALID_CATEGORIES = ["crypto", "news", "pro", "blog"];

export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !isSupabaseServerConfigured()) {
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    initData?: string;
    username?: string;
    category?: string;
    niche?: string;
    tags?: unknown;
    verified?: boolean;
    title?: string;
    description?: string;
    subscribers?: number;
  };

  const verified = await verifyInitData(body.initData ?? "", botToken);
  if (!verified) {
    return NextResponse.json({ error: "invalid initData" }, { status: 401 });
  }

  const adminUsername = (process.env.ADMIN_USERNAME ?? "imnotsheikh").toLowerCase();
  if ((verified.user.username ?? "").toLowerCase() !== adminUsername) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const username = String(body.username ?? "").replace(/^@/, "").trim();
  const category = String(body.category ?? "");
  if (!username || !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "username and a valid category are required" },
      { status: 400 },
    );
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => t === "CIS" || t === "GLOBAL")
    : [];

  const supabase = getSupabaseAdmin();

  const parsed = await parseChannel(username, botToken).catch(() => null);

  let avatarUrl: string | null = null;
  if (parsed?.photoFileId) {
    const photo = await fetchPhotoBytes(parsed.photoFileId, botToken).catch(() => null);
    if (photo) {
      const path = `${username}.${photo.ext}`;
      const contentType = photo.ext === "jpg" ? "image/jpeg" : `image/${photo.ext}`;
      const upload = await supabase.storage
        .from("avatars")
        .upload(path, Buffer.from(photo.bytes), { contentType, upsert: true });
      if (!upload.error) {
        avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }
    }
  }

  const row = {
    username,
    title: String(body.title ?? parsed?.title ?? username),
    category,
    niche: String(body.niche ?? ""),
    description: String(body.description ?? parsed?.description ?? ""),
    subscribers: Number(body.subscribers ?? parsed?.subscribers ?? 0),
    tags,
    verified: Boolean(body.verified ?? false),
    avatar_url: avatarUrl,
    created_by: verified.user.id,
  };

  const { data, error } = await supabase
    .from("channels")
    .upsert(row, { onConflict: "username" })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "insert failed" }, { status: 500 });
  }
  return NextResponse.json({ channel: mapChannel(data as ChannelRow) });
}
