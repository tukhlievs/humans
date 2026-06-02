"use client";

import dynamic from "next/dynamic";
import { categories } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { useT } from "@/lib/store";

const HeroBackground = dynamic(() => import("@/components/three/HeroBackground"), {
  ssr: false,
});

export default function HomePage() {
  const t = useT();

  return (
    <div className="animate-fade-in">
      <div className="relative -mx-4 mb-3 overflow-hidden px-4 pb-7 pt-6">
        <HeroBackground />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {t("app.name")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("home.title")}</h1>
          <p className="mt-1.5 text-sm text-muted">{t("home.subtitle")}</p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <CategoryCard key={category.slug} category={category} index={index} />
        ))}
      </div>
    </div>
  );
}
