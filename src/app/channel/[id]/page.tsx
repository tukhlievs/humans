"use client";

import { use, useEffect, useState } from "react";
import { BadgeCheck, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/Avatar";
import { buttonVariants } from "@/components/ui/button";
import { fetchChannel } from "@/lib/api";
import { cn, formatCount } from "@/lib/utils";
import { useT } from "@/lib/store";
import { haptic } from "@/lib/telegram";
import type { Channel } from "@/types";

export default function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useT();
  // undefined = loading, null = not found
  const [channel, setChannel] = useState<Channel | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchChannel(id).then((data) => {
      if (active) setChannel(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("app.name")} back />

      {channel === undefined ? (
        <div className="h-72 animate-pulse rounded-2xl bg-surface" />
      ) : channel === null ? (
        <p className="mt-12 text-center text-sm text-muted">{t("channel.notFound")}</p>
      ) : (
        <Card className="p-5">
          <div className="flex flex-col items-center text-center">
            <Avatar name={channel.title} src={channel.avatarUrl} size={88} rounded="xl" />
            <div className="mt-3 flex items-center gap-1.5">
              <h2 className="text-xl font-semibold">{channel.title}</h2>
              {channel.verified ? <BadgeCheck size={18} className="text-accent" /> : null}
            </div>
            <p className="text-sm text-muted">@{channel.username}</p>

            <div className="mt-4 flex items-center gap-2">
              {channel.tags.map((tag) => (
                <Badge key={tag} tone={tag === "GLOBAL" ? "accent" : "default"}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5 text-center">
            <div>
              <p className="text-lg font-semibold">{formatCount(channel.subscribers)}</p>
              <p className="text-xs text-muted">{t("channels.subscribers")}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{channel.niche}</p>
              <p className="text-xs text-muted">{t("channel.niche")}</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-foreground/90">{channel.description}</p>

          <a
            href={`https://t.me/${channel.username}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic("medium")}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-5 w-full")}
          >
            <ExternalLink size={18} />
            {t("channel.open")}
          </a>
        </Card>
      )}
    </div>
  );
}
