"use client";

import React from "react";
import { UserProfile } from "../types";
import { LogOut, Globe, User, ShieldAlert, Sparkles } from "lucide-react";

interface HeaderProps {
  userProfile: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSignOut: () => void;
}

export default function Header({ userProfile, activeTab, setActiveTab, onSignOut }: HeaderProps) {
  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10 shadow-lg">
      <div 
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setActiveTab("Home")}
      >
        <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-500/20">
          <Globe className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Global Opportunities Hub
          </h1>
          <p className="text-xs text-slate-400 font-medium">Your passport to global careers</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {userProfile ? (
          <div className="flex items-center space-x-3">
            {/* Role-based badge */}
            {userProfile.role === "ADMIN" && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-3" />
                <span className="ml-1 text-rose-300">Admin</span>
              </span>
            )}
            {userProfile.role === "RECRUITER" && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3" />
                <span className="ml-1 text-emerald-300">Recruiter</span>
              </span>
            )}
            {userProfile.role === "CANDIDATE" && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <User className="w-3" />
                <span className="ml-1 text-indigo-300">Candidate</span>
              </span>
            )}

            <div 
              className="text-right cursor-pointer"
              onClick={() => setActiveTab("Dashboard")}
            >
              <div className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                {userProfile.fullName || "User Account"}
              </div>
              <div className="text-xs text-slate-400 truncate max-w-[150px]">
                {userProfile.email}
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveTab("Login")}
            className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
