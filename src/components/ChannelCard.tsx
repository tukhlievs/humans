"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/Avatar";
import { formatCount } from "@/lib/utils";
import { haptic } from "@/lib/telegram";
import { useT } from "@/lib/store";
import type { Channel } from "@/types";

export function ChannelCard({
  channel,
  index = 0,
}: {
  channel: Channel;
  index?: number;
}) {
  const t = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.045,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileTap={{ scale: 0.985 }}
    >
      <Link
        href={`/channel/${channel.id}`}
        onClick={() => haptic("light")}
        className="group block"
      >
        <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-card transition-colors hover:border-primary/25">
          {/* Avatar */}
          <Avatar
            name={channel.title}
            src={channel.avatarUrl}
            size={52}
            rounded="xl"
          />

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-semibold text-foreground">
                {channel.title}
              </span>
              {channel.verified && (
                <BadgeCheck size={15} className="shrink-0 text-primary" />
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatCount(channel.subscribers)}{" "}
              <span className="text-muted-foreground/60">{t("channels.subscribers")}</span>
            </p>
          </div>

          {/* Tags */}
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {channel.tags.map((tag) => (
              <Badge
                key={tag}
                variant={tag === "GLOBAL" ? "primary" : "default"}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
