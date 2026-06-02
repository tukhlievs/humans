"use client";

import { AtSign, Send } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";

const langs: { code: Lang; label: string }[] = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export default function SettingsPage() {
  const { lang, setLang, t } = useApp();

  return (
    <div className="animate-fade-in space-y-5">
      <PageHeader title={t("settings.title")} />

      <section>
        <p className="mb-2 px-1 text-xs uppercase tracking-wider text-muted">
          {t("settings.language")}
        </p>
        <Card className="p-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            {langs.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={cn(
                  "h-10 rounded-xl text-sm font-medium transition-colors",
                  lang === code
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <p className="mb-2 px-1 text-xs uppercase tracking-wider text-muted">
          {t("settings.contacts")}
        </p>
        <Card className="divide-y divide-border">
          <a
            href="https://t.me/imnotsheikh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 transition-colors hover:bg-surface-2/50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <AtSign size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t("settings.developer")}</p>
              <p className="text-sm text-muted">@imnotsheikh</p>
            </div>
          </a>
          <a
            href="https://t.me/skenvco"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 transition-colors hover:bg-surface-2/50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Send size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t("settings.channel")}</p>
              <p className="text-sm text-muted">@skenvco</p>
            </div>
          </a>
        </Card>
      </section>

      <section>
        <p className="mb-2 px-1 text-xs uppercase tracking-wider text-muted">
          {t("settings.about")}
        </p>
        <Card className="p-4">
          <p className="text-sm leading-relaxed text-muted">{t("settings.aboutText")}</p>
          <p className="mt-3 text-xs text-muted">Humans · v0.1.0</p>
        </Card>
      </section>
    </div>
  );
}
