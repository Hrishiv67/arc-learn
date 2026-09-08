import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // .mdx files under content/ are imported as modules by lib/content/loadModule,
  // not routed directly, so pageExtensions stays untouched.

  // dnd-kit creates React context at module scope, which crashes the
  // "collect page data" build phase for routes that reach it transitively
  // (even through a "use client" boundary) unless it's kept out of that
  // static-analysis pass and required normally at runtime instead.
  serverExternalPackages: [
    "@dnd-kit/core",
    "@dnd-kit/sortable",
    "@dnd-kit/utilities",
  ],

  // The e2e test runner drives the dev server over 127.0.0.1, which Next's
  // dev-origin allowlist otherwise blocks by default.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
