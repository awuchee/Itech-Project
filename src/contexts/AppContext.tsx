"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Opportunity, UserProfile, ApplicationRecord, ChatMessage } from "../types";
import { MOCK_OPPORTUNITIES } from "../lib/mocks";
import { callGemini } from "../lib/gemini";

interface Notification {
  id: number | string;
  text: string;
  date: string;
  unread: boolean;
}

interface AppContextValue {
  // State
  userProfile: UserProfile | null;
  opportunities: Opportunity[];
  savedBookmarkIds: (string | number)[];
  applicationRecords: ApplicationRecord[];
  chatMessages: ChatMessage[];
  isChatSending: boolean;
  preloadedOpportunity: Opportunity | null;
  notifications: Notification[];
  notificationsOpen: boolean;
  notificationCount: number;

  // Setters
  setNotificationsOpen: (open: boolean) => void;
  setPreloadedOpportunity: (opp: Opportunity | null) => void;

  // Handlers
  handleAuthSuccess: (email: string, fullName: string, role: string) => void;
  handleSignOut: () => void;
  handleToggleBookmark: (id: string | number) => void;
  handleApplyOpportunity: (opp: Opportunity, notes: string) => void;
  handleWithdrawApplication: (appId: string | number) => void;
  handleSendMessage: (text: string) => void;
  handleClearChatHistory: () => void;
  handlePreloadDocDrawer: (opp: Opportunity) => void;
  handleAddReview: (opportunityId: string | number, score: number) => void;
  handlePostOpportunity: (newOpp: Omit<Opportunity, "id">) => void;
  handleApproveOpportunity: (oppId: string | number) => void;
  handleRejectOpportunity: (oppId: string | number) => void;
  markAllNotificationsRead: () => void;
  persistProfile: (profile: UserProfile | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [savedBookmarkIds, setSavedBookmarkIds] = useState<(string | number)[]>([]);
  const [applicationRecords, setApplicationRecords] = useState<ApplicationRecord[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);
  const [preloadedOpportunity, setPreloadedOpportunity] = useState<Opportunity | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "Germany's Chancenkarte point limits updated in our pathways database.", date: "Just now", unread: true },
    { id: 2, text: "DAAD PhD scholarship application cycles are now live.", date: "1 hour ago", unread: true },
    { id: 3, text: "Your cover letter alignment is fully drafted in the generator buffer.", date: "Today", unread: false },
  ]);

  const notificationCount = notifications.filter((n) => n.unread).length;

  // Hydrate from localStorage on mount
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

  const persistProfile = useCallback((profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem("user_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("user_profile");
    }
  }, []);

  const handleAuthSuccess = useCallback((email: string, fullName: string, role: string) => {
    const base = {
      email,
      fullName,
      role: email === "richardprempe@gmail.com" ? "ADMIN" : role,
      preferredCountry: "Any",
      preferredCategory: "Any",
    };
    const profile =
      email === "richardprempe@gmail.com"
        ? {
            ...base,
            fullName: "Richard Prempe",
            phone: "+33 6 1234 5678",
            education: "Masters in Artificial Intelligence",
            experience: "3+ years developing fullstack Cloud & Mobile systems",
            skills: "Next.js, Kotlin, Compose, Firebase Firestore, REST APIs",
            cvText: "Richard Prempe - Passionate fullstack software architect.",
          }
        : base;

    persistProfile(profile);
    setNotifications((prev) => [
      { id: Date.now(), text: `Welcome to Global Opportunities Hub, ${profile.fullName}! Your dashboard is ready.`, date: "Just now", unread: true },
      ...prev,
    ]);
    router.push("/jobs");
  }, [persistProfile, router]);

  const handleSignOut = useCallback(() => {
    persistProfile(null);
    setSavedBookmarkIds([]);
    setApplicationRecords([]);
    router.push("/");
  }, [persistProfile, router]);

  const handleToggleBookmark = useCallback((id: string | number) => {
    if (!userProfile) { router.push("/login"); return; }
    setSavedBookmarkIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id];
      localStorage.setItem("saved_bookmarks", JSON.stringify(updated));
      return updated;
    });
  }, [userProfile, router]);

  const handleApplyOpportunity = useCallback((opp: Opportunity, notes: string) => {
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
    setApplicationRecords((prev) => {
      const updated = [newRecord, ...prev];
      localStorage.setItem("application_records", JSON.stringify(updated));
      return updated;
    });
    setNotifications((prev) => [
      { id: Date.now(), text: `Applied for ${opp.title} at ${opp.organization}.`, date: "Just now", unread: true },
      ...prev,
    ]);
  }, [userProfile, router]);

  const handleWithdrawApplication = useCallback((appId: string | number) => {
    setApplicationRecords((prev) => {
      const updated = prev.filter((app) => app.id !== appId);
      localStorage.setItem("application_records", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
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
  }, []);

  const handleClearChatHistory = useCallback(() => setChatMessages([]), []);

  const handlePreloadDocDrawer = useCallback((opp: Opportunity) => {
    localStorage.setItem("preloaded_opportunity", JSON.stringify(opp));
    router.push("/docs");
  }, [router]);

  const handleAddReview = useCallback((opportunityId: string | number, score: number) => {
    setOpportunities((prev) => {
      const updated = prev.map((opp) => {
        if (opp.id !== opportunityId) return opp;
        const past = opp.rating || 4.5;
        return { ...opp, rating: Math.min(5, Math.max(1, (past * 4 + score) / 5)) };
      });
      localStorage.setItem("custom_opportunities", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handlePostOpportunity = useCallback((newOpp: Omit<Opportunity, "id">) => {
    const finalOpp: Opportunity = { ...newOpp, id: `opp_${Date.now()}` };
    setOpportunities((prev) => {
      const updated = [finalOpp, ...prev];
      localStorage.setItem("custom_opportunities", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleApproveOpportunity = useCallback((oppId: string | number) => {
    setOpportunities((prev) => {
      const updated = prev.map((o) => o.id === oppId ? { ...o, status: "APPROVED" } : o);
      localStorage.setItem("custom_opportunities", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleRejectOpportunity = useCallback((oppId: string | number) => {
    setOpportunities((prev) => {
      const updated = prev.filter((o) => o.id !== oppId);
      localStorage.setItem("custom_opportunities", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        opportunities,
        savedBookmarkIds,
        applicationRecords,
        chatMessages,
        isChatSending,
        preloadedOpportunity,
        notifications,
        notificationsOpen,
        notificationCount,
        setNotificationsOpen,
        setPreloadedOpportunity,
        handleAuthSuccess,
        handleSignOut,
        handleToggleBookmark,
        handleApplyOpportunity,
        handleWithdrawApplication,
        handleSendMessage,
        handleClearChatHistory,
        handlePreloadDocDrawer,
        handleAddReview,
        handlePostOpportunity,
        handleApproveOpportunity,
        handleRejectOpportunity,
        markAllNotificationsRead,
        persistProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
