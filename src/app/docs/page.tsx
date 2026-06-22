"use client";

import { useApp } from "../../contexts/AppContext";
import AiDocsScreen from "../../components/AiDocsScreen";

export default function DocsPage() {
  const { userProfile, opportunities, preloadedOpportunity, setPreloadedOpportunity } = useApp();
  const approved = opportunities.filter((o) => o.status === "APPROVED" || o.status === "Active");

  return (
    <AiDocsScreen
      userProfile={userProfile}
      opportunities={approved}
      preloadedOpportunity={preloadedOpportunity}
      onClearPreload={() => setPreloadedOpportunity(null)}
    />
  );
}
