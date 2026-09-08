"use client";

import { useCallback, useEffect, useState } from "react";
import {
  progressStateSchema,
  type ProgressState,
  type ModuleProgress,
} from "@/lib/schemas/progress";

const STORAGE_KEY = "arc-learn:progress:v1";

/**
 * Tier 1 (anonymous) progress. Excellent on its own — no signup wall, no
 * degraded fallback. Tier 2 sync (lib/supabase) merges this on signup
 * rather than discarding it.
 */
export function readProgress(): ProgressState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = progressStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

function writeProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("arc-learn:progress-changed"));
}

export function markRead(moduleId: string) {
  const state = readProgress();
  const existing: ModuleProgress = state[moduleId] ?? { read: false };
  writeProgress({ ...state, [moduleId]: { ...existing, read: true } });
}

export function recordQuizResult(
  moduleId: string,
  score: number,
  total: number,
) {
  const state = readProgress();
  const existing: ModuleProgress = state[moduleId] ?? { read: false };
  writeProgress({
    ...state,
    [moduleId]: { ...existing, read: true, quiz: { score, total } },
  });
}

export function resetProgress() {
  writeProgress({});
}

/** Client-side reactive read of the whole progress state. */
export function useProgress(): ProgressState {
  const [state, setState] = useState<ProgressState>(readProgress);

  useEffect(() => {
    const onChange = () => setState(readProgress());
    window.addEventListener("arc-learn:progress-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("arc-learn:progress-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return state;
}

export function useModuleProgress(
  moduleId: string,
): ModuleProgress | undefined {
  const state = useProgress();
  return state[moduleId];
}

export function useMarkRead(moduleId: string) {
  return useCallback(() => markRead(moduleId), [moduleId]);
}
