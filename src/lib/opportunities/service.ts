import { OpportunityCategory, OpportunitySearchParams, OpportunitySearchResult } from "./types";
import { searchAdzuna } from "./sources/adzuna";
import { searchJSearch } from "./sources/jsearch";
import { searchScholarships } from "./sources/scholarships";

// Default OR-matched keyword sets used when the user hasn't typed a custom
// search term for these two categories — this is how "Apprenticeships" and
// "Nanny & Care" are derived as FILTERS over the same job APIs, not separate
// systems with their own data.
const CATEGORY_KEYWORDS: Partial<Record<OpportunityCategory, string>> = {
  Apprenticeships: "apprentice trainee internship training vocational",
  "Nanny & Care": "nanny caregiver childcare elderly care home care support worker",
};

async function searchJobLikeCategory(
  category: OpportunityCategory,
  params: OpportunitySearchParams
): Promise<OpportunitySearchResult> {
  const keywordOr = CATEGORY_KEYWORDS[category];

  try {
    return await searchAdzuna({ category, what: params.what, where: params.where, page: params.page, keywordOr });
  } catch (primaryError) {
    console.error(`[opportunities] Primary source (Adzuna) failed for category "${category}":`, primaryError);
  }

  try {
    const backup = await searchJSearch({ category, what: params.what, where: params.where, page: params.page, keywordOr });
    return backup;
  } catch (backupError) {
    console.error(`[opportunities] Backup source (JSearch) also failed for category "${category}":`, backupError);
  }

  // Both sources failed — return an empty result, never mock data.
  return {
    count: 0,
    opportunities: [],
    sourcesUsed: [],
    error: "Live opportunity sources are temporarily unavailable. Please try again shortly.",
  };
}

/**
 * Single entry point the API layer calls. The UI only ever knows about
 * `category` — it never knows or cares which source(s) backed the results.
 * Add a new source by writing a connector + wiring it in here; no other
 * file needs to change.
 */
export async function searchOpportunities(params: OpportunitySearchParams): Promise<OpportunitySearchResult> {
  switch (params.category) {
    case "Scholarships":
      return searchScholarships(params);
    case "Jobs":
    case "Apprenticeships":
    case "Nanny & Care":
      return searchJobLikeCategory(params.category, params);
    default:
      return { count: 0, opportunities: [], sourcesUsed: [], error: "Unknown category." };
  }
}
