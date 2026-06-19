import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Switch,
  Alert
} from "react-native";
import { Opportunity, UserProfile } from "../../types";
import { 
  Plus, 
  BookOpen, 
  Check, 
  Trash2, 
  Compass, 
  ShieldAlert, 
  MapPin, 
  AlignLeft, 
  DollarSign, 
  Link2 
} from "lucide-react-native";

interface AdminDashboardScreenProps {
  opportunities: Opportunity[];
  userProfile: UserProfile;
  onPostOpportunity: (newOpp: Omit<Opportunity, "id">) => void;
  onApproveOpportunity: (oppId: string | number) => void;
  onRejectOpportunity: (oppId: string | number) => void;
}

export default function AdminDashboardScreen({
  opportunities,
  userProfile,
  onPostOpportunity,
  onApproveOpportunity,
  onRejectOpportunity
}: AdminDashboardScreenProps) {
  // Opportunity creation fields
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("Jobs Abroad");
  const [deadline, setDeadline] = useState("");
  const [fundingAmount, setFundingAmount] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [officialLink, setOfficialLink] = useState("");
  
  // Boolean credentials
  const [isFullyFunded, setIsFullyFunded] = useState(false);
  const [visaSponsorship, setVisaSponsorship] = useState(false);
  const [remote, setRemote] = useState(false);
  const [noIeltsRequired, setNoIeltsRequired] = useState(false);
  const [govtSponsored, setGovtSponsored] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<"ADD" | "MODERATE">("ADD");

  const handleSubmit = () => {
    if (!title || !organization || !country || !deadline) {
      Alert.alert("Missing Fields", "Please complete Title, Organization, Country, and Deadline.");
      return;
    }

    onPostOpportunity({
      title,
      organization,
      country,
      category,
      deadline,
      fundingAmount,
      isFullyFunded,
      eligibility,
      description,
      benefits,
      officialLink,
      datePosted: new Date().toISOString().split("T")[0],
      status: "APPROVED", // Auto-approved when posted by administrator
      isFeatured: false,
      visaSponsorship,
      remote,
      noIeltsRequired,
      govtSponsored,
      rating: 5.0,
      creatorEmail: userProfile.email
    });

    // Reset fields
    setTitle("");
    setOrganization("");
    setCountry("");
    setDeadline("");
    setFundingAmount("");
    setEligibility("");
    setDescription("");
    setBenefits("");
    setOfficialLink("");
    setIsFullyFunded(false);
    setVisaSponsorship(false);
    setRemote(false);
    setNoIeltsRequired(false);
    setGovtSponsored(false);

    Alert.alert("Success", "New opportunity compiled and posted live!");
  };

  const pendingList = opportunities.filter((o) => o.status === "PENDING");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Subtab selection selector */}
      <View style={styles.subtabRow}>
        <TouchableOpacity 
          style={[styles.subtabBtn, activeSubTab === "ADD" && styles.subtabBtnActive]}
          onPress={() => setActiveSubTab("ADD")}
        >
          <Plus size={14} color={activeSubTab === "ADD" ? "#ffffff" : "#94a3b8"} style={{ marginRight: 6 }} />
          <Text style={[styles.subtabText, activeSubTab === "ADD" && styles.subtabTextActive]}>Add Opportunity</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.subtabBtn, activeSubTab === "MODERATE" && styles.subtabBtnActive]}
          onPress={() => setActiveSubTab("MODERATE")}
        >
          <BookOpen size={14} color={activeSubTab === "MODERATE" ? "#ffffff" : "#94a3b8"} style={{ marginRight: 6 }} />
          <Text style={[styles.subtabText, activeSubTab === "MODERATE" && styles.subtabTextActive]}>
            Moderate ({pendingList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeSubTab === "ADD" ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Compile Opportunity Entry</Text>
          <Text style={styles.formSubtitle}>Provide high fidelity details to populate the global opportunities listings database.</Text>

          {/* Form fields */}
          <View style={styles.field}>
            <Text style={styles.label}>Opportunity Title *</Text>
            <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="e.g. Senior Software Architect" placeholderTextColor="#475569" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Organization / Firm *</Text>
            <TextInput value={organization} onChangeText={setOrganization} style={styles.input} placeholder="e.g. Google Cloud Solutions" placeholderTextColor="#475569" />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Target Country *</Text>
              <TextInput value={country} onChangeText={setCountry} style={styles.input} placeholder="e.g. Germany" placeholderTextColor="#475569" />
            </View>
            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Category</Text>
              <TextInput value={category} onChangeText={setCategory} style={styles.input} placeholder="e.g. Jobs Abroad / Scholarships" placeholderTextColor="#475569" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Expiration Deadline *</Text>
              <TextInput value={deadline} onChangeText={setDeadline} style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#475569" />
            </View>
            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Funding Amount / Salary</Text>
              <TextInput value={fundingAmount} onChangeText={setFundingAmount} style={styles.input} placeholder="e.g. €75,000 / Year" placeholderTextColor="#475569" />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Official Application Link</Text>
            <TextInput value={officialLink} onChangeText={setOfficialLink} style={styles.input} keyboardType="url" autoCapitalize="none" placeholder="https://" placeholderTextColor="#475569" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Overview Summary</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.multiline} multiline placeholder="Provide descriptive details..." placeholderTextColor="#475569" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Eligibility Criteria</Text>
            <TextInput value={eligibility} onChangeText={setEligibility} style={styles.multiline} multiline placeholder="Academic levels, age cap parameters..." placeholderTextColor="#475569" />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Salary / Flight Benefits Included</Text>
            <TextInput value={benefits} onChangeText={setBenefits} style={styles.multiline} multiline placeholder="Outline monthly stipends, relocations..." placeholderTextColor="#475569" />
          </View>

          {/* Grid of Switch options */}
          <Text style={styles.switchesHeaderHeading}>Path Credentials Options:</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Fully Funded / Complete Grant</Text>
            <Switch value={isFullyFunded} onValueChange={setIsFullyFunded} trackColor={{ false: "#1e293b", true: "#6366f1" }} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Visa Sponsorship / Relocation Covered</Text>
            <Switch value={visaSponsorship} onValueChange={setVisaSponsorship} trackColor={{ false: "#1e293b", true: "#6366f1" }} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Available Globally as Fully Remote</Text>
            <Switch value={remote} onValueChange={setRemote} trackColor={{ false: "#1e293b", true: "#6366f1" }} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Accepts candidates with No IELTS/TOEFL</Text>
            <Switch value={noIeltsRequired} onValueChange={setNoIeltsRequired} trackColor={{ false: "#1e293b", true: "#6366f1" }} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Official Government Sponsored Pathway</Text>
            <Switch value={govtSponsored} onValueChange={setGovtSponsored} trackColor={{ false: "#1e293b", true: "#6366f1" }} />
          </View>

          <TouchableOpacity style={styles.postBtn} onPress={handleSubmit}>
            <Check size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.postBtnText}>Post Live Database Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listSection}>
          <Text style={styles.formTitle}>Review Pending Moderations</Text>
          <Text style={styles.formSubtitle}>Approve or reject community-submitted opportunity requests below.</Text>

          {pendingList.length === 0 ? (
            <View style={styles.noPendingBox}>
              <Check size={36} color="#10b981" style={{ marginBottom: 8 }} />
              <Text style={styles.noPendingTitle}>All Cleared!</Text>
              <Text style={styles.noPendingSubtitle}>No outstanding opportunities waiting for moderation checks.</Text>
            </View>
          ) : (
            pendingList.map((opp) => (
              <View key={opp.id} style={styles.pendingCard}>
                <Text style={styles.pendingCategory}>{opp.category}</Text>
                <Text style={styles.pendingTitle}>{opp.title}</Text>
                <Text style={styles.pendingOrg}>{opp.organization} - {opp.country}</Text>
                <Text style={styles.pendingDesc} numberOfLines={3}>{opp.description}</Text>

                <View style={styles.moderateActionButtons}>
                  <TouchableOpacity 
                    style={styles.btnApprove}
                    onPress={() => {
                      onApproveOpportunity(opp.id);
                      Alert.alert("Moderation Closed", "Opportunity approved and logged live!");
                    }}
                  >
                    <Check size={12} color="#ffffff" style={{ marginRight: 4 }} />
                    <Text style={styles.moderateText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.btnReject}
                    onPress={() => {
                      onRejectOpportunity(opp.id);
                      Alert.alert("Moderation Closed", "Submission request discarded.");
                    }}
                  >
                    <Trash2 size={12} color="#ffffff" style={{ marginRight: 4 }} />
                    <Text style={styles.moderateText}>Discard</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
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
  subtabRow: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  subtabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 8,
  },
  subtabBtnActive: {
    backgroundColor: "#6366f1",
  },
  subtabText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "bold",
  },
  subtabTextActive: {
    color: "#ffffff",
  },
  formCard: {
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  formTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  formSubtitle: {
    color: "#64748b",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 20,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#070d1e",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    color: "#f8fafc",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  row: {
    flexDirection: "row",
  },
  multiline: {
    backgroundColor: "#070d1e",
    borderRadius: 10,
    height: 70,
    padding: 10,
    color: "#f8fafc",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    textAlignVertical: "top",
  },
  switchesHeaderHeading: {
    color: "#818cf8",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 10,
    letterSpacing: 1,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  switchLabel: {
    color: "#cbd5e1",
    fontSize: 11,
  },
  postBtn: {
    backgroundColor: "#6366f1",
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  postBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  listSection: {
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  noPendingBox: {
    alignItems: "center",
    padding: 32,
    borderRadius: 14,
    backgroundColor: "#070d1e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    marginTop: 12,
  },
  noPendingTitle: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  noPendingSubtitle: {
    color: "#64748b",
    fontSize: 11,
    textAlign: "center",
  },
  pendingCard: {
    backgroundColor: "#070d1e",
    borderRadius: 14,
    padding: 12,
    borderColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    marginBottom: 12,
  },
  pendingCategory: {
    color: "#818cf8",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  pendingTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 2,
  },
  pendingOrg: {
    color: "#cbd5e1",
    fontSize: 11,
  },
  pendingDesc: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
  moderateActionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    paddingTop: 10,
  },
  btnApprove: {
    backgroundColor: "#10b981",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginRight: 8,
  },
  btnReject: {
    backgroundColor: "#f43f5e",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  moderateText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
