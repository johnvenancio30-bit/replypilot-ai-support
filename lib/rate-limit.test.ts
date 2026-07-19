import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("demo rate limit", () => {
  it("blocks requests above the configured limit", () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(key, 2).allowed).toBe(true);
    expect(checkRateLimit(key, 2).allowed).toBe(true);
    expect(checkRateLimit(key, 2).allowed).toBe(false);
  });
});
