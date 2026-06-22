import { UnifiedOpportunity } from "./types";

// Shared in-memory detail cache used by every source connector and read by
// /api/opportunities/[id]. On Vercel, /api/opportunities/search and
// /api/opportunities/[id] can land on different serverless instances that
// don't share memory, so this is a best-effort fast path — the client also
// persists opportunities to sessionStorage as the reliable fallback.

interface CacheEntry {
  opportunity: UnifiedOpportunity;
  expiresAt: number;
}

const DETAIL_TTL_MS = 30 * 60 * 1000; // 30 minutes

const detailCache = new Map<string, CacheEntry>();

export function cacheOpportunity(opportunity: UnifiedOpportunity): void {
  detailCache.set(opportunity.id, { opportunity, expiresAt: Date.now() + DETAIL_TTL_MS });
}

export function cacheOpportunities(opportunities: UnifiedOpportunity[]): void {
  opportunities.forEach(cacheOpportunity);
}

export function getCachedOpportunity(id: string): UnifiedOpportunity | null {
  const entry = detailCache.get(id);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    detailCache.delete(id);
    return null;
  }
  return entry.opportunity;
}
