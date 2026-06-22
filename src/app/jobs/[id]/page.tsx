import { redirect } from "next/navigation";

// Legacy route from before opportunities were unified across categories.
// Old job IDs were raw Adzuna ad IDs; the unified cache now prefixes them
// with "adzuna-", so translate old links to the new ID scheme.
export default function LegacyJobDetailPage({ params }: { params: { id: string } }) {
  const id = params.id.startsWith("adzuna-") ? params.id : `adzuna-${params.id}`;
  redirect(`/opportunities/${id}`);
}
