"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChannelCard } from "@/components/ChannelCard";
import { getCategory } from "@/lib/data";
import { fetchChannelsByCategory } from "@/lib/api";
import { useT } from "@/lib/store";
import type { Channel } from "@/types";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const t = useT();
  const category = getCategory(slug);
  const [list, setList] = useState<Channel[] | null>(null);

  useEffect(() => {
    if (!category) return;
    let active = true;
    fetchChannelsByCategory(slug).then((data) => {
      if (active) setList(data);
    });
    return () => {
      active = false;
    };
  }, [slug, category]);

  if (!category) notFound();

  return (
    <div className="animate-fade-in">
      <PageHeader title={category.title} subtitle={category.subtitle} back />

      {list === null ? (
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[80px] animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted">{t("channels.empty")}</p>
      ) : (
        <div className="space-y-2.5">
          {list.map((channel, index) => (
            <ChannelCard key={channel.id} channel={channel} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
