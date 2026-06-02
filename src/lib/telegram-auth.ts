import crypto from "crypto";
import type { TelegramUser } from "@/types";

export interface VerifiedInitData {
  user: TelegramUser;
  authDate: number;
}

/**
 * Verifies Telegram Mini App initData per the official algorithm:
 *   secret = HMAC_SHA256("WebAppData", bot_token)
 *   hash   = HMAC_SHA256(secret, data_check_string)
 * where data_check_string is "key=value" pairs (all params except `hash`),
 * sorted by key and joined with "\n". Also rejects stale payloads.
 *
 * Runs in the Node.js runtime only (uses `crypto`). Returns null if invalid.
 */
export function verifyInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86_400,
): VerifiedInitData | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get("auth_date") ?? "0");
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSeconds) return null;

  const rawUser = params.get("user");
  if (!rawUser) return null;

  try {
    const u = JSON.parse(rawUser) as {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
    return {
      user: {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        username: u.username,
        photoUrl: u.photo_url,
      },
      authDate,
    };
  } catch {
    return null;
  }
}
