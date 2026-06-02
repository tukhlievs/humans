/**
 * Verifies Telegram Mini App initData using the Web Crypto API.
 * No Node.js imports — runs natively on Cloudflare Workers, Edge, and browsers.
 */

import type { TelegramUser } from "@/types";

export interface VerifiedInitData {
  user: TelegramUser;
  authDate: number;
}

const enc = new TextEncoder();

/**
 * HMAC-SHA256 helper.
 *
 * Note on the casts: TypeScript 5.7+ made `Uint8Array` generic over its backing
 * buffer (`Uint8Array<ArrayBufferLike>`), and Web Crypto's `BufferSource` now
 * only accepts `ArrayBuffer`-backed views. A plain `Uint8Array` is valid at
 * runtime, so we assert the type at the call boundary to stay compatible across
 * TypeScript versions and runtimes (Workers / Edge / browser).
 */
async function hmacSha256(key: Uint8Array, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    enc.encode(message) as unknown as BufferSource,
  );
  return new Uint8Array(sig);
}

/** Constant-time byte comparison — avoids timing attacks. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g);
  if (!pairs) return new Uint8Array(0);
  return new Uint8Array(pairs.map((b) => parseInt(b, 16)));
}

/**
 * Verifies Telegram initData per the official HMAC-SHA256 algorithm.
 * Returns the verified user + authDate, or null if invalid / expired.
 */
export async function verifyInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86_400,
): Promise<VerifiedInitData | null> {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = await hmacSha256(enc.encode("WebAppData"), botToken);
  const computed = await hmacSha256(secretKey, dataCheckString);

  if (!timingSafeEqual(computed, hexToBytes(hash))) return null;

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
