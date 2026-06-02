"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { haptic } from "@/lib/telegram";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, back, action }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-start gap-3 pb-5 pt-2">
      {back ? (
        <button
          onClick={() => {
            haptic("light");
            router.back();
          }}
          aria-label="Back"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft size={20} />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
