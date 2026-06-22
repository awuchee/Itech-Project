"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingNavbar from "./LandingNavbar";
import LandingPage from "./LandingPage";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";
import AiChatbotScreen from "./AiChatbotScreen";
import AiDocsScreen from "./AiDocsScreen";
import CountryPagesScreen from "./CountryPagesScreen";
import UserDashboardScreen from "./UserDashboardScreen";
import AdminDashboardScreen from "./AdminDashboardScreen";
import AboutScreen from "./AboutScreen";
import ContactScreen from "./ContactScreen";

import { Opportunity, UserProfile, ApplicationRecord, ChatMessage } from "../types";
import { MOCK_OPPORTUNITIES } from "../lib/mocks";
import { callGemini } from "../lib/gemini";
import { BellRing, X, ShieldAlert } from "lucide-react";

interface AppShellProps {
  section: string;
}

export default function AppShell({ section }: AppShellProps) {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [savedBookmarkIds, setSavedBookmarkIds] = useState<(string | number)[]>([]);
  const [applicationRecords, setApplicationRecords] = useState<ApplicationRecord[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);
  const [preloadedOpportunity, setPreloadedOpportunity] = useState<Opportunity | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [simulatedNotifications, setSimulatedNotifications] = useState([
    { id: 1, text: "Germany's Chancenkarte point limits updated in our pathways database.", date: "Just now", unread: true },
    { id: 2, text: "DAAD PhD scholarship application cycles are now live.", date: "1 hour ago", unread: true },
    { id: 3, text: "Your cover letter alignment is fully drafted in the generator buffer.", date: "Today", unread: false },
  ]);

  const notificationCount = simulatedNotifications.filter((n) => n.unread).length;

  // Restore state from localStorage on every page mount
  useEffect(() => {
    const p = localStorage.getItem("user_profile");
    if (p) setUserProfile(JSON.parse(p));

    const b = localStorage.getItem("saved_bookmarks");
    if (b) setSavedBookmarkIds(JSON.parse(b));

    const a = localStorage.getItem("application_records");
    if (a) setApplicationRecords(JSON.parse(a));

    const o = localStorage.getItem("custom_opportunities");
    if (o) setOpportunities(JSON.parse(o));

    const pre = localStorage.getItem("preloaded_opportunity");
    if (pre) {
      setPreloadedOpportunity(JSON.parse(pre));
      localStorage.removeItem("preloaded_opportunity");
    }
  }, []);

  const persistProfile = (profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem("user_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user_profile");
    }
  };

  const handleAuthSuccess = (email: string, fullName: string, role: string) => {
    const newProfile = {
      email,
      fullName,
      role: email === "richardprempe@gmail.com" ? "ADMIN" : role,
      preferredCountry: "Any",
      preferredCategory: "Any",
    };
    persistProfile(newProfile);

    if (email === "richardprempe@gmail.com") {
      persistProfile({
        ...newProfile,
        fullName: "Richard Prempe",
        phone: "+33 6 1234 5678",
        education: "Masters in Artificial Intelligence",
        experience: "3+ years developing fullstack Cloud & Mobile systems",
        skills: "Next.js, Kotlin, Compose, Firebase Firestore, REST APIs",
        cvText: "Richard Prempe - Passionate fullstack software architect.",
      });
    }

    setSimulatedNotifications((prev) => [
      { id: Date.now(), text: `Welcome to Global Opportunities Hub, ${fullName}! Your dashboard is ready.`, date: "Just now", unread: true },
      ...prev,
    ]);
    router.push("/jobs");
  };

  const handleSignOut = () => {
    persistProfile(null);
    setSavedBookmarkIds([]);
    setApplicationRecords([]);
    router.push("/");
  };

  const handleToggleBookmark = (id: string | number) => {
    if (!userProfile) { router.push("/login"); return; }
    const updated = savedBookmarkIds.includes(id)
      ? savedBookmarkIds.filter((bid) => bid !== id)
      : [...savedBookmarkIds, id];
    setSavedBookmarkIds(updated);
    localStorage.setItem("saved_bookmarks", JSON.stringify(updated));
  };

  const handleApplyOpportunity = (opp: Opportunity, notes: string) => {
    if (!userProfile) { router.push("/login"); return; }
    const newRecord: ApplicationRecord = {
      id: `app_${Date.now()}`,
      userId: userProfile.email,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      organization: opp.organization,
      status: "Applied",
      appliedDate: new Date().toISOString().split("T")[0],
      notes,
    };
    const updated = [newRecord, ...applicationRecords];
    setApplicationRecords(updated);
    localStorage.setItem("application_records", JSON.stringify(updated));
    setSimulatedNotifications((prev) => [
      { id: Date.now(), text: `Applied for ${opp.title} at ${opp.organization}.`, date: "Just now", unread: true },
      ...prev,
    ]);
  };

  const handleWithdrawApplication = (appId: string | number) => {
    const updated = applicationRecords.filter((app) => app.id !== appId);
    setApplicationRecords(updated);
    localStorage.setItem("application_records", JSON.stringify(updated));
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatSending(true);
    try {
      const answer = await callGemini(text, "You are Hubbie AI, an advisor on global careers, visa programs, and international mobility.");
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: "ai",
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleClearChatHistory = () => setChatMessages([]);

  const handlePreloadDocDrawer = (opp: Opportunity) => {
    localStorage.setItem("preloaded_opportunity", JSON.stringify(opp));
    router.push("/docs");
  };

  const handleAddReview = (opportunityId: string | number, score: number) => {
    const updated = opportunities.map((opp) => {
      if (opp.id === opportunityId) {
        const past = opp.rating || 4.5;
        return { ...opp, rating: Math.min(5, Math.max(1, (past * 4 + score) / 5)) };
      }
      return opp;
    });
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  const handlePostOpportunity = (newOpp: Omit<Opportunity, "id">) => {
    const finalOpp: Opportunity = { ...newOpp, id: `opp_${Date.now()}` };
    const updated = [finalOpp, ...opportunities];
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  const handleApproveOpportunity = (oppId: string | number) => {
    const updated = opportunities.map((o) => o.id === oppId ? { ...o, status: "APPROVED" } : o);
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  const handleRejectOpportunity = (oppId: string | number) => {
    const updated = opportunities.filter((o) => o.id !== oppId);
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  const markAllNotificationsRead = () => {
    setSimulatedNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const isLanding = section === "landing";
  const approvedOpps = opportunities.filter((o) => o.status === "APPROVED" || o.status === "Active");

  return (
    <div className={`min-h-screen flex flex-col ${isLanding ? "bg-white" : "bg-slate-950 text-slate-100"}`}>

      {/* ── Always: white sticky LandingNavbar ── */}
      <LandingNavbar
        userProfile={userProfile}
        notificationCount={notificationCount}
        onSignOut={handleSignOut}
        setNotificationsOpen={setNotificationsOpen}
      />

      {/* ── Landing: full-width, no max-w ── */}
      {isLanding && (
        <LandingPage opportunities={opportunities} />
      )}

      {/* ── Inner pages ── */}
      {!isLanding && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">

          {section === "jobs" && (
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
          )}

          {(section === "scholarships" || section === "apprenticeships" || section === "nanny") && (
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
          )}

          {section === "chat" && (
            <AiChatbotScreen
              messages={chatMessages}
              isSending={isChatSending}
              onSendMessage={handleSendMessage}
              onClearHistory={handleClearChatHistory}
            />
          )}

          {section === "docs" && (
            <AiDocsScreen
              userProfile={userProfile}
              opportunities={approvedOpps}
              preloadedOpportunity={preloadedOpportunity}
              onClearPreload={() => setPreloadedOpportunity(null)}
            />
          )}

          {section === "countries" && <CountryPagesScreen />}

          {section === "dashboard" && (
            userProfile ? (
              <UserDashboardScreen
                userProfile={userProfile}
                applicationRecords={applicationRecords}
                onSaveProfile={persistProfile}
                onWithdrawApplication={handleWithdrawApplication}
              />
            ) : (
              <AuthScreen onAuthSuccess={handleAuthSuccess} />
            )
          )}

          {section === "admin" && (
            userProfile?.role === "ADMIN" || userProfile?.role === "RECRUITER" ? (
              <AdminDashboardScreen
                opportunities={opportunities}
                userProfile={userProfile}
                onPostOpportunity={handlePostOpportunity}
                onApproveOpportunity={handleApproveOpportunity}
                onRejectOpportunity={handleRejectOpportunity}
              />
            ) : (
              <div className="py-16 text-center max-w-sm mx-auto space-y-3">
                <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="font-extrabold text-white text-lg">Unauthorized Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This panel requires Admin or Recruiter access. Please sign in with an authorized account.
                </p>
              </div>
            )
          )}

          {section === "login" && (
            <AuthScreen onAuthSuccess={handleAuthSuccess} />
          )}

          {section === "about" && <AboutScreen />}
          {section === "contact" && <ContactScreen />}

        </main>
      )}

      {/* ── Inner pages footer ── */}
      {!isLanding && (
        <footer className="py-5 px-6 border-t border-white/5 bg-slate-950/40 text-center text-xs text-slate-500">
          © 2026 Global Opportunities Hub (GH) · Jobs · Scholarships · Apprenticeships · Nanny Placements
        </footer>
      )}

      {/* ── Notifications drawer ── */}
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
                <button onClick={() => setNotificationsOpen(false)} className="p-1 hover:bg-white/5 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
                {simulatedNotifications.map((n) => (
                  <div key={n.id} className={`p-3.5 rounded-xl border relative ${n.unread ? "bg-indigo-500/10 border-indigo-500/30 text-slate-200" : "bg-slate-950/20 border-white/5 text-slate-400"}`}>
                    {n.unread && <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-400 rounded-full" />}
                    <p className="text-xs leading-normal pr-4">{n.text}</p>
                    <span className="text-[9px] text-slate-500 block mt-1.5 font-bold">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-white/5">
              {notificationCount > 0 && (
                <button onClick={markAllNotificationsRead} className="w-full py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-black rounded-lg transition-all border border-indigo-500/20">
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
