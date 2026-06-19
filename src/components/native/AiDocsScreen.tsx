import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
  Share,
  Platform
} from "react-native";
import { UserProfile, Opportunity } from "../../types";
import { FileText, Sparkles, AlertTriangle, ArrowUpRight, Copy, Share2, X } from "lucide-react-native";
import { callGemini } from "../../lib/gemini";

interface AiDocsScreenProps {
  userProfile: UserProfile | null;
  opportunities: Opportunity[];
  preloadedOpportunity: Opportunity | null;
  onClearPreload: () => void;
}

export default function AiDocsScreen({
  userProfile,
  opportunities,
  preloadedOpportunity,
  onClearPreload
}: AiDocsScreenProps) {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | number>("");
  const [docType, setDocType] = useState<"CV" | "COVER_LETTER" | "MON_LETTER">("COVER_LETTER");
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResult, setCompiledResult] = useState<string>("");

  useEffect(() => {
    if (preloadedOpportunity) {
      setSelectedOpportunityId(preloadedOpportunity.id);
    }
  }, [preloadedOpportunity]);

  const activeOpp = opportunities.find(o => o.id.toString() === selectedOpportunityId.toString()) || preloadedOpportunity;

  const handleGenerate = async () => {
    if (!userProfile) {
      Alert.alert("Authentication Needed", "Please log in on the Dashboard tab to pull credentials first!");
      return;
    }

    setIsCompiling(true);
    setCompiledResult("");

    try {
      let prompt = "";
      let sysPrompt = "";

      if (docType === "CV") {
        sysPrompt = "You are a professional CV summary builder and career coach.";
        prompt = `Draft a compelling 3-paragraph CV objective target summary statement for candidate: ${userProfile.fullName}. 
                   Candidate Education Summary: ${userProfile.education || "None provided"}.
                   Work History: ${userProfile.experience || "None provided"}.
                   Specialized Technical Skills: ${userProfile.skills || "None provided"}.
                   Profile dossier reference: ${userProfile.cvText || "None provided"}.
                   Target Country destination: ${userProfile.preferredCountry || "Global focus"}.`;
      } else if (docType === "COVER_LETTER") {
        sysPrompt = "You are an expert cover letter advisor.";
        if (!activeOpp) {
          Alert.alert("Opportunity Missing", "Please select or preload an opportunity first.");
          setIsCompiling(false);
          return;
        }
        prompt = `Compile a professional formal Cover Letter targeting the following vacancy: 
                   Role Title: ${activeOpp.title}
                   Organization: ${activeOpp.organization} - ${activeOpp.country}
                   Role description and qualifications: ${activeOpp.description}
                   
                   Candidate Profile details:
                   Name: ${userProfile.fullName}
                   Education Summary: ${userProfile.education || "None provided"}
                   Experience logs: ${userProfile.experience || "None provided"}
                   Detailed background buffer dossier: ${userProfile.cvText || "None provided"}`;
      } else {
        sysPrompt = "You are an expert scholar motivation counselor.";
        prompt = `Compile a formal academic Scholarship Motivation Letter. 
                   Candidate: ${userProfile.fullName}.
                   Preferred category: ${userProfile.preferredCategory || "Scholarships"}.
                   Ideal destination focus: ${userProfile.preferredCountry || "United Kingdom"}.
                   Education Summary: ${userProfile.education || "Undergraduate degree"}.
                   Target motivations background: ${userProfile.cvText || "Wants to secure global impact pathways"}.`;
      }

      const response = await callGemini(prompt, sysPrompt);
      setCompiledResult(response);
    } catch (e: any) {
      console.error(e);
      Alert.alert("System Failure", "Could not contact Gemini API. Shifting to simulation fallback.");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleShare = async () => {
    if (!compiledResult) return;
    try {
      await Share.share({
        message: compiledResult,
        title: "Draft opportunities compilation document"
      });
    } catch (error) {
      console.error("Share failed", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Alert Warning */}
      {!userProfile && (
        <View style={styles.authNotice}>
          <AlertTriangle size={16} color="#fbbf24" style={{ marginRight: 8 }} />
          <Text style={styles.authNoticeText}>
            Profile required! Log in inside the Dashboard tab to auto-pull your resume data.
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.cardHeadingRow}>
          <FileText size={18} color="#818cf8" style={{ marginRight: 6 }} />
          <Text style={styles.cardTitle}>AI DOCUMENT COMPILER</Text>
        </View>

        <Text style={styles.desc}>
          Select your target document structure. Gemini draws from your CV summary data to write bespoke cover and motivation letters.
        </Text>

        {/* Doc type selection row */}
        <View style={styles.docTypeRow}>
          <TouchableOpacity 
            style={[styles.typeBtn, docType === "COVER_LETTER" && styles.typeBtnActive]}
            onPress={() => setDocType("COVER_LETTER")}
          >
            <Text style={[styles.typeBtnLabel, docType === "COVER_LETTER" && styles.typeBtnLabelActive]}>Cover Letter</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeBtn, docType === "CV" && styles.typeBtnActive]}
            onPress={() => setDocType("CV")}
          >
            <Text style={[styles.typeBtnLabel, docType === "CV" && styles.typeBtnLabelActive]}>CV Objective</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.typeBtn, docType === "MON_LETTER" && styles.typeBtnActive]}
            onPress={() => setDocType("MON_LETTER")}
          >
            <Text style={[styles.typeBtnLabel, docType === "MON_LETTER" && styles.typeBtnLabelActive]}>Motivation</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Opportunity selection if Cover Letter chosen */}
        {docType === "COVER_LETTER" && (
          <View style={styles.opSection}>
            <Text style={styles.opLabel}>Select Target Opportunity:</Text>
            {preloadedOpportunity ? (
              <View style={styles.preloadedBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.preloadedTitle}>{preloadedOpportunity.title}</Text>
                  <Text style={styles.preloadedSub}>{preloadedOpportunity.organization} - {preloadedOpportunity.country}</Text>
                </View>
                <TouchableOpacity onPress={onClearPreload} style={styles.clearPreloadBtn}>
                  <X size={14} color="#f43f5e" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.dropdownPickerBox}>
                <Text style={styles.dropdownMockText}>
                  {activeOpp ? activeOpp.title : "No specific vacancy highlighted. Auto Drafting using general career indicators..."}
                </Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity 
          style={styles.compileBtn}
          onPress={handleGenerate}
          disabled={isCompiling}
        >
          {isCompiling ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <View style={styles.compileBtnContent}>
              <Sparkles size={14} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.compileBtnText}>Compile with Gemini Flash</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Result Panel */}
      {compiledResult ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Gemini Compiled Draft Output</Text>
            <View style={styles.iconActions}>
              <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
                <Share2 size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.resultScroll}>
            <Text style={styles.resultBodyText}>{compiledResult}</Text>
          </ScrollView>
        </View>
      ) : null}
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
  authNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.2)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  authNoticeText: {
    color: "#fbbf24",
    fontSize: 10,
    fontWeight: "bold",
    flex: 1,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 20,
  },
  cardHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#f1f5f9",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  desc: {
    color: "#94a3b8",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 16,
  },
  docTypeRow: {
    flexDirection: "row",
    backgroundColor: "#070d1e",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  typeBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  typeBtnActive: {
    backgroundColor: "#6366f1",
  },
  typeBtnLabel: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "bold",
  },
  typeBtnLabelActive: {
    color: "#ffffff",
  },
  opSection: {
    marginBottom: 16,
  },
  opLabel: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  preloadedBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
    borderRadius: 12,
    padding: 10,
  },
  preloadedTitle: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  preloadedSub: {
    color: "#cbd5e1",
    fontSize: 10,
  },
  clearPreloadBtn: {
    padding: 4,
  },
  dropdownPickerBox: {
    backgroundColor: "#070d1e",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  dropdownMockText: {
    color: "#475569",
    fontSize: 11,
  },
  compileBtn: {
    backgroundColor: "#6366f1",
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  compileBtnContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  compileBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  resultCard: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    maxHeight: 400,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 10,
    marginBottom: 12,
  },
  resultTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  iconActions: {
    flexDirection: "row",
  },
  actionBtn: {
    marginLeft: 10,
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  resultScroll: {
    flex: 1,
  },
  resultBodyText: {
    color: "#e2e8f0",
    fontSize: 11,
    lineHeight: 18,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});
