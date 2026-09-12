"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  progressStateSchema,
  isModuleComplete,
  type ProgressState,
  type ModuleProgress,
} from "@/lib/schemas/progress";
import { MODULES } from "@/content/modules/registry";

const ANONYMOUS_KEY = "arc-learn:progress:v1";
let STORAGE_KEY = ANONYMOUS_KEY;
const EMPTY_PROGRESS: ProgressState = {};

// useSyncExternalStore calls getSnapshot on every render and treats a new
// object reference as "the store changed" — since JSON.parse allocates a
// fresh object every call, returning it unconditionally caused an infinite
// render loop. Cache by the raw string so an unchanged localStorage value
// returns the exact same reference.
const memoryOnly = new Map<string, ProgressState>();
let cachedRaw: string | null = null;
let cachedState: ProgressState = EMPTY_PROGRESS;

/**
 * Tier 1 (anonymous) progress. Excellent on its own — no signup wall, no
 * degraded fallback. Tier 2 sync (lib/supabase) merges this on signup
 * rather than discarding it.
 */
export function readProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  const memory = memoryOnly.get(STORAGE_KEY);
  if (memory) return memory;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedState;
  }
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  if (!raw) {
    cachedState = EMPTY_PROGRESS;
    return cachedState;
  }
  try {
    const parsed = progressStateSchema.safeParse(JSON.parse(raw));
    cachedState = parsed.success ? parsed.data : EMPTY_PROGRESS;
  } catch {
    cachedState = EMPTY_PROGRESS;
  }
  return cachedState;
}

function writeProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  cachedState = state;
  cachedRaw = JSON.stringify(state);
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
    memoryOnly.delete(STORAGE_KEY);
  } catch {
    memoryOnly.set(STORAGE_KEY, state);
  }
  window.dispatchEvent(new CustomEvent("arc-learn:progress-changed"));
}

/** Isolate accounts on shared classroom devices; import guest work once. */
export function setProgressOwner(userId: string | null) {
  const nextKey = userId ? `${ANONYMOUS_KEY}:${userId}` : ANONYMOUS_KEY;
  if (nextKey === STORAGE_KEY) return;
  const guest = userId && STORAGE_KEY === ANONYMOUS_KEY ? readProgress() : {};
  STORAGE_KEY = nextKey;
  cachedRaw = null;
  cachedState = EMPTY_PROGRESS;
  if (userId && Object.keys(guest).length) {
    mergeRemoteProgress(guest);
    memoryOnly.delete(ANONYMOUS_KEY);
    try {
      window.localStorage.removeItem(ANONYMOUS_KEY);
    } catch {
      /* Storage may be blocked. */
    }
  }
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
    [moduleId]: {
      ...existing,
      read: true,
      quiz:
        existing.quiz &&
        existing.quiz.score / existing.quiz.total > score / total
          ? existing.quiz
          : { score, total },
    },
  });
}

export function resetProgress() {
  writeProgress({});
}

/**
 * Pull-on-signin counterpart to sync.ts's mergeLocalProgressOnSignUp: folds
 * remote (Supabase) progress into local storage, module by module, keeping
 * whichever side represents more progress rather than letting a fresh
 * sign-in on a new device blow away further-along local progress.
 */
export function mergeRemoteProgress(remote: ProgressState) {
  const local = readProgress();
  const merged: ProgressState = { ...local };
  for (const [moduleId, remoteModule] of Object.entries(remote)) {
    const localModule = local[moduleId];
    const remoteScore = remoteModule.quiz
      ? remoteModule.quiz.score / remoteModule.quiz.total
      : -1;
    const localScore = localModule?.quiz
      ? localModule.quiz.score / localModule.quiz.total
      : -1;
    if (!localModule || remoteScore > localScore) {
      merged[moduleId] = {
        ...remoteModule,
        read: remoteModule.read || !!localModule?.read,
      };
    }
  }
  writeProgress(merged);
}

function subscribeToProgress(onChange: () => void) {
  window.addEventListener("arc-learn:progress-changed", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("arc-learn:progress-changed", onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Client-side reactive read of the whole progress state. Uses
 * useSyncExternalStore (not useState+useEffect) specifically so the server
 * render and the client's *first* render both see EMPTY_PROGRESS — reading
 * localStorage during the initial client render, before hydration commits,
 * produced a hydration mismatch (course completion flashing from 0% to its
 * real value on every load).
 */
export function useProgress(): ProgressState {
  return useSyncExternalStore(
    subscribeToProgress,
    readProgress,
    () => EMPTY_PROGRESS,
  );
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

/** Percentage of the whole course (all modules, not just live ones) completed. */
export function getCoursePct(progress: ProgressState): number {
  const done = MODULES.filter((m) => isModuleComplete(progress[m.id])).length;
  return (done / MODULES.length) * 100;
}
