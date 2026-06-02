"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { getInitData, haptic } from "@/lib/telegram";
import { createChannel } from "@/lib/api";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CategorySlug, RegionTag } from "@/types";

const REGION_TAGS: RegionTag[] = ["CIS", "GLOBAL"];

export default function AdminPage() {
  const { isAdmin, t } = useApp();
  const [username, setUsername]   = useState("");
  const [category, setCategory]   = useState<CategorySlug | "">("");
  const [niche, setNiche]         = useState("");
  const [tags, setTags]           = useState<RegionTag[]>([]);
  const [verified, setVerified]   = useState(false);
  const [pending, setPending]     = useState(false);
  const [status, setStatus]       = useState<{ ok: boolean; text: string } | null>(null);

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title={t("admin.title")} back />
        <p className="mt-16 text-center text-sm text-muted-foreground">
          {t("admin.denied")}
        </p>
      </div>
    );
  }

  const toggleTag = (tag: RegionTag) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
    );

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
      setUsername(""); setNiche(""); setTags([]); setVerified(false);
    } else {
      setStatus({ ok: false, text: error ?? t("form.error") });
    }
  };

  return (
    <div>
      <PageHeader title={t("admin.title")} subtitle={t("admin.subtitle")} back />

      <div className="rounded-2xl border border-border bg-card shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {/* Username */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t("admin.username")}
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("admin.usernamePh")}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t("admin.category")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "h-11 rounded-xl text-sm font-semibold transition-all duration-150",
                    category === c.slug
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "border border-border bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t("admin.niche")}
            </label>
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder={t("admin.nichePh")}
            />
          </div>

          <Separator />

          {/* Tags + verified */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              {t("admin.tags")}
            </label>
            <div className="flex flex-wrap gap-2">
              {REGION_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "h-9 rounded-xl px-4 text-sm font-semibold transition-all duration-150",
                    tags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tag}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setVerified((v) => !v)}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition-all duration-150",
                  verified
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {verified && <Check size={14} />}
                {t("admin.verified")}
              </button>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("admin.hint")}
          </p>

          {status && (
            <p
              className={cn(
                "text-sm font-medium",
                status.ok ? "text-primary" : "text-destructive",
              )}
            >
              {status.text}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!username.trim() || !category || pending}
          >
            {pending ? t("admin.adding") : t("admin.submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
