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
  opportunities: Opportunity[]; // small curated list used by the Document Generator's opportunity picker
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
  handleWithdrawApplication: (appId: string | number) => void;
  handleSendMessage: (text: string) => void;
  handleClearChatHistory: () => void;
  handlePreloadDocDrawer: (opp: Opportunity) => void;
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
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
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

    const a = localStorage.getItem("application_records");
    if (a) setApplicationRecords(JSON.parse(a));

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
    setApplicationRecords([]);
    router.push("/");
  }, [persistProfile, router]);

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

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        opportunities,
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
        handleWithdrawApplication,
        handleSendMessage,
        handleClearChatHistory,
        handlePreloadDocDrawer,
        markAllNotificationsRead,
        persistProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
