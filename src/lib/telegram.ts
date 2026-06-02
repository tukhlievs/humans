import type { TelegramUser } from "@/types";

/**
 * Minimal, dependency-free wrapper around the Telegram Mini Apps runtime.
 * The runtime is injected by telegram-web-app.js (loaded in the root layout)
 * and exposed as window.Telegram.WebApp. All access is guarded so the code
 * also renders correctly in a normal browser during local development.
 */

interface TgWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TgWebApp {
  initData: string;
  initDataUnsafe?: { user?: TgWebAppUser };
  colorScheme?: "light" | "dark";
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy") => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

export function getWebApp(): TgWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

/** Initialise the viewport and chrome. Safe to call once on mount. */
export function initTelegram(): void {
  const wa = getWebApp();
  if (!wa) return;
  try {
    wa.ready();
    wa.expand();
    wa.setHeaderColor?.("#0a0b0d");
    wa.setBackgroundColor?.("#0a0b0d");
  } catch {
    /* noop — non-Telegram environment */
  }
}

/** Raw initData string — sent to the server for signature verification. */
export function getInitData(): string {
  return getWebApp()?.initData ?? "";
}

export function getTelegramUser(): TelegramUser | null {
  const user = getWebApp()?.initDataUnsafe?.user;
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    photoUrl: user.photo_url,
  };
}

export function haptic(style: "light" | "medium" | "heavy" = "light"): void {
  getWebApp()?.HapticFeedback?.impactOccurred(style);
}
