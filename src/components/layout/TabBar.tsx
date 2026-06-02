"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { Home, Users, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/store";
import { haptic } from "@/lib/telegram";

const tabs = [
  { href: "/",         icon: Home,     key: "tab.home"     },
  { href: "/people",   icon: Users,    key: "tab.people"   },
  { href: "/profile",  icon: User,     key: "tab.profile"  },
  { href: "/settings", icon: Settings, key: "tab.settings" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return (
      pathname === "/" ||
      pathname.startsWith("/category") ||
      pathname.startsWith("/channel")
    );
  }
  return pathname.startsWith(href);
}

export function TabBar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        <LayoutGroup id="tab-nav">
          {tabs.map(({ href, icon: Icon, key }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => haptic("light")}
                className="relative flex flex-1 flex-col items-center gap-[3px] py-3"
              >
                {active && (
                  <motion.div
                    layoutId="tab-bubble"
                    className="absolute inset-x-1 inset-y-1 rounded-xl bg-primary/10"
                    transition={{ type: "spring", bounce: 0.22, duration: 0.45 }}
                  />
                )}
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={cn(
                    "relative z-10 transition-colors duration-200",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "relative z-10 text-[10px] font-semibold tracking-wide transition-colors duration-200",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t(key)}
                </span>
              </Link>
            );
          })}
        </LayoutGroup>
      </div>
    </nav>
  );
}
