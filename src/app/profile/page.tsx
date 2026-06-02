"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/lib/store";

export default function ProfilePage() {
  const { user, isAdmin, t } = useApp();
  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : t("profile.guest");

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("profile.title")} />

      <Card className="p-6 text-center">
        <div className="flex flex-col items-center">
          <Avatar name={name} src={user?.photoUrl} size={96} />
          <h2 className="mt-4 text-xl font-semibold">{name}</h2>
          {user?.username ? <p className="text-sm text-muted">@{user.username}</p> : null}
          {isAdmin ? (
            <Badge tone="accent" className="mt-3">
              {t("profile.admin")}
            </Badge>
          ) : null}
        </div>

        <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted">
          {user ? t("profile.fromTelegram") : t("profile.notInTelegram")}
        </p>
        {user ? <p className="mt-2 text-xs leading-relaxed text-muted">{t("profile.future")}</p> : null}
      </Card>
    </div>
  );
}
