import "server-only";

import { createHash, randomBytes } from "node:crypto";

export function createDemoToken() {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashDemoToken(token) };
}

export function hashDemoToken(token: string) {
  const secret = process.env.DEMO_TOKEN_SECRET ?? "replypilot-local-demo-secret";
  return createHash("sha256").update(`${token}:${secret}`).digest("hex");
}
