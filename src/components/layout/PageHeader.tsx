"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { haptic } from "@/lib/telegram";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-start gap-3 pb-5 pt-1">
      {back && (
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5 shrink-0 rounded-xl border border-border"
          onClick={() => { haptic("light"); router.back(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </Button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
