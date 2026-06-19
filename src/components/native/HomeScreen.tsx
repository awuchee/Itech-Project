import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal, 
  Linking
} from "react-native";
import { Opportunity, UserProfile, ApplicationRecord } from "../../types";
import { 
  Search, 
  MapPin, 
  Filter, 
  Bookmark, 
  ArrowUpRight, 
  Star, 
  Sparkles, 
  BookOpen, 
  X, 
  Check, 
  Clock, 
  Briefcase 
} from "lucide-react-native";

interface HomeScreenProps {
  opportunities: Opportunity[];
  userProfile: UserProfile | null;
  savedBookmarkIds: (string | number)[];
  onToggleBookmark: (opportunityId: string | number) => void;
  onApply: (opportunity: Opportunity, notes: string) => void;
  applicationRecords: ApplicationRecord[];
  onPreloadDoc: (opp: Opportunity) => void;
  onAddReview: (opportunityId: string | number, score: number) => void;
}

export default function HomeScreen({
  opportunities,
  userProfile,
  savedBookmarkIds,
  onToggleBookmark,
  onApply,
  applicationRecords,
  onPreloadDoc,
  onAddReview
}: HomeScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Any");
  const [selectedCategory, setSelectedCategory] = useState("Any");
  
  // Filter checkboxes
  const [fullyFundedOnly, setFullyFundedOnly] = useState(false);
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [noIeltsOnly, setNoIeltsOnly] = useState(false);
  const [govtSponsoredOnly, setGovtSponsoredOnly] = useState(false);

  // Selected opportunity for detail modal view
  const [detailOpp, setDetailOpp] = useState<Opportunity | null>(null);
  const [applyNotes, setApplyNotes] = useState("");
  const [showApplyPanel, setShowApplyPanel] = useState(false);
  const [hasAppliedForCurrent, setHasAppliedForCurrent] = useState(false);
  
  // Custom user rating score input state
  const [userRating, setUserRating] = useState<number>(5);

  // Lists for drop-downs
  const countriesList = useMemo(() => {
    const list = new Set(opportunities.map(o => o.country));
    return ["Any", ...Array.from(list)];
  }, [opportunities]);

  const categoriesList = useMemo(() => {
    const list = new Set(opportunities.map(o => o.category));
    return ["Any", ...Array.from(list)];
  }, [opportunities]);

  // Apply filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.status && opp.status === "PENDING" && userProfile?.role !== "ADMIN") {
        return false;
      }
      const matchSearch = 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.eligibility.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCountry = selectedCountry === "Any" || opp.country === selectedCountry;
      const matchCategory = selectedCategory === "Any" || opp.category === selectedCategory;

      const matchFunding = !fullyFundedOnly || opp.isFullyFunded;
      const matchVisa = !visaSponsorshipOnly || opp.visaSponsorship;
      const matchRemote = !remoteOnly || opp.remote;
      const matchIelts = !noIeltsOnly || opp.noIeltsRequired;
      const matchGovt = !govtSponsoredOnly || opp.govtSponsored;

      return matchSearch && matchCountry && matchCategory && matchFunding && matchVisa && matchRemote && matchIelts && matchGovt;
    });
  }, [
    opportunities, 
    searchTerm, 
    selectedCountry, 
    selectedCategory, 
    fullyFundedOnly, 
    visaSponsorshipOnly, 
    remoteOnly, 
    noIeltsOnly, 
    govtSponsoredOnly,
    userProfile
  ]);

  const checkHasApplied = (oppId: string | number) => {
    return applicationRecords.some(app => app.opportunityId === oppId);
  };

  const handleOpenDetail = (opp: Opportunity) => {
    setDetailOpp(opp);
    setHasAppliedForCurrent(checkHasApplied(opp.id));
    setShowApplyPanel(false);
    setApplyNotes("");
  };

  const executeApply = () => {
    if (!detailOpp) return;
    onApply(detailOpp, applyNotes);
    setHasAppliedForCurrent(true);
    setShowApplyPanel(false);
  };

  const handleRatingSubmit = (oppId: string | number) => {
    onAddReview(oppId, userRating);
    if (detailOpp && detailOpp.id === oppId) {
      setDetailOpp({
        ...detailOpp,
        rating: Math.min(5, Math.max(1, ((detailOpp.rating || 4.5) * 4 + userRating) / 5))
      });
    }
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error("Could not load link", err));
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Visual Hub Banner */}
      <View style={styles.banner}>
        <View style={styles.tagRow}>
          <Sparkles size={12} color="#818cf8" style={{ marginRight: 4 }} />
          <Text style={styles.tagText}>PORTAL SYNCHRONIZED</Text>
        </View>
        <Text style={styles.bannerTitle}>Discover Global Paths</Text>
        <Text style={styles.bannerSubtitle}>
          Real-time updates on visa sponsoring jobs, fully funded scholarships, and European chance cards in one unified place.
        </Text>
      </View>

      {/* Filter Options */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={16} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search titles, organizations, or criteria..."
            placeholderTextColor="#64748b"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>

        {/* Horizontal Filters Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterChip, fullyFundedOnly && styles.filterChipActive]} 
            onPress={() => setFullyFundedOnly(!fullyFundedOnly)}
          >
            <Text style={styles.filterChipText}>🎓 Fully Funded</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, visaSponsorshipOnly && styles.filterChipActive]} 
            onPress={() => setVisaSponsorshipOnly(!visaSponsorshipOnly)}
          >
            <Text style={styles.filterChipText}>💼 Sponsoring</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, remoteOnly && styles.filterChipActive]} 
            onPress={() => setRemoteOnly(!remoteOnly)}
          >
            <Text style={styles.filterChipText}>🌍 Remote</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, noIeltsOnly && styles.filterChipActive]} 
            onPress={() => setNoIeltsOnly(!noIeltsOnly)}
          >
            <Text style={styles.filterChipText}>🔤 No IELTS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterChip, govtSponsoredOnly && styles.filterChipActive]} 
            onPress={() => setGovtSponsoredOnly(!govtSponsoredOnly)}
          >
            <Text style={styles.filterChipText}>🏛️ Gov-Sponsored</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Catalog Grid */}
      <Text style={styles.sectionHeader}>
        Active Opportunities ({filteredOpportunities.length})
      </Text>

      {filteredOpportunities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Matching Paths Found</Text>
          <Text style={styles.emptySubtitle}>Refine your search parameters or query another mobility keyword.</Text>
        </View>
      ) : (
        filteredOpportunities.map((opp) => {
          const isBookmarked = savedBookmarkIds.includes(opp.id);
          const hasApplied = checkHasApplied(opp.id);
          return (
            <TouchableOpacity 
              key={opp.id} 
              style={styles.opportunityCard}
              onPress={() => handleOpenDetail(opp)}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardCategory}>{opp.category}</Text>
                  <Text style={styles.cardTitle}>{opp.title}</Text>
                  <Text style={styles.cardOrg}>{opp.organization}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => onToggleBookmark(opp.id)}
                  style={styles.bookmarkButton}
                >
                  <Bookmark size={18} color={isBookmarked ? "#6366f1" : "#94a3b8"} fill={isBookmarked ? "#6366f1" : "transparent"} />
                </TouchableOpacity>
              </View>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={12} color="#6366f1" style={{ marginRight: 4 }} />
                  <Text style={styles.detailText}>{opp.country}</Text>
                </View>
                {opp.fundingAmount && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailTextLabel}>Funding: </Text>
                    <Text style={styles.detailTextVal}>{opp.fundingAmount}</Text>
                  </View>
                )}
              </View>

              <View style={styles.badgeRow}>
                {opp.isFullyFunded && <Text style={[styles.badge, styles.badgeGreen]}>Fully Funded</Text>}
                {opp.visaSponsorship && <Text style={[styles.badge, styles.badgeBlue]}>Visa Sponsor</Text>}
                {opp.remote && <Text style={[styles.badge, styles.badgeIndigo]}>Remote</Text>}
                {opp.noIeltsRequired && <Text style={[styles.badge, styles.badgeAmber]}>No IELTS</Text>}
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.ratingRow}>
                  <Star size={14} color="#eab308" style={{ marginRight: 4 }} fill="#eab308" />
                  <Text style={styles.ratingText}>{(opp.rating || 4.5).toFixed(1)}</Text>
                </View>
                <View style={styles.applyAction}>
                  {hasApplied ? (
                    <Text style={styles.statusApplied}>Applied</Text>
                  ) : (
                    <View style={styles.learnMore}>
                      <Text style={styles.learnMoreText}>View details</Text>
                      <ArrowUpRight size={12} color="#818cf8" style={{ marginLeft: 3 }} />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* Details Modal */}
      {detailOpp && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={detailOpp !== null}
          onRequestClose={() => setDetailOpp(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Opportunity Explorer</Text>
                <TouchableOpacity onPress={() => setDetailOpp(null)} style={styles.closeBtn}>
                  <X size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalCategory}>{detailOpp.category}</Text>
                <Text style={styles.modalTitle}>{detailOpp.title}</Text>
                <Text style={styles.modalOrg}>{detailOpp.organization}</Text>

                <View style={styles.metaBox}>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color="#6366f1" />
                    <Text style={styles.metaLabel}>Country</Text>
                    <Text style={styles.metaValue}>{detailOpp.country}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#6366f1" />
                    <Text style={styles.metaLabel}>Deadline</Text>
                    <Text style={styles.metaValue}>{detailOpp.deadline}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Briefcase size={14} color="#6366f1" />
                    <Text style={styles.metaLabel}>Funding</Text>
                    <Text style={styles.metaValue}>{detailOpp.fundingAmount || "N/A"}</Text>
                  </View>
                </View>

                <Text style={styles.modalSectionHeader}>Overview & Outline</Text>
                <Text style={styles.modalBodyText}>{detailOpp.description}</Text>

                <Text style={styles.modalSectionHeader}>Candidate Eligibility</Text>
                <Text style={styles.modalBodyText}>{detailOpp.eligibility}</Text>

                <Text style={styles.modalSectionHeader}>Offer Benefits</Text>
                <Text style={styles.modalBodyText}>{detailOpp.benefits}</Text>

                {/* Submit Feedback Score */}
                <View style={styles.ratingSection}>
                  <Text style={styles.ratingTitle}>Community Rating & Reviews</Text>
                  <View style={styles.scoreStarsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <TouchableOpacity key={s} onPress={() => setUserRating(s)}>
                        <Star 
                          size={24} 
                          color="#fbbf24" 
                          fill={s <= userRating ? "#fbbf24" : "transparent"} 
                          style={{ marginRight: 6 }} 
                        />
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity 
                      onPress={() => handleRatingSubmit(detailOpp.id)}
                      style={styles.ratingSubmitBtn}
                    >
                      <Text style={styles.ratingSubmitLabel}>Rate</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {showApplyPanel ? (
                  <View style={styles.applyPanel}>
                    <Text style={styles.applyPanelLabel}>Application Cover Notes (Optional):</Text>
                    <TextInput
                      style={styles.applyTextInput}
                      placeholder="Input any additional context or note for compiling document letter buffers..."
                      placeholderTextColor="#475569"
                      multiline
                      value={applyNotes}
                      onChangeText={setApplyNotes}
                    />
                    <View style={styles.applyBtnGroup}>
                      <TouchableOpacity 
                        style={styles.applySecondaryBtn}
                        onPress={() => setShowApplyPanel(false)}
                      >
                        <Text style={styles.applySecondaryText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.applyPrimaryBtn}
                        onPress={executeApply}
                      >
                        <Text style={styles.applyPrimaryText}>Submit logs</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.actionBtnGroup}>
                    {hasAppliedForCurrent ? (
                      <View style={styles.appliedBanner}>
                        <Check size={16} color="#10b981" style={{ marginRight: 6 }} />
                        <Text style={styles.appliedBannerText}>Logged successfully on user dashboard.</Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.btnLogApp}
                        onPress={() => {
                          if (userProfile) {
                            setShowApplyPanel(true);
                          } else {
                            alert("Please authenticate inside Dashboard tab first.");
                          }
                        }}
                      >
                        <Text style={styles.btnText}>Quick Log Application</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity 
                      style={styles.btnOfficial}
                      onPress={() => handleOpenLink(detailOpp.officialLink)}
                    >
                      <Text style={styles.btnText}>Official Portal URL</Text>
                      <ArrowUpRight size={14} color="#ffffff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.btnPreloadDoc}
                  onPress={() => {
                    setDetailOpp(null);
                    onPreloadDoc(detailOpp);
                  }}
                >
                  <Sparkles size={14} color="#818cf8" style={{ marginRight: 6 }} />
                  <Text style={styles.btnPreloadDocText}>Preload AI Cover Letter Drafts</Text>
                </TouchableOpacity>

              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: "rgba(30, 27, 75, 0.6)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
    marginBottom: 10,
  },
  tagText: {
    color: "#a5b4fc",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  bannerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  bannerSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 18,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: "#f8fafc",
    fontSize: 13,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterChip: {
    backgroundColor: "#1e293b",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipActive: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    borderColor: "#6366f1",
  },
  filterChipText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "600",
  },
  sectionHeader: {
    color: "#f1f5f9",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    backgroundColor: "#0f172a",
  },
  emptyTitle: {
    color: "#f1f5f9",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  emptySubtitle: {
    color: "#64748b",
    fontSize: 11,
    textAlign: "center",
  },
  opportunityCard: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardCategory: {
    color: "#818cf8",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  cardOrg: {
    color: "#94a3b8",
    fontSize: 12,
  },
  bookmarkButton: {
    padding: 4,
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    color: "#cbd5e1",
    fontSize: 11,
  },
  detailTextLabel: {
    color: "#64748b",
    fontSize: 11,
  },
  detailTextVal: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "bold",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 9,
    fontWeight: "700",
    marginRight: 6,
    marginBottom: 6,
  },
  badgeGreen: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
  },
  badgeBlue: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    color: "#3b82f6",
  },
  badgeIndigo: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    color: "#818cf8",
  },
  badgeAmber: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    color: "#fbbf24",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: "bold",
  },
  applyAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusApplied: {
    color: "#10b981",
    fontSize: 11,
    fontWeight: "bold",
  },
  learnMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  learnMoreText: {
    color: "#818cf8",
    fontSize: 11,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0b1329",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "85%",
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalHeaderTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  closeBtn: {
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
  },
  modalScroll: {
    flex: 1,
  },
  modalCategory: {
    color: "#818cf8",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalOrg: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 16,
  },
  metaBox: {
    flexDirection: "row",
    backgroundColor: "#070d1e",
    borderRadius: 16,
    padding: 12,
    borderColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    marginBottom: 16,
  },
  metaItem: {
    flex: 1,
    alignItems: "center",
  },
  metaLabel: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 4,
  },
  metaValue: {
    color: "#f1f5f9",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 2,
    textAlign: "center",
  },
  modalSectionHeader: {
    color: "#818cf8",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 6,
  },
  modalBodyText: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  ratingSection: {
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginTop: 16,
    marginBottom: 20,
  },
  ratingTitle: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scoreStarsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingSubmitBtn: {
    marginLeft: "auto",
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingSubmitLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
  actionBtnGroup: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 10,
  },
  btnLogApp: {
    flex: 1.2,
    backgroundColor: "#6366f1",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  btnOfficial: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  appliedBanner: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    marginRight: 10,
  },
  appliedBannerText: {
    color: "#10b981",
    fontSize: 10,
    fontWeight: "bold",
  },
  btnPreloadDoc: {
    backgroundColor: "#070d1e",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 30,
  },
  btnPreloadDocText: {
    color: "#a5b4fc",
    fontSize: 12,
    fontWeight: "900",
  },
  applyPanel: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginTop: 16,
    marginBottom: 20,
  },
  applyPanelLabel: {
    color: "#f1f5f9",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  applyTextInput: {
    backgroundColor: "#070d1e",
    borderRadius: 10,
    padding: 10,
    height: 70,
    color: "#f1f5f9",
    fontSize: 11,
    textAlignVertical: "top",
    borderColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    marginBottom: 12,
  },
  applyBtnGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  applySecondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  applySecondaryText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "bold",
  },
  applyPrimaryBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  applyPrimaryText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
});
