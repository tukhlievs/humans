"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/store";
import { haptic } from "@/lib/telegram";

const tabs = [
  { href: "/", icon: Home, key: "tab.home" },
  { href: "/people", icon: Users, key: "tab.people" },
  { href: "/profile", icon: User, key: "tab.profile" },
  { href: "/settings", icon: Settings, key: "tab.settings" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname.startsWith("/category") || pathname.startsWith("/channel");
  return pathname.startsWith(href);
}

export function TabBar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ href, icon: Icon, key }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => haptic("light")}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-accent" : "text-muted hover:text-foreground",
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 1.9} />
              {t(key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
