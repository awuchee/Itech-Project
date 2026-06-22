export type OpportunityCategory = "Jobs" | "Scholarships" | "Apprenticeships" | "Nanny & Care";

export const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  "Jobs",
  "Scholarships",
  "Apprenticeships",
  "Nanny & Care",
];

/**
 * The single normalized shape every data source must produce. UI components
 * are written against this shape ONLY — they never branch on `source`.
 */
export interface UnifiedOpportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  category: OpportunityCategory;
  source: string; // "Adzuna" | "JSearch" | "Internal" | future sources
  applyUrl: string;
  postedAt: string; // ISO date string, or original source date string
  company?: string;
  salary?: string | null;
}

export interface OpportunitySearchParams {
  category: OpportunityCategory;
  what?: string;
  where?: string;
  page?: number;
}

export interface OpportunitySearchResult {
  count: number;
  opportunities: UnifiedOpportunity[];
  sourcesUsed: string[];
  error?: string;
}

/**
 * Contract every pluggable data source connector must implement so new
 * sources can be added without touching the service layer's dispatch logic.
 */
export interface OpportunitySource {
  name: string;
  search(params: OpportunitySearchParams): Promise<OpportunitySearchResult>;
}
