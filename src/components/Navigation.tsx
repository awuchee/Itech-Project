"use client";

import React from "react";
import { 
  Home, 
  MessageSquare, 
  FileSignature, 
  Compass, 
  UserCheck, 
  Settings,
  Bell
} from "lucide-react";
import { UserProfile } from "../types";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  notificationCount: number;
  setNotificationsOpen: (open: boolean) => void;
}

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  userProfile, 
  notificationCount,
  setNotificationsOpen
}: NavigationProps) {
  
  const navItems = [
    { id: "Home", label: "Discover", icon: Home },
    { id: "Chat", label: "AI Advisor", icon: MessageSquare },
    { id: "Docs", label: "Credential Drafter", icon: FileSignature },
    { id: "Countries", label: "Pathways Hub", icon: Compass },
    { id: "Dashboard", label: "Console", icon: UserCheck },
  ];

  // Show Admin console if admin or recruiter
  const hasManagementAccess = userProfile?.role === "ADMIN" || userProfile?.role === "RECRUITER";

  return (
    <div className="w-full bg-slate-900/90 border-b border-white/5 py-2 px-6 flex items-center justify-between overflow-x-auto whitespace-nowrap">
      <div className="flex space-x-2 md:space-x-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive 
                  ? "bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {hasManagementAccess && (
          <button
            onClick={() => setActiveTab("Admin")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "Admin"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span>Moderator Panel</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 text-slate-400 hover:text-indigo-400 rounded-lg transition-transform hover:scale-105"
          title="Push Alerts"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
