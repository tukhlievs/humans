"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";

export default function ProfilePage() {
  const { user, isAdmin, t } = useApp();
  const name = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : t("profile.guest");

  return (
    <div>
      <PageHeader title={t("profile.title")} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-border bg-card shadow-card"
      >
        {/* Avatar section */}
        <div className="flex flex-col items-center pb-6 pt-8 text-center">
          <Avatar name={name} src={user?.photoUrl} size={96} />
          <h2 className="mt-4 text-xl font-bold">{name}</h2>
          {user?.username && (
            <p className="mt-1 text-sm text-muted-foreground">@{user.username}</p>
          )}
          {isAdmin && (
            <div className="mt-3 flex items-center gap-1.5">
              <Badge variant="primary" className="gap-1">
                <ShieldCheck size={11} />
                {t("profile.admin")}
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Note */}
        <div className="px-5 py-4">
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {user ? t("profile.fromTelegram") : t("profile.notInTelegram")}
          </p>
          {user && (
            <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              {t("profile.future")}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
