import { NextRequest, NextResponse } from "next/server";

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/gb/search";
const RESULTS_PER_PAGE = 50;
const CACHE_TTL_MS = 8 * 60 * 1000; // 8 minutes

interface NormalizedJob {
  title: string;
  company: string;
  location: string;
  salary: string | null;
  applyUrl: string;
  description: string;
}

interface CacheEntry {
  expiresAt: number;
  data: { count: number; jobs: NormalizedJob[] };
}

interface AdzunaJob {
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  description?: string;
}

// Module-scope caches survive across requests within the same serverless instance.
const responseCache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<{ count: number; jobs: NormalizedJob[] }>>();

function truncate(text: string | undefined, maxLength: number): string {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

function formatSalary(job: AdzunaJob): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  if (job.salary_min && job.salary_max && job.salary_min !== job.salary_max) {
    return `£${Math.round(job.salary_min).toLocaleString()} – £${Math.round(job.salary_max).toLocaleString()}`;
  }
  const value = job.salary_min || job.salary_max;
  return value ? `£${Math.round(value).toLocaleString()}` : null;
}

async function fetchAdzunaJobs(
  appId: string,
  appKey: string,
  what: string,
  where: string,
  page: number
): Promise<{ count: number; jobs: NormalizedJob[] }> {
  const url = new URL(`${ADZUNA_BASE_URL}/${page}`);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("results_per_page", String(RESULTS_PER_PAGE));
  url.searchParams.set("content-type", "application/json");
  if (what) url.searchParams.set("what", what);
  if (where) url.searchParams.set("where", where);

  const response = await fetch(url.toString(), { method: "GET" });

  if (!response.ok) {
    throw new Error(`Adzuna API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const jobs: NormalizedJob[] = (data.results || []).map((job: AdzunaJob) => ({
    title: job.title,
    company: job.company?.display_name || "Unknown Company",
    location: job.location?.display_name || "Not specified",
    salary: formatSalary(job),
    applyUrl: job.redirect_url,
    description: truncate(job.description, 220),
  }));

  return { count: data.count ?? jobs.length, jobs };
}

export async function GET(request: NextRequest) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    const missing = [!appId && "ADZUNA_APP_ID", !appKey && "ADZUNA_APP_KEY"].filter(Boolean).join(", ");
    console.error(
      `[adzuna] Missing required environment variable(s): ${missing}. ` +
      `Set them in .env.local for development and in your Vercel project's Environment Variables ` +
      `(Production + Preview) for deployed environments. The job search API will return an empty ` +
      `result set until this is fixed — it will never fall back to mock data.`
    );
    return NextResponse.json(
      { count: 0, jobs: [], error: "Adzuna API credentials are not configured on the server." },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const what = (searchParams.get("what") || "").trim();
  const where = (searchParams.get("where") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const cacheKey = `${what.toLowerCase()}|${where.toLowerCase()}|${page}`;

  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  // Dedupe concurrent identical requests instead of hitting Adzuna twice.
  let pending = inFlightRequests.get(cacheKey);
  if (!pending) {
    pending = fetchAdzunaJobs(appId, appKey, what, where, page);
    inFlightRequests.set(cacheKey, pending);
  }

  try {
    const data = await pending;
    responseCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Adzuna API error:", error);
    // No mock/fallback data — a failed live request returns an empty result set.
    return NextResponse.json({ count: 0, jobs: [], error: "Failed to fetch job listings from Adzuna." });
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}
