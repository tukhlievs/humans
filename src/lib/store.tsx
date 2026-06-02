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
import { translate, type Lang } from "@/lib/i18n";
import { getInitData, getTelegramUser, initTelegram } from "@/lib/telegram";
import { authenticate, createPerson, fetchPeople, type PersonInput } from "@/lib/api";
import type { Person, TelegramUser } from "@/types";

interface AppState {
  people: Person[];
  loadingPeople: boolean;
  addPerson: (input: PersonInput) => Promise<boolean>;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  user: TelegramUser | null;
  isAdmin: boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);
  const [lang, setLang] = useState<Lang>("ru");
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    initTelegram();
    // Instant (unverified) user for snappy UI; replaced by the server-verified
    // user once /api/auth responds.
    setUser(getTelegramUser());

    authenticate(getInitData()).then((res) => {
      if (res) {
        setUser(res.user);
        setIsAdmin(res.isAdmin);
      }
    });

    fetchPeople()
      .then(setPeople)
      .finally(() => setLoadingPeople(false));
  }, []);

  const addPerson = useCallback(async (input: PersonInput) => {
    const created = await createPerson(getInitData(), input);
    if (!created) return false;
    setPeople((prev) => [created, ...prev]);
    return true;
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo<AppState>(
    () => ({ people, loadingPeople, addPerson, lang, setLang, t, user, isAdmin }),
    [people, loadingPeople, addPerson, lang, t, user, isAdmin],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function useT(): (key: string) => string {
  return useApp().t;
}
