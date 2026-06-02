"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ExternalLink, Users, Tag } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Avatar";
import { Separator } from "@/components/ui/separator";
import { fetchChannel } from "@/lib/api";
import { formatCount } from "@/lib/utils";
import { useT } from "@/lib/store";
import { haptic } from "@/lib/telegram";
import type { Channel } from "@/types";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useT();
  const [channel, setChannel] = useState<Channel | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchChannel(id).then((data) => { if (active) setChannel(data); });
    return () => { active = false; };
  }, [id]);

  return (
    <div>
      <PageHeader title={t("app.name")} back />

      {channel === undefined ? (
        <div className="space-y-4">
          <Skeleton className="mx-auto h-24 w-24 rounded-2xl" />
          <Skeleton className="mx-auto h-6 w-40 rounded-xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : channel === null ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          {t("channel.notFound")}
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hero card */}
          <div className="rounded-2xl border border-border bg-card shadow-card">
            {/* Avatar + identity */}
            <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center">
              <Avatar
                name={channel.title}
                src={channel.avatarUrl}
                size={88}
                rounded="2xl"
              />
              <div className="mt-4 flex items-center gap-1.5">
                <h2 className="text-xl font-bold">{channel.title}</h2>
                {channel.verified && (
                  <BadgeCheck size={20} className="text-primary" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                @{channel.username}
              </p>
              {channel.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {channel.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={tag === "GLOBAL" ? "default" : "secondary"}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-border">
              <div className="flex flex-col items-center gap-1 px-4 py-4">
                <Users size={16} className="text-muted-foreground" />
                <span className="text-lg font-bold">
                  {formatCount(channel.subscribers)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("channels.subscribers")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-4">
                <Tag size={16} className="text-muted-foreground" />
                <span className="text-lg font-bold">{channel.niche || "—"}</span>
                <span className="text-xs text-muted-foreground">
                  {t("channel.niche")}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description + CTA */}
            <div className="px-5 py-5">
              {channel.description && (
                <p className="mb-5 text-sm leading-relaxed text-foreground/85">
                  {channel.description}
                </p>
              )}
              <Button
                className="w-full"
                size="lg"
                asChild
                onClick={() => haptic("medium")}
              >
                <a
                  href={`https://t.me/${channel.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={18} />
                  {t("channel.open")}
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
