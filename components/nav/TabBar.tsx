"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";
import { Icon, type IconName } from "@/components/ui/Icon";

export type TabItem = { href: string; label: string; icon: IconName };

/**
 * Documented ARC Modules brand extension. Navy tab bar, fixed to the bottom
 * on phone. Active tab marked by a 3px red top rule (red is action; here it
 * marks "where you are", the closest thing to an action state in nav chrome).
 */
export function TabBar({ items }: { items: TabItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-arc-navy border-t border-navy-700"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-1 min-h-14 border-t-[3px]",
              active ? "border-arc-red" : "border-transparent",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              name={item.icon}
              size={22}
              className={active ? "text-white" : "text-sky-500"}
            />
            <span
              className={clsx(
                "font-heading font-semibold text-[10px] uppercase tracking-[0.03em]",
                active ? "text-white" : "text-sky-500",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
