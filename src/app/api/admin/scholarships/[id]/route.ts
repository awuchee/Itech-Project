import { NextRequest, NextResponse } from "next/server";
import { deleteScholarship, updateScholarship } from "../../../../../lib/opportunities/sources/scholarships";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = updateScholarship(params.id, body || {});

  if (!updated) {
    return NextResponse.json({ error: "Scholarship not found." }, { status: 404 });
  }

  return NextResponse.json({ scholarship: updated });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const deleted = deleteScholarship(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Scholarship not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
