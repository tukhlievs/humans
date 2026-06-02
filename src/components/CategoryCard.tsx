"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Coins, Newspaper, BadgeCheck, PenLine, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/telegram";
import type { Category, CategorySlug } from "@/types";

const icons: Record<CategorySlug, LucideIcon> = {
  crypto: Coins,
  news:   Newspaper,
  pro:    BadgeCheck,
  blog:   PenLine,
};

const gradients: Record<CategorySlug, string> = {
  crypto: "from-amber-500/20 to-yellow-400/10",
  news:   "from-blue-500/20 to-sky-400/10",
  pro:    "from-primary/20 to-indigo-400/10",
  blog:   "from-emerald-500/20 to-teal-400/10",
};

const iconColors: Record<CategorySlug, string> = {
  crypto: "text-amber-400",
  news:   "text-sky-400",
  pro:    "text-primary",
  blog:   "text-emerald-400",
};

export function CategoryCard({
  category,
  index = 0,
  count,
}: {
  category: Category;
  index?: number;
  count?: number;
}) {
  const Icon = icons[category.slug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={`/category/${category.slug}`}
        onClick={() => haptic("light")}
        className="group block"
      >
        <div
          className={cn(
            "flex items-center gap-4 rounded-2xl border border-border bg-card p-4",
            "transition-all duration-200",
            "hover:border-primary/30 hover:bg-card/80",
            "shadow-card",
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              "bg-gradient-to-br",
              gradients[category.slug],
              "border border-border/50",
            )}
          >
            <Icon size={22} className={iconColors[category.slug]} />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-foreground">
                {category.title}
              </h3>
              {count !== undefined && (
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  {count}
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {category.subtitle}
            </p>
          </div>

          {/* Arrow */}
          <ChevronRight
            size={18}
            className="shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </div>
      </Link>
    </motion.div>
  );
}
