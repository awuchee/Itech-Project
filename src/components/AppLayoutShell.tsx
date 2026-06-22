"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BellRing, X } from "lucide-react";
import LandingNavbar from "./LandingNavbar";
import { useApp } from "../contexts/AppContext";

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const {
    userProfile,
    notificationCount,
    notifications,
    notificationsOpen,
    setNotificationsOpen,
    handleSignOut,
    markAllNotificationsRead,
  } = useApp();

  return (
    <div className={`min-h-screen flex flex-col ${isLanding ? "bg-white" : "bg-slate-950 text-slate-100"}`}>

      {/* Persistent white navbar on every page */}
      <LandingNavbar
        userProfile={userProfile}
        notificationCount={notificationCount}
        onSignOut={handleSignOut}
        setNotificationsOpen={setNotificationsOpen}
      />

      {/* Page content */}
      {isLanding ? (
        <div className="flex-1">{children}</div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
          {children}
        </main>
      )}

      {/* Footer — inner pages only */}
      {!isLanding && (
        <footer className="py-5 px-6 border-t border-white/5 bg-slate-950/40 text-center text-xs text-slate-500">
          © 2026 Global Opportunities Hub (GH) · Jobs · Scholarships · Apprenticeships · Nanny Placements
        </footer>
      )}

      {/* Notifications drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setNotificationsOpen(false)}
          />
          <div className="relative max-w-sm w-full h-full bg-slate-900 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl z-20">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <BellRing className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-black text-white">Live Push Alerts</h3>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 hover:bg-white/5 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border relative ${
                      n.unread
                        ? "bg-indigo-500/10 border-indigo-500/30 text-slate-200"
                        : "bg-slate-950/20 border-white/5 text-slate-400"
                    }`}
                  >
                    {n.unread && <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-400 rounded-full" />}
                    <p className="text-xs leading-normal pr-4">{n.text}</p>
                    <span className="text-[9px] text-slate-500 block mt-1.5 font-bold">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              {notificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="w-full py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-black rounded-lg transition-all border border-indigo-500/20"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
