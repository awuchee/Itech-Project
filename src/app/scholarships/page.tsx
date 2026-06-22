"use client";

import { useApp } from "../../contexts/AppContext";
import HomeScreen from "../../components/HomeScreen";

export default function ScholarshipsPage() {
  const {
    opportunities,
    userProfile,
    savedBookmarkIds,
    applicationRecords,
    handleToggleBookmark,
    handleApplyOpportunity,
    handlePreloadDocDrawer,
    handleAddReview,
  } = useApp();

  return (
    <HomeScreen
      opportunities={opportunities}
      userProfile={userProfile}
      savedBookmarkIds={savedBookmarkIds}
      onToggleBookmark={handleToggleBookmark}
      onApply={handleApplyOpportunity}
      applicationRecords={applicationRecords}
      onPreloadDoc={handlePreloadDocDrawer}
      onAddReview={handleAddReview}
      defaultCategory="Scholarships"
      pageTitle="Scholarship Opportunities"
      pageSubtitle="Find fully-funded scholarships, grants, and academic fellowships worldwide — including DAAD, Fulbright, Gates Cambridge, and more. No IELTS options available."
    />
  );
}
