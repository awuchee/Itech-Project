"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import LandingNavbar from "../components/LandingNavbar";
import LandingPage from "../components/LandingPage";
import AuthScreen from "../components/AuthScreen";
import HomeScreen from "../components/HomeScreen";
import AiChatbotScreen from "../components/AiChatbotScreen";
import AiDocsScreen from "../components/AiDocsScreen";
import CountryPagesScreen from "../components/CountryPagesScreen";
import UserDashboardScreen from "../components/UserDashboardScreen";
import AdminDashboardScreen from "../components/AdminDashboardScreen";

import { Opportunity, UserProfile, ApplicationRecord, ChatMessage } from "../types";
import { MOCK_OPPORTUNITIES } from "../lib/mocks";
import { callGemini } from "../lib/gemini";
import { BellRing, Sparkles, X, Check, ShieldAlert, AlertTriangle } from "lucide-react";

export default function RootPage() {
  const [activeTab, setActiveTab] = useState<string>("Landing");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Opportunities state (seeded with mock list originally)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  
  // Bookmarks & application lists
  const [savedBookmarkIds, setSavedBookmarkIds] = useState<(string | number)[]>([]);
  const [applicationRecords, setApplicationRecords] = useState<ApplicationRecord[]>([]);

  // AI Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);

  // Preloaded opportunity for Cover Letter drafting
  const [preloadedOpportunity, setPreloadedOpportunity] = useState<Opportunity | null>(null);

  // Push notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [simulatedNotifications, setSimulatedNotifications] = useState([
    { id: 1, text: "Germany's Chancenkarte point limits updated in our pathways database.", date: "Just now", unread: true },
    { id: 2, text: "DAAD PhD scholarship application cycles are now live.", date: "1 hour ago", unread: true },
    { id: 3, text: "Your cover letter alignment is fully drafted in the generator buffer.", date: "Today", unread: false }
  ]);
  
  const notificationCount = simulatedNotifications.filter(n => n.unread).length;

  // Restore session from localStorage on startup
  useEffect(() => {
    const cachedProfile = localStorage.getItem("user_profile");
    if (cachedProfile) {
      setUserProfile(JSON.parse(cachedProfile));
    }

    const cachedBookmarks = localStorage.getItem("saved_bookmarks");
    if (cachedBookmarks) {
      setSavedBookmarkIds(JSON.parse(cachedBookmarks));
    }

    const cachedApplications = localStorage.getItem("application_records");
    if (cachedApplications) {
      setApplicationRecords(JSON.parse(cachedApplications));
    }

    const cachedOpportunities = localStorage.getItem("custom_opportunities");
    if (cachedOpportunities) {
      setOpportunities(JSON.parse(cachedOpportunities));
    }
  }, []);

  // Save updates to localStorage
  const persistProfile = (profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem("user_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user_profile");
    }
  };

  const handleAuthSuccess = (email: string, fullName: string, role: string) => {
    const newProfile: UserProfileObj = {
      email,
      fullName,
      role: email === "richardprempe@gmail.com" ? "ADMIN" : role,
      preferredCountry: "Any",
      preferredCategory: "Any"
    };
    persistProfile(newProfile);
    
    // Auto sync preset details for Richard Prempe to ease onboarding
    if (email === "richardprempe@gmail.com") {
      persistProfile({
        ...newProfile,
        fullName: "Richard Prempe",
        phone: "+33 6 1234 5678",
        education: "Masters in Artificial Intelligence",
        experience: "3+ years developing fullstack Cloud & Mobile systems",
        skills: "Next.js, Kotlin, Compose, Firebase Firestore, REST APIs",
        cvText: "Richard Prempe - Passionate fullstack software architect specializing in highly responsive multi-device cloud synchronization layouts."
      });
    }

    setActiveTab("Home");
    
    // Push welcome simulated notification
    setSimulatedNotifications(prev => [
      { id: Date.now(), text: `Welcome to Global Hub, ${fullName}! Portal synchronized.`, date: "Just now", unread: true },
      ...prev
    ]);
  };

  const handleSignOut = () => {
    persistProfile(null);
    setSavedBookmarkIds([]);
    setApplicationRecords([]);
    setActiveTab("Home");
  };

  const handleToggleBookmark = (id: string | number) => {
    if (!userProfile) {
      setActiveTab("Login");
      return;
    }
    const updated = savedBookmarkIds.includes(id)
      ? savedBookmarkIds.filter(bid => bid !== id)
      : [...savedBookmarkIds, id];
    setSavedBookmarkIds(updated);
    localStorage.setItem("saved_bookmarks", JSON.stringify(updated));
  };

  const handleApplyOpportunity = (opp: Opportunity, notes: string) => {
    if (!userProfile) {
      setActiveTab("Login");
      return;
    }

    const newRecord: ApplicationRecord = {
      id: `app_${Date.now()}`,
      userId: userProfile.email,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      organization: opp.organization,
      status: "Applied",
      appliedDate: new Date().toISOString().split("T")[0],
      notes
    };

    const updated = [newRecord, ...applicationRecords];
    setApplicationRecords(updated);
    localStorage.setItem("application_records", JSON.stringify(updated));

    // Register simulated notification
    setSimulatedNotifications(prev => [
      { id: Date.now(), text: `Submission logged! Applied for ${opp.title} at ${opp.organization}.`, date: "Just now", unread: true },
      ...prev
    ]);
  };

  const handleWithdrawApplication = (appId: string | number) => {
    const updated = applicationRecords.filter(app => app.id !== appId);
    setApplicationRecords(updated);
    localStorage.setItem("application_records", JSON.stringify(updated));
  };

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setIsChatSending(true);

    try {
      const systemContext = "You are Hubbie AI, an advisor on global careers, chance-cards points checkpoints, and CV guides.";
      const answer = await callGemini(text, systemContext);
      
      const newBotMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: "ai",
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, newBotMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleClearChatHistory = () => {
    setChatMessages([]);
  };

  const handlePreloadDocDrawer = (opp: Opportunity) => {
    setPreloadedOpportunity(opp);
    setActiveTab("Docs");
  };

  const handleAddReview = (opportunityId: string | number, score: number) => {
    const updated = opportunities.map((opp) => {
      if (opp.id === opportunityId) {
        const pastRating = opp.rating || 4.5;
        // Balance average score mathematically
        const updatedRating = Math.min(5, Math.max(1, (pastRating * 4 + score) / 5));
        return { ...opp, rating: updatedRating };
      }
      return opp;
    });
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  // Admin moderation mechanics
  const handlePostOpportunity = (newOpp: Omit<Opportunity, "id">) => {
    const finalOpp: Opportunity = {
      ...newOpp,
      id: `opp_${Date.now()}`
    };

    const updated = [finalOpp, ...opportunities];
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  const handleApproveOpportunity = (oppId: string | number) => {
    const updated = opportunities.map((opp) => {
      if (opp.id === oppId) {
        return { ...opp, status: "APPROVED" };
      }
      return opp;
    });
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  const handleRejectOpportunity = (oppId: string | number) => {
    const updated = opportunities.filter((opp) => opp.id !== oppId);
    setOpportunities(updated);
    localStorage.setItem("custom_opportunities", JSON.stringify(updated));
  };

  const markAllNotificationsRead = () => {
    setSimulatedNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const isLanding = activeTab === "Landing";

  return (
    <div className={`min-h-screen flex flex-col ${isLanding ? "bg-white" : "bg-slate-950 text-slate-100"}`}>

      {/* ── Landing page: white nav ── */}
      {isLanding ? (
        <LandingNavbar
          userProfile={userProfile}
          notificationCount={notificationCount}
          setActiveTab={setActiveTab}
          onSignOut={handleSignOut}
          setNotificationsOpen={setNotificationsOpen}
        />
      ) : (
        <>
          {/* Upper header */}
          <Header
            userProfile={userProfile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSignOut={handleSignOut}
          />
          {/* Navigation tabs row */}
          <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userProfile={userProfile}
            notificationCount={notificationCount}
            setNotificationsOpen={setNotificationsOpen}
          />
        </>
      )}

      {/* ── Landing page: full-width, no max-w wrapper ── */}
      {isLanding && (
        <LandingPage
          setActiveTab={setActiveTab}
          opportunities={opportunities}
        />
      )}

      {/* Active page workspace */}
      {!isLanding && (
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {activeTab === "Home" && (
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

        {activeTab === "Chat" && (
          <AiChatbotScreen 
            messages={chatMessages}
            isSending={isChatSending}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearChatHistory}
          />
        )}

        {activeTab === "Docs" && (
          <AiDocsScreen 
            userProfile={userProfile}
            opportunities={opportunities.filter(o => o.status === "APPROVED" || o.status === "Active")}
            preloadedOpportunity={preloadedOpportunity}
            onClearPreload={() => setPreloadedOpportunity(null)}
          />
        )}

        {activeTab === "Countries" && (
          <CountryPagesScreen />
        )}

        {activeTab === "Dashboard" && (
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

        {activeTab === "Admin" && (
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
              <h3 className="font-extrabold text-white text-lg">Unauthorized Route Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Moderator and Admin panels are shielded by RBAC checks. Please log out and sign in using a registered Admin profile.
              </p>
            </div>
          )
        )}

        {activeTab === "Login" && (
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
      )}

      {/* Floating Push Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setNotificationsOpen(false)}></div>
          
          <div className="relative max-w-sm w-full h-full bg-slate-900 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl z-20 animate-slide-in">
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

              {simulatedNotifications.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 font-semibold">
                  No active push alerts reported.
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1 scrollbar">
                  {simulatedNotifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-3.5 rounded-xl border relative ${
                        n.unread 
                          ? "bg-indigo-500/10 border-indigo-500/30 text-slate-200" 
                          : "bg-slate-950/20 border-white/5 text-slate-400"
                      }`}
                    >
                      {n.unread && (
                        <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-400 rounded-full"></span>
                      )}
                      <p className="text-xs leading-normal pr-4">{n.text}</p>
                      <span className="text-[9px] text-slate-500 block mt-1.5 font-bold">{n.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              {notificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="w-full py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-black rounded-lg transition-all border border-indigo-500/20 text-center"
                >
                  Mark all alerts as read
                </button>
              )}
              <div className="text-[10px] text-slate-500 text-center leading-normal">
                Push status: Simulated on local state for web environments. Handled via ServiceWorkers on production deployment plans.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled Footer — dark app pages only */}
      {!isLanding && (
        <footer className="py-6 px-6 border-t border-white/5 bg-slate-950/40 text-center text-xs text-slate-500">
          <p>© 2026 Global Opportunities Hub. Designed for high fidelity cross-device synchronization.</p>
        </footer>
      )}
    </div>
  );
}

type UserProfileObj = Omit<UserProfile, "email"> & { email: string };
