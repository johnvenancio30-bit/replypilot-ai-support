import { describe, expect, it } from "vitest";
import { ticketInputSchema } from "@/lib/validation";

describe("ticket input validation", () => {
  it("accepts a complete support request", () => {
    const result = ticketInputSchema.safeParse({
      name: "John Venancio",
      email: "johnvenancio30@gmail.com",
      orderNumber: "ORD-78214",
      topic: "Delayed delivery",
      message: "My tracking has not changed for four business days.",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short messages and invalid email addresses", () => {
    const result = ticketInputSchema.safeParse({ name: "J", email: "bad", topic: "Help", message: "short" });
    expect(result.success).toBe(false);
  });
});
