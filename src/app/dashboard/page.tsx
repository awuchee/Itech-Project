"use client";

import { useApp } from "../../contexts/AppContext";
import UserDashboardScreen from "../../components/UserDashboardScreen";
import AuthScreen from "../../components/AuthScreen";

export default function DashboardPage() {
  const { userProfile, applicationRecords, persistProfile, handleWithdrawApplication, handleAuthSuccess } = useApp();

  if (!userProfile) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <UserDashboardScreen
      userProfile={userProfile}
      applicationRecords={applicationRecords}
      onSaveProfile={persistProfile}
      onWithdrawApplication={handleWithdrawApplication}
    />
  );
}
