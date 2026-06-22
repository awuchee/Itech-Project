"use client";

import { useApp } from "../../contexts/AppContext";
import HomeScreen from "../../components/HomeScreen";

export default function JobsPage() {
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
      defaultCategory="Jobs Abroad"
      pageTitle="Global Job Board"
      pageSubtitle="Browse international remote and on-site jobs with visa sponsorship across tech, healthcare, finance, and more. Apply with AI-drafted cover letters."
    />
  );
}
