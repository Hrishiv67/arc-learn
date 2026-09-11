import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { TabBar } from "@/components/nav/TabBar";
import { PwaRegister } from "@/components/PwaRegister";
import { AccountSync } from "@/components/account/AccountSync";

export const metadata: Metadata = {
  title: {
    default: "ARC Learn",
    template: "%s · ARC Learn",
  },
  description:
    "A free course that takes a first-year American Rocketry Challenge team from registration to their first qualification flight. Unofficial and not affiliated with AIA or NAR.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#113d55",
  width: "device-width",
  initialScale: 1,
};

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <AccountSync />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader links={NAV_LINKS} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <TabBar items={TAB_ITEMS} />
      </body>
    </html>
  );
}
