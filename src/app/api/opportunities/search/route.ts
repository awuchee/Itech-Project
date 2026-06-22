import { NextRequest, NextResponse } from "next/server";
import { searchOpportunities } from "../../../../lib/opportunities/service";
import { OPPORTUNITY_CATEGORIES, OpportunityCategory } from "../../../../lib/opportunities/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryParam = searchParams.get("category") as OpportunityCategory | null;

  if (!categoryParam || !OPPORTUNITY_CATEGORIES.includes(categoryParam)) {
    return NextResponse.json(
      { count: 0, opportunities: [], sourcesUsed: [], error: `Invalid or missing category. Must be one of: ${OPPORTUNITY_CATEGORIES.join(", ")}.` },
      { status: 400 }
    );
  }

  const what = searchParams.get("what") || "";
  const where = searchParams.get("where") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const result = await searchOpportunities({ category: categoryParam, what, where, page });
  return NextResponse.json(result);
}
