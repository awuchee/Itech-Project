"use client";

import { useApp } from "../../contexts/AppContext";
import HomeScreen from "../../components/HomeScreen";

export default function NannyPage() {
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
      defaultCategory="Nanny & Care"
      pageTitle="Nanny & Care Placements"
      pageSubtitle="Connect with verified families worldwide for au pair, live-in nanny, newborn care, and travel nanny roles. All placements include background checks and visa support."
    />
  );
}
