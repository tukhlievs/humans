/**
 * Best-effort parsing of public channel metadata via the Telegram Bot API.
 * Works for public channels; gracefully returns partial data on failure so the
 * admin can always fill the rest in manually.
 */

const api = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

export interface ParsedChannel {
  title?: string;
  description?: string;
  subscribers?: number;
  photoFileId?: string;
}

export async function parseChannel(
  username: string,
  botToken: string,
): Promise<ParsedChannel | null> {
  const chatId = `@${username}`;
  const res = await fetch(`${api(botToken, "getChat")}?chat_id=${encodeURIComponent(chatId)}`);
  const json = (await res.json()) as { ok: boolean; result?: Record<string, unknown> };
  if (!json.ok || !json.result) return null;

  const chat = json.result;
  const photo = chat.photo as { big_file_id?: string } | undefined;
  const parsed: ParsedChannel = {
    title: typeof chat.title === "string" ? chat.title : undefined,
    description: typeof chat.description === "string" ? chat.description : undefined,
    photoFileId: photo?.big_file_id,
  };

  try {
    const countRes = await fetch(
      `${api(botToken, "getChatMemberCount")}?chat_id=${encodeURIComponent(chatId)}`,
    );
    const countJson = (await countRes.json()) as { ok: boolean; result?: number };
    if (countJson.ok && typeof countJson.result === "number") {
      parsed.subscribers = countJson.result;
    }
  } catch {
    /* count is optional */
  }

  return parsed;
}

export async function fetchPhotoBytes(
  fileId: string,
  botToken: string,
): Promise<{ bytes: ArrayBuffer; ext: string } | null> {
  const res = await fetch(`${api(botToken, "getFile")}?file_id=${encodeURIComponent(fileId)}`);
  const json = (await res.json()) as { ok: boolean; result?: { file_path?: string } };
  if (!json.ok || !json.result?.file_path) return null;

  const filePath = json.result.file_path;
  const download = await fetch(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
  if (!download.ok) return null;

  const bytes = await download.arrayBuffer();
  const ext = filePath.split(".").pop()?.toLowerCase() || "jpg";
  return { bytes, ext };
}
