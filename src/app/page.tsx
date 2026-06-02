"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { categories } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { fetchChannels } from "@/lib/api";
import { useT } from "@/lib/store";

const HeroBackground = dynamic(
  () => import("@/components/three/HeroBackground"),
  { ssr: false },
);

export default function HomePage() {
  const t = useT();
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetchChannels().then((list) => {
      const next: Record<string, number> = {};
      for (const ch of list) next[ch.category] = (next[ch.category] ?? 0) + 1;
      setCounts(next);
    });
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative -mx-4 mb-6 overflow-hidden px-4 pb-10 pt-8">
        <HeroBackground />

        {/* gradient fade at bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
          >
            <Sparkles size={12} />
            {t("app.name")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mt-2 text-4xl font-bold tracking-tight text-foreground"
          >
            {t("home.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            {t("home.subtitle")}
          </motion.p>
        </div>
      </div>

      {/* ── Category list ── */}
      <div className="space-y-3">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.slug}
            category={category}
            index={index}
            count={counts?.[category.slug]}
          />
        ))}
      </div>
    </div>
  );
}
