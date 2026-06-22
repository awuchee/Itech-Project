import { OpportunityCategory, OpportunitySearchResult, UnifiedOpportunity } from "../types";
import { cacheOpportunities } from "../cache";

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/gb/search";
const RESULTS_PER_PAGE = 50;
const CACHE_TTL_MS = 8 * 60 * 1000; // 8 minutes

interface AdzunaJob {
  id: string | number;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  description?: string;
  created?: string;
}

interface ResponseCacheEntry {
  expiresAt: number;
  data: OpportunitySearchResult;
}

// Module-scope caches survive across requests within the same warm instance.
const responseCache = new Map<string, ResponseCacheEntry>();
const inFlightRequests = new Map<string, Promise<OpportunitySearchResult>>();

function formatSalary(job: AdzunaJob): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  if (job.salary_min && job.salary_max && job.salary_min !== job.salary_max) {
    return `£${Math.round(job.salary_min).toLocaleString()} – £${Math.round(job.salary_max).toLocaleString()}`;
  }
  const value = job.salary_min || job.salary_max;
  return value ? `£${Math.round(value).toLocaleString()}` : null;
}

function normalize(job: AdzunaJob, category: OpportunityCategory): UnifiedOpportunity {
  return {
    id: `adzuna-${job.id}`,
    title: job.title,
    description: (job.description || "").trim(),
    location: job.location?.display_name || "Not specified",
    category,
    source: "Adzuna",
    applyUrl: job.redirect_url,
    postedAt: job.created || new Date().toISOString(),
    company: job.company?.display_name || "Unknown Company",
    salary: formatSalary(job),
  };
}

export interface AdzunaSearchOptions {
  category: OpportunityCategory;
  what?: string;
  where?: string;
  page?: number;
  /** OR-matched keyword fallback used when no explicit `what` is supplied (e.g. category defaults). */
  keywordOr?: string;
}

/**
 * Throws on missing credentials or upstream failure so the service layer can
 * fall back to the backup source — never silently returns mock data.
 */
export async function searchAdzuna(options: AdzunaSearchOptions): Promise<OpportunitySearchResult> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    const missing = [!appId && "ADZUNA_APP_ID", !appKey && "ADZUNA_APP_KEY"].filter(Boolean).join(", ");
    console.error(
      `[adzuna] Missing required environment variable(s): ${missing}. ` +
      `Set them in .env.local for development and in Vercel's Environment Variables for deployed environments.`
    );
    throw new Error("Adzuna credentials are not configured.");
  }

  const what = (options.what || "").trim();
  const where = (options.where || "").trim();
  const page = Math.max(1, options.page || 1);
  const keywordOr = !what ? (options.keywordOr || "") : "";

  const cacheKey = `${options.category}|${what.toLowerCase()}|${where.toLowerCase()}|${keywordOr.toLowerCase()}|${page}`;

  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    cacheOpportunities(cached.data.opportunities);
    return cached.data;
  }

  let pending = inFlightRequests.get(cacheKey);
  if (!pending) {
    pending = fetchAdzuna(appId, appKey, options.category, what, where, keywordOr, page);
    inFlightRequests.set(cacheKey, pending);
  }

  try {
    const data = await pending;
    responseCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    return data;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

async function fetchAdzuna(
  appId: string,
  appKey: string,
  category: OpportunityCategory,
  what: string,
  where: string,
  keywordOr: string,
  page: number
): Promise<OpportunitySearchResult> {
  const url = new URL(`${ADZUNA_BASE_URL}/${page}`);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("results_per_page", String(RESULTS_PER_PAGE));
  url.searchParams.set("content-type", "application/json");
  if (what) url.searchParams.set("what", what);
  if (keywordOr) url.searchParams.set("what_or", keywordOr);
  if (where) url.searchParams.set("where", where);

  const response = await fetch(url.toString(), { method: "GET" });

  if (!response.ok) {
    throw new Error(`Adzuna API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const opportunities: UnifiedOpportunity[] = (data.results || []).map((job: AdzunaJob) =>
    normalize(job, category)
  );

  cacheOpportunities(opportunities);

  return { count: data.count ?? opportunities.length, opportunities, sourcesUsed: ["Adzuna"] };
}
