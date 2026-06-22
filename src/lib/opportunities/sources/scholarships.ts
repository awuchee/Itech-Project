import fs from "fs";
import path from "path";
import { OpportunitySearchParams, OpportunitySearchResult, UnifiedOpportunity } from "../types";
import { cacheOpportunities } from "../cache";

interface ScholarshipSeed {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  applyUrl: string;
  postedAt: string;
  description: string;
}

// The JSON file IS the database here, read fresh on every call. This is
// deliberate, not an optimization oversight: Next.js compiles every API
// route into its own separate bundle, each with its own copy of any
// module-level variable — an in-memory array would NOT be shared between
// /api/admin/scholarships and /api/opportunities/search even within a
// single dev server process, let alone across Vercel's serverless
// instances. Reading/writing the file keeps a single source of truth.
//
// PRODUCTION CAVEAT: Vercel's deployed filesystem is read-only outside
// /tmp, and /tmp is not shared or durable across invocations. So on Vercel,
// admin edits will succeed for the lifetime of the request/instance but are
// NOT guaranteed to persist or be visible platform-wide. For durable,
// globally consistent admin edits in production, swap the two functions
// below (readAll/writeAll) for a real database (e.g. Postgres/Supabase) —
// nothing else in the system needs to change, since this file is the only
// place that knows how scholarships are stored.
const DATA_FILE = path.join(process.cwd(), "src", "data", "scholarships.json");

function readAll(): ScholarshipSeed[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("[scholarships] Failed to read dataset file:", error);
    return [];
  }
}

function writeAll(scholarships: ScholarshipSeed[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(scholarships, null, 2), "utf-8");
  } catch (error) {
    console.error(
      "[scholarships] Failed to persist dataset file (expected on read-only filesystems like Vercel production):",
      error
    );
  }
}

function normalize(seed: ScholarshipSeed): UnifiedOpportunity {
  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    location: seed.location,
    category: "Scholarships",
    source: "Internal",
    applyUrl: seed.applyUrl,
    postedAt: seed.postedAt,
    company: seed.company,
    salary: seed.salary,
  };
}

function matches(seed: ScholarshipSeed, what: string, where: string): boolean {
  const haystack = `${seed.title} ${seed.company} ${seed.description}`.toLowerCase();
  const matchesWhat = !what || haystack.includes(what.toLowerCase());
  const matchesWhere = !where || seed.location.toLowerCase().includes(where.toLowerCase());
  return matchesWhat && matchesWhere;
}

export async function searchScholarships(params: OpportunitySearchParams): Promise<OpportunitySearchResult> {
  const what = (params.what || "").trim();
  const where = (params.where || "").trim();
  const page = Math.max(1, params.page || 1);
  const pageSize = 50;

  const all = readAll();
  const filtered = all.filter((s) => matches(s, what, where));
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize).map(normalize);

  cacheOpportunities(pageItems);

  return { count: filtered.length, opportunities: pageItems, sourcesUsed: ["Internal"] };
}

export function listAllScholarships(): UnifiedOpportunity[] {
  return readAll().map(normalize);
}

export function getScholarshipById(id: string): UnifiedOpportunity | null {
  const seed = readAll().find((s) => s.id === id);
  return seed ? normalize(seed) : null;
}

export interface ScholarshipInput {
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  applyUrl: string;
  description: string;
}

export function addScholarship(input: ScholarshipInput): UnifiedOpportunity {
  const all = readAll();
  const newSeed: ScholarshipSeed = {
    id: `sch-${Date.now()}`,
    title: input.title,
    company: input.company,
    location: input.location,
    salary: input.salary || null,
    applyUrl: input.applyUrl,
    postedAt: new Date().toISOString().split("T")[0],
    description: input.description,
  };
  writeAll([newSeed, ...all]);
  const normalized = normalize(newSeed);
  cacheOpportunities([normalized]);
  return normalized;
}

export function updateScholarship(id: string, patch: Partial<ScholarshipInput>): UnifiedOpportunity | null {
  const all = readAll();
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const existing = all[index];
  const updated: ScholarshipSeed = {
    ...existing,
    title: patch.title ?? existing.title,
    company: patch.company ?? existing.company,
    location: patch.location ?? existing.location,
    salary: patch.salary !== undefined ? patch.salary : existing.salary,
    applyUrl: patch.applyUrl ?? existing.applyUrl,
    description: patch.description ?? existing.description,
  };
  const next = [...all.slice(0, index), updated, ...all.slice(index + 1)];
  writeAll(next);
  const normalized = normalize(updated);
  cacheOpportunities([normalized]);
  return normalized;
}

export function deleteScholarship(id: string): boolean {
  const all = readAll();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}
