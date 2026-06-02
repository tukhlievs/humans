import type { Channel, CategorySlug, Person, RegionTag } from "@/types";

export interface ChannelRow {
  id: string;
  username: string;
  title: string;
  category: string;
  niche: string | null;
  description: string | null;
  subscribers: number | string | null;
  tags: string[] | null;
  verified: boolean | null;
  avatar_url: string | null;
}

export interface PersonRow {
  id: string;
  name: string;
  username: string | null;
  goal: string;
  interests: string[] | null;
}

export function mapChannel(row: ChannelRow): Channel {
  return {
    id: row.id,
    username: row.username,
    title: row.title,
    category: row.category as CategorySlug,
    niche: row.niche ?? "",
    description: row.description ?? "",
    subscribers: Number(row.subscribers ?? 0),
    tags: (row.tags ?? []) as RegionTag[],
    verified: Boolean(row.verified),
    avatarUrl: row.avatar_url ?? undefined,
  };
}

export function mapPerson(row: PersonRow): Person {
  return {
    id: row.id,
    name: row.name,
    username: row.username ?? undefined,
    goal: row.goal,
    interests: row.interests ?? [],
  };
}
