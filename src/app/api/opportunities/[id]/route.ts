import { NextRequest, NextResponse } from "next/server";
import { getCachedOpportunity } from "../../../../lib/opportunities/cache";
import { getScholarshipById } from "../../../../lib/opportunities/sources/scholarships";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Internal scholarships are always resolvable directly from the dataset —
  // no cache dependency needed since they don't come from an external API.
  if (id.startsWith("sch-")) {
    const scholarship = getScholarshipById(id);
    if (scholarship) return NextResponse.json({ opportunity: scholarship });
  }

  const cached = getCachedOpportunity(id);
  if (cached) {
    return NextResponse.json({ opportunity: cached });
  }

  return NextResponse.json(
    { error: "This opportunity is no longer cached. Please search again to view it." },
    { status: 404 }
  );
}
