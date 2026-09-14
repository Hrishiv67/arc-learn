import type { Metadata, Viewport } from "next";
import { Jost, Nunito_Sans } from "next/font/google";
import "./globals.css";
// Imported here rather than @import-ed from globals.css so the dev server
// watches it directly and hot-reloads edits.
import "./hero.css";
import { PwaRegister } from "@/components/PwaRegister";
import { AccountSync } from "@/components/account/AccountSync";

/*
 * ARC sets headings in Futura PT and body in Museo Sans (Adobe Typekit).
 * Jost is an open Futura revival. Nunito Sans is the closest open face to Museo
 * Sans — same geometric-humanist build and low stroke contrast — and replaces
 * Hanken Grotesk, which ran colder and narrower than the real thing.
 *
 * Settings follow rocketrychallenge.org as measured, not just its faces:
 * headings Futura PT Bold at normal tracking; body Museo Sans Light (300);
 * buttons Museo Sans Black (900), uppercase. No monospace anywhere on their
 * site, so none here.
 */
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  variable: "--font-museo",
  display: "swap",
});


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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full ${jost.variable} ${nunitoSans.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <AccountSync />
        {children}
      </body>
    </html>
  );
}
