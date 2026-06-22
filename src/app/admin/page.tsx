"use client";

import { ShieldAlert } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import AdminDashboardScreen from "../../components/AdminDashboardScreen";

export default function AdminPage() {
  const { userProfile } = useApp();

  if (userProfile?.role !== "ADMIN" && userProfile?.role !== "RECRUITER") {
    return (
      <div className="py-16 text-center max-w-sm mx-auto space-y-3">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="font-extrabold text-white text-lg">Unauthorized Access</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          This panel requires Admin or Recruiter access. Please sign in with an authorized account.
        </p>
      </div>
    );
  }

  return <AdminDashboardScreen />;
}
