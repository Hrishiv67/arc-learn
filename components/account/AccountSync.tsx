"use client";

import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  fetchRemoteProgress,
  mergeLocalProgressOnSignUp,
} from "@/lib/progress/sync";
import { mergeRemoteProgress, setProgressOwner } from "@/lib/progress/local";

export function AccountSync() {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    let active = true;
    let userId: string | null = null;
    let running = false;
    let pending = false;
    let merging = false;
    let timer: ReturnType<typeof setTimeout>;
    async function sync() {
      if (!active || !userId) return;
      if (running) {
        pending = true;
        return;
      }
      running = true;
      const owner = userId;
      try {
        const remote = await fetchRemoteProgress(owner);
        if (!active || owner !== userId) return;
        merging = true;
        mergeRemoteProgress(remote);
        merging = false;
        await mergeLocalProgressOnSignUp(owner);
        if (active && owner === userId) setFailed(false);
      } catch {
        if (active && owner === userId) setFailed(true);
      } finally {
        merging = false;
        running = false;
        if (pending && active) {
          pending = false;
          schedule();
        }
      }
    }
    function schedule() {
      if (merging) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        void sync();
      }, 200);
    }
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      userId = session?.user.id ?? null;
      setProgressOwner(userId);
      // Defer Supabase calls until the auth callback releases its lock.
      if (userId) schedule();
      else setFailed(false);
    });
    window.addEventListener("arc-learn:progress-changed", schedule);
    window.addEventListener("online", schedule);
    return () => {
      active = false;
      clearTimeout(timer);
      data.subscription.unsubscribe();
      window.removeEventListener("arc-learn:progress-changed", schedule);
      window.removeEventListener("online", schedule);
    };
  }, []);
  return failed ? (
    <div
      role="status"
      className="bg-caution-tint text-caution px-4 py-2 text-sm text-center"
    >
      Progress is saved on this device. Cloud sync is unavailable.{" "}
      <button
        className="underline font-bold"
        onClick={() =>
          window.dispatchEvent(new Event("arc-learn:progress-changed"))
        }
      >
        Retry sync
      </button>
    </div>
  ) : null;
}
