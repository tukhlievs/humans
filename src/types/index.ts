export type CategorySlug = "crypto" | "news" | "pro" | "blog";

export type RegionTag = "CIS" | "GLOBAL";

export interface Category {
  slug: CategorySlug;
  title: string;
  subtitle: string;
}

export interface Channel {
  id: string;
  username: string; // without leading @
  title: string;
  category: CategorySlug;
  niche: string;
  description: string;
  subscribers: number;
  tags: RegionTag[];
  verified?: boolean;
  avatarUrl?: string;
}

export interface Person {
  id: string;
  name: string;
  username?: string;
  goal: string;
  interests: string[];
}

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}
