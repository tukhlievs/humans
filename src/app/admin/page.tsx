"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { getInitData, haptic } from "@/lib/telegram";
import { createChannel } from "@/lib/api";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CategorySlug, RegionTag } from "@/types";

const REGION_TAGS: RegionTag[] = ["CIS", "GLOBAL"];

export default function AdminPage() {
  const { isAdmin, t } = useApp();

  const [username, setUsername] = useState("");
  const [category, setCategory] = useState<CategorySlug | "">("");
  const [niche, setNiche] = useState("");
  const [tags, setTags] = useState<RegionTag[]>([]);
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  if (!isAdmin) {
    return (
      <div className="animate-fade-in">
        <PageHeader title={t("admin.title")} back />
        <p className="mt-12 text-center text-sm text-muted">{t("admin.denied")}</p>
      </div>
    );
  }

  const toggleTag = (tag: RegionTag) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !category || pending) return;

    setPending(true);
    setStatus(null);
    const { channel, error } = await createChannel(getInitData(), {
      username: username.trim(),
      category,
      niche: niche.trim(),
      tags,
      verified,
    });
    setPending(false);

    if (channel) {
      haptic("medium");
      setStatus({ ok: true, text: `${t("admin.success")}: ${channel.title}` });
      setUsername("");
      setNiche("");
      setTags([]);
      setVerified(false);
    } else {
      setStatus({ ok: false, text: error ?? t("form.error") });
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("admin.title")} subtitle={t("admin.subtitle")} back />

      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-muted">{t("admin.username")}</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("admin.usernamePh")}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted">{t("admin.category")}</label>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "h-11 rounded-xl px-2 text-sm font-medium transition-colors",
                    category === c.slug
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-surface-2 text-muted hover:text-foreground",
                  )}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted">{t("admin.niche")}</label>
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder={t("admin.nichePh")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted">{t("admin.tags")}</label>
            <div className="flex gap-1.5">
              {REGION_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "h-9 rounded-lg px-3 text-sm font-medium transition-colors",
                    tags.includes(tag)
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-surface-2 text-muted hover:text-foreground",
                  )}
                >
                  {tag}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setVerified((v) => !v)}
                className={cn(
                  "ml-auto flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
                  verified
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-surface-2 text-muted hover:text-foreground",
                )}
              >
                {verified ? <Check size={15} /> : null}
                {t("admin.verified")}
              </button>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted">{t("admin.hint")}</p>

          {status ? (
            <p className={cn("text-sm", status.ok ? "text-accent" : "text-red-400")}>
              {status.text}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!username.trim() || !category || pending}
          >
            {pending ? t("admin.adding") : t("admin.submit")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
