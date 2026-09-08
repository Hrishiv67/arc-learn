import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ARC Learn — American Rocketry Challenge course",
    short_name: "ARC Learn",
    description:
      "A free, unofficial course that takes a first-year American Rocketry Challenge team from registration to their first qualification flight.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#113d55",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
