"use client";

import Link from "next/link";
import { AtSign, Send, ShieldCheck, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export default function SettingsPage() {
  const { lang, setLang, t, isAdmin } = useApp();

  return (
    <div>
      <PageHeader title={t("settings.title")} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        {/* Admin shortcut */}
        {isAdmin && (
          <Section label={t("settings.admin")}>
            <LinkRow
              href="/admin"
              icon={<ShieldCheck size={18} className="text-primary" />}
              iconBg="bg-primary/10"
              label={t("settings.admin")}
              sub={t("admin.subtitle")}
            />
          </Section>
        )}

        {/* Language */}
        <Section label={t("settings.language")}>
          <div className="flex gap-2 p-4">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl h-11 text-sm font-semibold transition-all duration-150",
                  lang === code
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {lang === code && <Check size={14} />}
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Contacts */}
        <Section label={t("settings.contacts")}>
          <LinkRow
            href="https://t.me/imnotsheikh"
            external
            icon={<AtSign size={18} className="text-primary" />}
            iconBg="bg-primary/10"
            label={t("settings.developer")}
            sub="@imnotsheikh"
          />
          <Separator />
          <LinkRow
            href="https://t.me/skenvco"
            external
            icon={<Send size={18} className="text-primary" />}
            iconBg="bg-primary/10"
            label={t("settings.channel")}
            sub="@skenvco"
          />
        </Section>

        {/* About */}
        <Section label={t("settings.about")}>
          <div className="px-5 py-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("settings.aboutText")}
            </p>
            <p className="mt-3 text-xs text-muted-foreground/60">
              Humans · v0.1.0
            </p>
          </div>
        </Section>
      </motion.div>
    </div>
  );
}

/* ── helpers ── */

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {children}
      </div>
    </div>
  );
}

function LinkRow({
  href,
  external,
  icon,
  iconBg,
  label,
  sub,
}: {
  href: string;
  external?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sub?: string;
}) {
  const inner = (
    <div className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-secondary/40">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          iconBg,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sub && (
          <p className="truncate text-xs text-muted-foreground">{sub}</p>
        )}
      </div>
      <ChevronRight size={16} className="shrink-0 text-muted-foreground/40" />
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}
