import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  StatusBar,
  Platform
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Native screen elements
import HomeScreen from "./src/components/native/HomeScreen";
import AuthScreen from "./src/components/native/AuthScreen";
import UserDashboardScreen from "./src/components/native/UserDashboardScreen";
import AdminDashboardScreen from "./src/components/native/AdminDashboardScreen";
import AiChatbotScreen from "./src/components/native/AiChatbotScreen";
import AiDocsScreen from "./src/components/native/AiDocsScreen";
import CountryPagesScreen from "./src/components/native/CountryPagesScreen";

// Types and mock structures
import { Opportunity, UserProfile, ApplicationRecord, ChatMessage } from "./src/types";
import { MOCK_OPPORTUNITIES } from "./src/lib/mocks";
import { callGemini } from "./src/lib/gemini";

// Vector icons
import { 
  Home, 
  Globe, 
  BookOpen, 
  MessageSquare, 
  User, 
  ShieldAlert, 
  Bell, 
  X, 
  LogOut 
} from "lucide-react-native";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  
  // Bookmarks & local listings tracking
  const [savedBookmarkIds, setSavedBookmarkIds] = useState<(string | number)[]>([]);
  const [applicationRecords, setApplicationRecords] = useState<ApplicationRecord[]>([]);

  // AI Chat advisor states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);

  // Preloaded opportunity for Cover Letter writing
  const [preloadedOpportunity, setPreloadedOpportunity] = useState<Opportunity | null>(null);

  // Simulated notifications 
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [simulatedNotifications, setSimulatedNotifications] = useState([
    { id: 1, text: "Germany's Chancenkarte point limits updated in our pathways database.", date: "Just now", unread: true },
    { id: 2, text: "DAAD PhD scholarship application cycles are now live.", date: "1 hour ago", unread: true },
    { id: 3, text: "Your cover letter alignment is fully drafted in the generator buffer.", date: "Today", unread: false }
  ]);

  const notificationCount = simulatedNotifications.filter(n => n.unread).length;

  const handleAuthSuccess = (email: string, fullName: string, role: string) => {
    const newProfile: UserProfile = {
      email,
      fullName,
      role: email === "richardprempe@gmail.com" ? "ADMIN" : role,
      preferredCountry: "Any",
      preferredCategory: "Any"
    };

    if (email === "richardprempe@gmail.com") {
      setUserProfile({
        ...newProfile,
        fullName: "Richard Prempe",
        phone: "+33 6 1234 5678",
        education: "Masters in Artificial Intelligence",
        experience: "3+ years developing fullstack Cloud & Mobile systems",
        skills: "React Native, Expo, Kotlin, Jetpack Compose, Firebase, REST APIs",
        cvText: "Richard Prempe - Passionate fullstack software architect specializing in highly responsive multi-device cloud synchronization layouts."
      });
    } else {
      setUserProfile(newProfile);
    }
    
    setActiveTab("Home");

    // Welcome alerts push
    setSimulatedNotifications(prev => [
      { id: Date.now(), text: `Welcome to Global Hub, ${fullName}! Mobile credentials synchronized.`, date: "Just now", unread: true },
      ...prev
    ]);
  };

  const handleSignOut = () => {
    setUserProfile(null);
    setSavedBookmarkIds([]);
    setApplicationRecords([]);
    setActiveTab("Home");
  };

  const handleToggleBookmark = (id: string | number) => {
    if (!userProfile) {
      setActiveTab("Dashboard");
      return;
    }
    const updated = savedBookmarkIds.includes(id)
      ? savedBookmarkIds.filter(bid => bid !== id)
      : [...savedBookmarkIds, id];
    setSavedBookmarkIds(updated);
  };

  const handleApplyOpportunity = (opp: Opportunity, notes: string) => {
    if (!userProfile) {
      setActiveTab("Dashboard");
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

    setApplicationRecords([newRecord, ...applicationRecords]);

    setSimulatedNotifications(prev => [
      { id: Date.now(), text: `Submission logged! Applied for ${opp.title} at ${opp.organization}.`, date: "Just now", unread: true },
      ...prev
    ]);
  };

  const handleWithdrawApplication = (appId: string | number) => {
    setApplicationRecords(applicationRecords.filter(app => app.id !== appId));
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
        const updatedRating = Math.min(5, Math.max(1, (pastRating * 4 + score) / 5));
        return { ...opp, rating: updatedRating };
      }
      return opp;
    });
    setOpportunities(updated);
  };

  const handlePostOpportunity = (newOpp: Omit<Opportunity, "id">) => {
    const finalOpp: Opportunity = {
      ...newOpp,
      id: `opp_${Date.now()}`
    };

    setOpportunities([finalOpp, ...opportunities]);
  };

  const handleApproveOpportunity = (oppId: string | number) => {
    setOpportunities(opportunities.map((opp) => {
      if (opp.id === oppId) {
        return { ...opp, status: "APPROVED" };
      }
      return opp;
    }));
  };

  const handleRejectOpportunity = (oppId: string | number) => {
    setOpportunities(opportunities.filter((opp) => opp.id !== oppId));
  };

  const markAllNotificationsRead = () => {
    setSimulatedNotifications(simulatedNotifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ExpoStatusBar style="light" />
        {/* Customized Native Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Global Hub</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => setNotificationsOpen(true)}
              style={styles.notifBtn}
            >
              <Bell size={20} color="#cbd5e1" />
              {notificationCount > 0 && (
                <View style={styles.redBadge}>
                  <Text style={styles.redBadgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {userProfile && (
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <LogOut size={16} color="#fb7185" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tab body rendering */}
        <View style={styles.mainContent}>
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

          {activeTab === "Countries" && (
            <CountryPagesScreen />
          )}

          {activeTab === "Docs" && (
            <AiDocsScreen 
              userProfile={userProfile}
              opportunities={opportunities.filter(o => o.status === "APPROVED")}
              preloadedOpportunity={preloadedOpportunity}
              onClearPreload={() => setPreloadedOpportunity(null)}
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

          {activeTab === "Dashboard" && (
            userProfile ? (
              <UserDashboardScreen 
                userProfile={userProfile}
                applicationRecords={applicationRecords}
                onSaveProfile={setUserProfile}
                onWithdrawApplication={handleWithdrawApplication}
              />
            ) : (
              <AuthScreen onAuthSuccess={handleAuthSuccess} />
            )
          )}

          {activeTab === "Admin" && (
            userProfile?.role === "ADMIN" ? (
              <AdminDashboardScreen 
                opportunities={opportunities}
                userProfile={userProfile}
                onPostOpportunity={handlePostOpportunity}
                onApproveOpportunity={handleApproveOpportunity}
                onRejectOpportunity={handleRejectOpportunity}
              />
            ) : (
              <View style={styles.unauthBox}>
                <ShieldAlert size={48} color="#f43f5e" style={{ marginBottom: 16 }} />
                <Text style={styles.unauthTitle}>Shielded Moderator Panel</Text>
                <Text style={styles.unauthDesc}>
                  Access is barred by RBAC guidelines. Authenticate using an Admin profile first.
                </Text>
              </View>
            )
          )}
        </View>

        {/* Customized Navigation bar row at deep bottom */}
        <View style={styles.navbar}>
          <TouchableOpacity 
            style={[styles.navbarItem, activeTab === "Home" && styles.navbarItemActive]}
            onPress={() => setActiveTab("Home")}
          >
            <Home size={18} color={activeTab === "Home" ? "#818cf8" : "#94a3b8"} />
            <Text style={[styles.navbarLabel, activeTab === "Home" && styles.navbarLabelActive]}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navbarItem, activeTab === "Countries" && styles.navbarItemActive]}
            onPress={() => setActiveTab("Countries")}
          >
            <Globe size={18} color={activeTab === "Countries" ? "#818cf8" : "#94a3b8"} />
            <Text style={[styles.navbarLabel, activeTab === "Countries" && styles.navbarLabelActive]}>Countries</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navbarItem, activeTab === "Docs" && styles.navbarItemActive]}
            onPress={() => setActiveTab("Docs")}
          >
            <BookOpen size={18} color={activeTab === "Docs" ? "#818cf8" : "#94a3b8"} />
            <Text style={[styles.navbarLabel, activeTab === "Docs" && styles.navbarLabelActive]}>AI Docs</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navbarItem, activeTab === "Chat" && styles.navbarItemActive]}
            onPress={() => setActiveTab("Chat")}
          >
            <MessageSquare size={18} color={activeTab === "Chat" ? "#818cf8" : "#94a3b8"} />
            <Text style={[styles.navbarLabel, activeTab === "Chat" && styles.navbarLabelActive]}>AI Advisor</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navbarItem, (activeTab === "Dashboard" || activeTab === "Admin") && styles.navbarItemActive]}
            onPress={() => {
              if (userProfile?.role === "ADMIN") {
                setActiveTab("Admin");
              } else {
                setActiveTab("Dashboard");
              }
            }}
          >
            <User size={18} color={(activeTab === "Dashboard" || activeTab === "Admin") ? "#818cf8" : "#94a3b8"} />
            <Text style={[styles.navbarLabel, (activeTab === "Dashboard" || activeTab === "Admin") && styles.navbarLabelActive]}>
              {userProfile ? (userProfile.role === "ADMIN" ? "Admin" : "Me") : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Simulated Notifications Side-Modal Overlay */}
        {notificationsOpen && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={notificationsOpen}
            onRequestClose={() => setNotificationsOpen(false)}
          >
            <View style={styles.notifOverlay}>
              <View style={styles.notifPanel}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifHeaderTitle}>Live Alert Inbox</Text>
                  <TouchableOpacity onPress={() => setNotificationsOpen(false)}>
                    <X size={18} color="#ffffff" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.notifScroll}>
                  {simulatedNotifications.map((n) => (
                    <View 
                      key={n.id} 
                      style={[
                        styles.notifCard, 
                        n.unread && styles.notifCardUnread
                      ]}
                    >
                      <Text style={[styles.notifBodyText, n.unread && styles.notifBodyUnread]}>
                        {n.text}
                      </Text>
                      <Text style={styles.notifDateText}>{n.date}</Text>
                    </View>
                  ))}
                </ScrollView>

                {notificationCount > 0 && (
                  <TouchableOpacity 
                    onPress={markAllNotificationsRead} 
                    style={styles.markReadBtn}
                  >
                    <Text style={styles.markReadBtnLabel}>Mark all as read</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 54,
    backgroundColor: "#070d1e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  notifBtn: {
    padding: 8,
    position: "relative",
  },
  redBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#ef4444",
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  redBadgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },
  signOutButton: {
    padding: 8,
    marginLeft: 8,
  },
  mainContent: {
    flex: 1,
  },
  navbar: {
    height: 56,
    backgroundColor: "#070d1e",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    flexDirection: "row",
    alignItems: "center",
  },
  navbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  navbarItemActive: {
    backgroundColor: "rgba(99, 102, 241, 0.04)",
  },
  navbarLabel: {
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: "500",
    marginTop: 3,
  },
  navbarLabelActive: {
    color: "#a5b4fc",
    fontWeight: "bold",
  },
  unauthBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  unauthTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  unauthDesc: {
    color: "#64748b",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
  notifOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.8)",
    justifyContent: "flex-end",
  },
  notifPanel: {
    backgroundColor: "#0b1329",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "70%",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingBottom: 12,
    marginBottom: 16,
  },
  notifHeaderTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  notifScroll: {
    flex: 1,
  },
  notifCard: {
    backgroundColor: "#070d1e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  notifCardUnread: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  notifBodyText: {
    color: "#94a3b8",
    fontSize: 11,
    lineHeight: 16,
  },
  notifBodyUnread: {
    color: "#f1f5f9",
    fontWeight: "600",
  },
  notifDateText: {
    color: "#475569",
    fontSize: 8,
    marginTop: 4,
  },
  markReadBtn: {
    backgroundColor: "#6366f1",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  markReadBtnLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
});
