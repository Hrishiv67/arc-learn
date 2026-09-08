import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="max-w-[560px] mx-auto px-5 py-16 text-center flex flex-col items-center gap-5">
      <Icon name="wifi-off" size={40} className="text-sky-800" />
      <h1 className="font-heading font-bold text-arc-navy text-[26px]">
        No connection
      </h1>
      <p className="font-body text-[17px] text-arc-ink">
        This page hasn&apos;t been cached for offline reading yet. Lessons and
        handouts you&apos;ve already opened stay available without a connection
        — video is the one thing that needs one.
      </p>
      <Button href="/modules" variant="primary">
        Back to the course
      </Button>
    </div>
  );
}
