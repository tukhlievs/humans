import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { channels as mockChannels, seedPeople } from "@/lib/data";
import { mapChannel, mapPerson, type ChannelRow, type PersonRow } from "@/lib/mappers";
import type { Channel, Person, TelegramUser } from "@/types";

export { isSupabaseConfigured };

export interface PersonInput {
  name: string;
  goal: string;
  interests: string[];
}

export async function fetchChannels(): Promise<Channel[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return mockChannels;
  const { data, error } = await sb
    .from("channels")
    .select("*")
    .order("subscribers", { ascending: false });
  if (error || !data) return mockChannels;
  return (data as ChannelRow[]).map(mapChannel);
}

export async function fetchChannelsByCategory(slug: string): Promise<Channel[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return mockChannels.filter((c) => c.category === slug);
  const { data, error } = await sb
    .from("channels")
    .select("*")
    .eq("category", slug)
    .order("subscribers", { ascending: false });
  if (error || !data) return [];
  return (data as ChannelRow[]).map(mapChannel);
}

export async function fetchChannel(id: string): Promise<Channel | null> {
  const sb = getSupabaseBrowser();
  if (!sb) return mockChannels.find((c) => c.id === id) ?? null;
  const { data, error } = await sb.from("channels").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapChannel(data as ChannelRow);
}

export async function fetchPeople(): Promise<Person[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return seedPeople;
  const { data, error } = await sb
    .from("people")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return seedPeople;
  return (data as PersonRow[]).map(mapPerson);
}

/**
 * Create a person profile. With Supabase configured this posts to the server
 * route (which verifies initData); otherwise it returns a local, unpersisted
 * record so the demo still works.
 */
export async function createPerson(
  initData: string,
  input: PersonInput,
): Promise<Person | null> {
  if (!isSupabaseConfigured) {
    return { id: `local-${Date.now()}`, ...input };
  }
  const res = await fetch("/api/people", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData, ...input }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { person: Person };
  return json.person;
}

export interface ChannelInput {
  username: string;
  category: string;
  niche?: string;
  tags: string[];
  verified?: boolean;
  title?: string;
  description?: string;
  subscribers?: number;
}

export async function createChannel(
  initData: string,
  input: ChannelInput,
): Promise<{ channel?: Channel; error?: string }> {
  const res = await fetch("/api/channels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData, ...input }),
  });
  const json = (await res.json().catch(() => ({}))) as { channel?: Channel; error?: string };
  if (!res.ok) return { error: json.error ?? `Ошибка ${res.status}` };
  return { channel: json.channel };
}

export async function authenticate(
  initData: string,
): Promise<{ user: TelegramUser; isAdmin: boolean } | null> {
  if (!isSupabaseConfigured || !initData) return null;
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });
  if (!res.ok) return null;
  return (await res.json()) as { user: TelegramUser; isAdmin: boolean };
}
