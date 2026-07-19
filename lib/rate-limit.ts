type Bucket = { count: number; resetAt: number };

const globalForRateLimit = globalThis as typeof globalThis & {
  replyPilotRateLimits?: Map<string, Bucket>;
};

const buckets = globalForRateLimit.replyPilotRateLimits ?? new Map<string, Bucket>();
globalForRateLimit.replyPilotRateLimits = buckets;

export function checkRateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (current.count >= limit) return { allowed: false, remaining: 0, resetAt: current.resetAt };
  current.count += 1;
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}
