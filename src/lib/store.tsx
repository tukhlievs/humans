"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedPeople } from "@/lib/data";
import { translate, type Lang } from "@/lib/i18n";
import { getTelegramUser, initTelegram } from "@/lib/telegram";
import type { Person, TelegramUser } from "@/types";

interface AppState {
  people: Person[];
  addPerson: (input: Omit<Person, "id">) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  user: TelegramUser | null;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>(seedPeople);
  const [lang, setLang] = useState<Lang>("ru");
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    initTelegram();
    setUser(getTelegramUser());
  }, []);

  const addPerson = useCallback((input: Omit<Person, "id">) => {
    setPeople((prev) => [
      { ...input, id: `p-${Date.now()}` },
      ...prev,
    ]);
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo<AppState>(
    () => ({ people, addPerson, lang, setLang, t, user }),
    [people, addPerson, lang, t, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/** Convenience selector for translation only. */
export function useT(): (key: string) => string {
  return useApp().t;
}
