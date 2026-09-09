"use client";

import { useEffect, useRef } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchRemoteProgress, pushProgress } from "@/lib/progress/sync";
import { mergeRemoteProgress, readProgress } from "@/lib/progress/local";

/**
 * Mounted once, globally (app/layout.tsx) — not rendered UI, just wiring.
 * Local storage stays the single source of truth every component reads
 * from (useProgress()); this keeps it mirrored to Supabase for whoever is
 * signed in, in both directions:
 *   - pull: on sign-in (including an already-active session on load),
 *     merge remote progress into local, in case this is a new device.
 *   - push: whenever local progress changes while signed in, mirror the
 *     full local state up to Supabase.
 * A no-op with zero listeners when no Supabase project is configured.
 */
export function AccountSync() {
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    async function pull(userId: string) {
      userIdRef.current = userId;
      const remote = await fetchRemoteProgress(userId);
      mergeRemoteProgress(remote);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) pull(data.user.id);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          pull(session.user.id);
        } else if (event === "SIGNED_OUT") {
          userIdRef.current = null;
        }
      },
    );

    const onLocalChange = () => {
      const userId = userIdRef.current;
      if (!userId) return;
      const state = readProgress();
      for (const [moduleId, moduleProgress] of Object.entries(state)) {
        pushProgress(userId, moduleId, moduleProgress);
      }
    };
    window.addEventListener("arc-learn:progress-changed", onLocalChange);

    return () => {
      subscription.subscription.unsubscribe();
      window.removeEventListener("arc-learn:progress-changed", onLocalChange);
    };
  }, []);

  return null;
}
