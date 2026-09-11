import { beforeEach, expect, test, vi } from "vitest";
import {
  markRead,
  readProgress,
  recordQuizResult,
  resetProgress,
  mergeRemoteProgress,
  setProgressOwner,
} from "@/lib/progress/local";

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  setProgressOwner(null);
  resetProgress();
});
test("a failed retake preserves a previously passed score", () => {
  recordQuizResult("this-years-challenge", 10, 11);
  recordQuizResult("this-years-challenge", 3, 11);
  expect(readProgress()["this-years-challenge"].quiz).toEqual({
    score: 10,
    total: 11,
  });
});
test("a better remote score is merged without losing other modules", () => {
  markRead("safety-first");
  recordQuizResult("this-years-challenge", 3, 11);
  mergeRemoteProgress({
    "this-years-challenge": { read: true, quiz: { score: 9, total: 11 } },
  });
  expect(readProgress()["this-years-challenge"].quiz?.score).toBe(9);
  expect(readProgress()["safety-first"].read).toBe(true);
});
test("blocked storage does not prevent reading and completing a quiz", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  markRead("this-years-challenge");
  recordQuizResult("this-years-challenge", 8, 11);
  expect(readProgress()["this-years-challenge"].quiz?.score).toBe(8);
});

test("accounts on the same device do not inherit each other's progress", () => {
  markRead("this-years-challenge");
  setProgressOwner("first-user");
  expect(readProgress()["this-years-challenge"].read).toBe(true);
  recordQuizResult("this-years-challenge", 10, 11);
  setProgressOwner(null);
  expect(readProgress()).toEqual({});
  setProgressOwner("second-user");
  expect(readProgress()).toEqual({});
  setProgressOwner("first-user");
  expect(readProgress()["this-years-challenge"].quiz?.score).toBe(10);
});

test("full storage retains new progress for the session even when reads still work", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  markRead("this-years-challenge");
  recordQuizResult("this-years-challenge", 9, 11);
  expect(readProgress()["this-years-challenge"].quiz?.score).toBe(9);
});
