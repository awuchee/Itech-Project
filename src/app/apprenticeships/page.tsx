"use client";

import { useApp } from "../../contexts/AppContext";
import HomeScreen from "../../components/HomeScreen";

export default function ApprenticeshipsPage() {
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
      defaultCategory="Apprenticeships"
      pageTitle="Apprenticeship Programmes"
      pageSubtitle="Earn while you learn with paid apprenticeships in tech, skilled trades, digital marketing, and business — open to all entry levels across the UK and Europe."
    />
  );
}
