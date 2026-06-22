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
    />
  );
}
