"use client";

import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChannelCard } from "@/components/ChannelCard";
import { getCategory, getChannelsByCategory } from "@/lib/data";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const list = getChannelsByCategory(params.slug);

  return (
    <div className="animate-fade-in">
      <PageHeader title={category.title} subtitle={category.subtitle} back />
      <div className="space-y-2.5">
        {list.map((channel, index) => (
          <ChannelCard key={channel.id} channel={channel} index={index} />
        ))}
      </div>
    </div>
  );
}
