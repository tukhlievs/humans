"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, Newspaper, BadgeCheck, PenLine, ChevronRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { haptic } from "@/lib/telegram";
import type { Category, CategorySlug } from "@/types";

const icons: Record<CategorySlug, LucideIcon> = {
  crypto: Coins,
  news: Newspaper,
  pro: BadgeCheck,
  blog: PenLine,
};

export function CategoryCard({
  category,
  index,
  count,
}: {
  category: Category;
  index: number;
  count?: number;
}) {
  const Icon = icons[category.slug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/category/${category.slug}`} onClick={() => haptic("light")}>
        <Card className="flex items-center gap-4 p-4 transition-colors hover:border-accent/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icon size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{category.title}</h3>
              {count !== undefined ? (
                <span className="shrink-0 text-xs text-muted">{count}</span>
              ) : null}
            </div>
            <p className="truncate text-sm text-muted">{category.subtitle}</p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-muted" />
        </Card>
      </Link>
    </motion.div>
  );
}
