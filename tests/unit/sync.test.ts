import { beforeEach, expect, test, vi } from "vitest";
const mock = vi.hoisted(() => ({
  selectError: null as null | { message: string },
  writeError: null as null | { message: string },
  upsert: vi.fn(),
  rows: [],
}));
vi.mock("@/lib/supabase/client", () => ({
  isSupabaseConfigured: () => true,
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: async () => ({ data: mock.rows, error: mock.selectError }),
      }),
      upsert: mock.upsert,
    }),
  }),
}));
vi.mock("@/lib/progress/local", () => ({
  readProgress: () => ({
    "this-years-challenge": { read: true, quiz: { score: 9, total: 11 } },
  }),
}));
import {
  fetchRemoteProgress,
  mergeLocalProgressOnSignUp,
} from "@/lib/progress/sync";
beforeEach(() => {
  mock.selectError = null;
  mock.writeError = null;
  mock.rows = [];
  mock.upsert
    .mockReset()
    .mockImplementation(async () => ({ error: mock.writeError }));
});
test("a failed read is surfaced and never followed by an overwrite", async () => {
  mock.selectError = { message: "offline" };
  await expect(mergeLocalProgressOnSignUp("user-1")).rejects.toEqual(
    mock.selectError,
  );
  expect(mock.upsert).not.toHaveBeenCalled();
});
test("failed uploads are surfaced for retry", async () => {
  mock.writeError = { message: "missing module seed" };
  await expect(mergeLocalProgressOnSignUp("user-1")).rejects.toEqual(
    mock.writeError,
  );
});
test("failed downloads do not masquerade as empty progress", async () => {
  mock.selectError = { message: "network error" };
  await expect(fetchRemoteProgress("user-1")).rejects.toEqual(mock.selectError);
});
