import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TextButton } from "@/components/ui/Button";

export type NavLink = { href: string; label: string };

/**
 * Desktop: white sticky header, wordmark in the heading face (no ARC logo —
 * this is an unofficial companion site). Mobile: collapses to a navy app bar;
 * primary nav moves into <TabBar> at the bottom of the screen.
 */
export function SiteHeader({
  links,
  signedIn,
}: {
  links: NavLink[];
  signedIn?: boolean;
}) {
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
      <div className="hidden md:flex items-center justify-between max-w-[1240px] mx-auto px-10 h-20">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-heading font-bold text-[22px] text-arc-navy">
            ARC Learn
          </span>
          <span className="font-heading font-semibold text-[10px] uppercase tracking-[0.04em] text-sky-800 mt-1">
            Unofficial course
          </span>
        </Link>
        <nav className="flex items-center gap-8" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-heading font-semibold text-[13px] uppercase tracking-[0.03em] text-arc-navy transition-colors duration-200 ease-arc hover:text-sky-700"
            >
              {l.label}
            </Link>
          ))}
          <TextButton href="/account">
            {signedIn ? "Account" : "Sign in"}
          </TextButton>
        </nav>
      </div>
    </header>
  );
}
