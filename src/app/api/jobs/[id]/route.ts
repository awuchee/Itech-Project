import { NextRequest, NextResponse } from "next/server";
import { getCachedJob } from "../../../../lib/jobsCache";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const job = getCachedJob(params.id);

  if (!job) {
    return NextResponse.json(
      { error: "This job listing is no longer cached. Please search again to view it." },
      { status: 404 }
    );
  }

  return NextResponse.json({ job });
}
