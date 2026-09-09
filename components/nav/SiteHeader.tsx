"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { TextButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useProgress, getCoursePct } from "@/lib/progress/local";
import { useSupabaseUser } from "@/lib/supabase/useUser";
import { clsx } from "@/lib/clsx";

export type NavLink = { href: string; label: string };

/**
 * Desktop: white sticky header, wordmark in the heading face (no ARC logo —
 * this is an unofficial companion site). Mobile: collapses to a navy app bar;
 * primary nav moves into <TabBar> at the bottom of the screen.
 */
export function SiteHeader({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const progress = useProgress();
  const pct = getCoursePct(progress);
  const { user } = useSupabaseUser();
  const signedIn = !!user;

  // "/modules" is a prefix of "/modules/this-years-challenge", so a naive
  // startsWith check would light up both Course and Module 1 at once on any
  // module page. Only the most specific (longest href) match wins.
  const isLinkActive = (href: string) => {
    if (pathname === href) return true;
    if (!pathname.startsWith(href + "/")) return false;
    return !links.some(
      (other) =>
        other.href !== href &&
        other.href.length > href.length &&
        (pathname === other.href || pathname.startsWith(other.href + "/")),
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-navy-200 bg-arc-white md:bg-arc-white">
      {/* Mobile app bar */}
      <div className="flex md:hidden items-center justify-between h-14 px-4 bg-arc-navy text-white">
        <Link
          href="/"
          className="font-heading font-bold text-[18px] text-white"
        >
          ARC Learn
        </Link>
        <Link
          href="/account"
          aria-label={signedIn ? "Account" : "Sign in"}
          className="inline-flex items-center justify-center w-11 h-11 -mr-2 text-white"
        >
          <Icon name="user" size={20} />
        </Link>
      </div>

      {/* Desktop header */}
      <Container className="hidden md:flex items-center justify-between h-20">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-heading font-bold text-[22px] text-arc-navy">
            ARC Learn
          </span>
          <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.04em] text-sky-800 mt-1">
            Unofficial course
          </span>
        </Link>
        <nav className="flex items-center gap-8 h-full" aria-label="Primary">
          {links.map((l) => {
            const active = isLinkActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex items-center h-full font-heading font-semibold text-[13px] uppercase tracking-[0.03em] border-b-[3px] transition-colors duration-200 ease-arc hover:text-sky-700",
                  active
                    ? "text-arc-navy border-arc-red"
                    : "text-arc-navy border-transparent",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <span className="flex items-center gap-2.5">
            <span className="w-[90px] h-[6px] bg-mist-600">
              <span
                className="block h-full bg-go transition-[width] duration-500 ease-arc"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="font-body text-[13px] text-sky-800">
              {Math.round(pct)}%
            </span>
          </span>
          <TextButton href="/account">
            {signedIn ? "Account" : "Sign in"}
          </TextButton>
        </nav>
      </Container>
    </header>
  );
}
