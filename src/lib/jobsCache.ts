// Shared in-memory job detail cache, used by both /api/jobs/search and
// /api/jobs/[id]. On Vercel each route can run in a separate serverless
// instance, so this in-memory cache is a best-effort layer (fast when the
// instance is warm) — the client also persists jobs to sessionStorage as a
// reliable fallback so detail pages always resolve after a real search.

export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  applyUrl: string;
  description: string;
}

interface JobCacheEntry {
  job: NormalizedJob;
  expiresAt: number;
}

const JOB_DETAIL_TTL_MS = 30 * 60 * 1000; // 30 minutes

const jobDetailCache = new Map<string, JobCacheEntry>();

export function cacheJob(job: NormalizedJob): void {
  jobDetailCache.set(job.id, { job, expiresAt: Date.now() + JOB_DETAIL_TTL_MS });
}

export function getCachedJob(id: string): NormalizedJob | null {
  const entry = jobDetailCache.get(id);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    jobDetailCache.delete(id);
    return null;
  }
  return entry.job;
}
