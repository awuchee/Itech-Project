import { OpportunityCategory, OpportunitySearchResult, UnifiedOpportunity } from "../types";
import { cacheOpportunities } from "../cache";

const JSEARCH_URL = "https://jsearch.p.rapidapi.com/search";
const JSEARCH_HOST = "jsearch.p.rapidapi.com";
const PAGE_SIZE = 10; // JSearch returns ~10 results per page unit

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name?: string;
  job_city?: string;
  job_country?: string;
  job_description?: string;
  job_apply_link: string;
  job_posted_at_datetime_utc?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
}

function formatSalary(job: JSearchJob): string | null {
  const currency = job.job_salary_currency || "";
  if (!job.job_min_salary && !job.job_max_salary) return null;
  if (job.job_min_salary && job.job_max_salary && job.job_min_salary !== job.job_max_salary) {
    return `${currency} ${Math.round(job.job_min_salary).toLocaleString()} – ${Math.round(job.job_max_salary).toLocaleString()}`.trim();
  }
  const value = job.job_min_salary || job.job_max_salary;
  return value ? `${currency} ${Math.round(value).toLocaleString()}`.trim() : null;
}

function normalize(job: JSearchJob, category: OpportunityCategory): UnifiedOpportunity {
  return {
    id: `jsearch-${job.job_id}`,
    title: job.job_title,
    description: (job.job_description || "").trim(),
    location: [job.job_city, job.job_country].filter(Boolean).join(", ") || "Not specified",
    category,
    source: "JSearch",
    applyUrl: job.job_apply_link,
    postedAt: job.job_posted_at_datetime_utc || new Date().toISOString(),
    company: job.employer_name || "Unknown Company",
    salary: formatSalary(job),
  };
}

export interface JSearchOptions {
  category: OpportunityCategory;
  what?: string;
  where?: string;
  page?: number;
  keywordOr?: string; // used as a fallback search phrase when no explicit `what`
}

/**
 * Backup source for Jobs / Apprenticeships / Nanny & Care. Only invoked by
 * the service layer when the primary source (Adzuna) fails. Throws on
 * missing credentials or upstream failure — callers must handle gracefully
 * and never substitute mock data.
 */
export async function searchJSearch(options: JSearchOptions): Promise<OpportunitySearchResult> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    console.error(
      "[jsearch] Missing RAPIDAPI_KEY environment variable. JSearch backup is unavailable until this is set " +
      "in .env.local (development) or Vercel Environment Variables (production)."
    );
    throw new Error("JSearch credentials are not configured.");
  }

  const page = Math.max(1, options.page || 1);
  const queryParts = [options.what?.trim() || options.keywordOr?.trim() || "jobs"];
  if (options.where?.trim()) queryParts.push(`in ${options.where.trim()}`);
  const query = queryParts.join(" ");

  const url = new URL(JSEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("num_pages", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": JSEARCH_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`JSearch API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const jobs: JSearchJob[] = data.data || [];
  const opportunities = jobs.map((job) => normalize(job, options.category));

  cacheOpportunities(opportunities);

  // JSearch doesn't return a total count — approximate so pagination still works.
  const count = jobs.length === PAGE_SIZE ? page * PAGE_SIZE + 1 : (page - 1) * PAGE_SIZE + jobs.length;

  return { count, opportunities, sourcesUsed: ["JSearch"] };
}
