import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { TabBar } from "@/components/nav/TabBar";

/**
 * App chrome — header, footer, tab bar.
 *
 * The homepage sits outside this group because the launch sequence is
 * full-bleed and carries its own minimal navigation; a sticky header over it
 * would break the frame. Route groups don't affect URLs, so every path here is
 * unchanged.
 */

const NAV_LINKS = [
  { href: "/modules", label: "Course" },
  { href: "/modules/this-years-challenge", label: "Module 1" },
];

const TAB_ITEMS = [
  { href: "/modules", label: "Course", icon: "home" as const },
  {
    href: "/modules/this-years-challenge",
    label: "Module 1",
    icon: "list" as const,
  },
  { href: "/account", label: "Account", icon: "user" as const },
];

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader links={NAV_LINKS} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <TabBar items={TAB_ITEMS} />
    </>
  );
}
