import { NextRequest, NextResponse } from "next/server";
import { addScholarship, listAllScholarships } from "../../../../lib/opportunities/sources/scholarships";

export async function GET() {
  return NextResponse.json({ scholarships: listAllScholarships() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, company, location, salary, applyUrl, description } = body || {};

  if (!title || !company || !location || !applyUrl || !description) {
    return NextResponse.json(
      { error: "title, company, location, applyUrl, and description are required." },
      { status: 400 }
    );
  }

  const created = addScholarship({ title, company, location, salary, applyUrl, description });
  return NextResponse.json({ scholarship: created }, { status: 201 });
}
