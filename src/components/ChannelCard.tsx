"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/Avatar";
import { formatCount } from "@/lib/utils";
import { haptic } from "@/lib/telegram";
import { useT } from "@/lib/store";
import type { Channel } from "@/types";

export function ChannelCard({ channel, index = 0 }: { channel: Channel; index?: number }) {
  const t = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: "easeOut" }}
      whileTap={{ scale: 0.99 }}
    >
      <Link href={`/channel/${channel.id}`} onClick={() => haptic("light")}>
        <Card className="flex items-center gap-3.5 p-3.5 transition-colors hover:border-accent/40">
          <Avatar name={channel.title} size={52} rounded="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-semibold">{channel.title}</h3>
              {channel.verified ? <BadgeCheck size={15} className="shrink-0 text-accent" /> : null}
            </div>
            <p className="truncate text-sm text-muted">
              {formatCount(channel.subscribers)} {t("channels.subscribers")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {channel.tags.map((tag) => (
              <Badge key={tag} tone={tag === "GLOBAL" ? "accent" : "default"}>
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
