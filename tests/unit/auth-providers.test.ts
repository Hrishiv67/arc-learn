import { afterEach, describe, it, expect, vi } from "vitest";
import { googleAuthEnabled } from "@/lib/supabase/providers";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("Google provider availability", () => {
  const configure = () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "public-test-key");
  };
  it("shows Google only when the live provider is enabled", async () => {
    configure();
    const fetcher = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ external: { google: true } }),
      });
    vi.stubGlobal("fetch", fetcher);
    expect(await googleAuthEnabled()).toBe(true);
    expect(fetcher.mock.calls[0][0]).toBe(
      "https://example.supabase.co/auth/v1/settings",
    );
  });
  it("hides an unconfigured provider", async () => {
    configure();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_AUTH", "");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({ external: { google: false } }),
        }),
    );
    expect(await googleAuthEnabled()).toBe(false);
  });
  it("can force Google on with NEXT_PUBLIC_GOOGLE_AUTH=1", async () => {
    configure();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_AUTH", "1");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect(await googleAuthEnabled()).toBe(true);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("keeps email available when provider lookup fails", async () => {
    configure();
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_AUTH", "");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await googleAuthEnabled()).toBe(false);
  });
});
