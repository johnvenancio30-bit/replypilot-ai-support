import { describe, expect, it } from "vitest";
import { findRelevantArticles } from "@/lib/knowledge-base";

describe("knowledge retrieval", () => {
  it("ranks shipping guidance for a stalled tracking request", () => {
    const [first] = findRelevantArticles("My delivery tracking has not changed and the package is late");
    expect(first.id).toBe("shipping-delays");
  });

  it("ranks duplicate charge guidance for billing language", () => {
    const [first] = findRelevantArticles("I was charged twice for one card payment");
    expect(first.id).toBe("billing-help");
  });
});
