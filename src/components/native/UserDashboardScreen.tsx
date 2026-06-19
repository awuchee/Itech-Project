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
import { UserProfile, ApplicationRecord } from "../../types";
import { 
  User, 
  Mail, 
  Briefcase, 
  Settings, 
  GraduationCap, 
  ChevronRight, 
  BookOpen, 
  X, 
  Check, 
  ListChecks, 
  AlertTriangle 
} from "lucide-react-native";

interface UserDashboardScreenProps {
  userProfile: UserProfile;
  applicationRecords: ApplicationRecord[];
  onSaveProfile: (profile: UserProfile | null) => void;
  onWithdrawApplication: (appId: string | number) => void;
}

export default function UserDashboardScreen({
  userProfile,
  applicationRecords,
  onSaveProfile,
  onWithdrawApplication
}: UserDashboardScreenProps) {
  // Input states
  const [fullName, setFullName] = useState(userProfile.fullName || "");
  const [phone, setPhone] = useState(userProfile.phone || "");
  const [education, setEducation] = useState(userProfile.education || "");
  const [experience, setExperience] = useState(userProfile.experience || "");
  const [skills, setSkills] = useState(userProfile.skills || "");
  const [cvText, setCvText] = useState(userProfile.cvText || "");
  const [preferredCountry, setPreferredCountry] = useState(userProfile.preferredCountry || "Any");
  const [preferredCategory, setPreferredCategory] = useState(userProfile.preferredCategory || "Any");
  
  // Boolean settings
  const [noIeltsChecked, setNoIeltsChecked] = useState(userProfile.noIeltsChecked || false);
  const [visaSponsorshipNeeded, setVisaSponsorshipNeeded] = useState(userProfile.visaSponsorshipNeeded || false);
  const [remoteOnly, setRemoteOnly] = useState(userProfile.remoteOnly || false);

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSaveProfile({
      ...userProfile,
      fullName,
      phone,
      education,
      experience,
      skills,
      cvText,
      preferredCountry,
      preferredCategory,
      noIeltsChecked,
      visaSponsorshipNeeded,
      remoteOnly
    });
    setIsEditing(false);
    Alert.alert("Success", "Profile criteria synchronized successfully!");
  };

  const myApplications = applicationRecords.filter(app => app.userId === userProfile.email);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Upper Profile Indicator Card */}
      <View style={styles.profileIndicator}>
        <View style={styles.avatar}>
          <User size={30} color="#818cf8" />
        </View>
        <View style={styles.profileHeaderDetails}>
          <View style={styles.tagRow}>
            <Text style={styles.roleTag}>{userProfile.role || "CANDIDATE"}</Text>
          </View>
          <Text style={styles.profileName}>{userProfile.fullName}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
        </View>
      </View>

      {/* Onboarding Preferences */}
      <View style={styles.card}>
        <View style={styles.cardHeadingRow}>
          <ListChecks size={18} color="#818cf8" style={{ marginRight: 6 }} />
          <Text style={styles.cardHeaderTitle}>PREFERENCES CHECKLIST</Text>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>No IELTS/TOEFL English test certificates</Text>
            <Text style={styles.toggleDesc}>Filter lists to platforms not requiring standard testing credentials</Text>
          </View>
          <Switch 
            value={noIeltsChecked} 
            onValueChange={isEditing ? setNoIeltsChecked : undefined}
            trackColor={{ false: "#1e293b", true: "#6366f1" }}
            thumbColor={"#f8fafc"}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>Visa Sponsorship Needed</Text>
            <Text style={styles.toggleDesc}>Focus searches on companies that provide full visa hosting & flights</Text>
          </View>
          <Switch 
            value={visaSponsorshipNeeded} 
            onValueChange={isEditing ? setVisaSponsorshipNeeded : undefined}
            trackColor={{ false: "#1e293b", true: "#6366f1" }}
            thumbColor={"#f8fafc"}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>Remote Opportunities Only</Text>
            <Text style={styles.toggleDesc}>Filter to opportunities that permit working work from any country</Text>
          </View>
          <Switch 
            value={remoteOnly} 
            onValueChange={isEditing ? setRemoteOnly : undefined}
            trackColor={{ false: "#1e293b", true: "#6366f1" }}
            thumbColor={"#f8fafc"}
            disabled={!isEditing}
          />
        </View>
      </View>

      {/* Main Profile Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeadingRow}>
          <Settings size={18} color="#818cf8" style={{ marginRight: 6 }} />
          <Text style={styles.cardHeaderTitle}>CANDIDATE DOSSIER DETAILS</Text>
          {isEditing ? (
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput 
            value={fullName} 
            onChangeText={setFullName} 
            editable={isEditing} 
            style={[styles.input, !isEditing && styles.inputReadonly]} 
          />
        </View>

          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput 
              value={phone} 
              onChangeText={setPhone} 
              editable={isEditing} 
              style={[styles.input, !isEditing && styles.inputReadonly]} 
              placeholder="e.g. +33 6 1234 5678"
              placeholderTextColor="#475569"
            />
          </View>

          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Core Education/Degrees</Text>
            <TextInput 
              value={education} 
              onChangeText={setEducation} 
              editable={isEditing} 
              style={[styles.input, !isEditing && styles.inputReadonly]} 
              placeholder="e.g. Master's in Computer Science"
              placeholderTextColor="#475569"
            />
          </View>

          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Professional Experience</Text>
            <TextInput 
              value={experience} 
              onChangeText={setExperience} 
              editable={isEditing} 
              style={[styles.multilineInput, !isEditing && styles.inputReadonly]} 
              placeholder="Outline past roles, dates, and primary outcomes..."
              placeholderTextColor="#475569"
              multiline
            />
          </View>

          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Technical Skills (Comma separated)</Text>
            <TextInput 
              value={skills} 
              onChangeText={setSkills} 
              editable={isEditing} 
              style={[styles.input, !isEditing && styles.inputReadonly]} 
              placeholder="React Native, Firebase, Node.js"
              placeholderTextColor="#475569"
            />
          </View>

          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Personal Resume Profile Buffer (Parsed by AI Docs)</Text>
            <TextInput 
              value={cvText} 
              onChangeText={setCvText} 
              editable={isEditing} 
              style={[styles.multilineInput, !isEditing && styles.inputReadonly]} 
              placeholder="Paste raw CV summary text for Gemini to draw from when drafting customized CV letters..."
              placeholderTextColor="#475569"
              multiline
            />
          </View>

          <View style={styles.rowLayout}>
            <View style={[styles.fieldSection, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.fieldLabel}>Ideal Country Focus</Text>
              <TextInput 
                value={preferredCountry} 
                onChangeText={setPreferredCountry} 
                editable={isEditing} 
                style={[styles.input, !isEditing && styles.inputReadonly]} 
              />
            </View>
            <View style={[styles.fieldSection, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.fieldLabel}>Ideal Category</Text>
              <TextInput 
                value={preferredCategory} 
                onChangeText={setPreferredCategory} 
                editable={isEditing} 
                style={[styles.input, !isEditing && styles.inputReadonly]} 
              />
            </View>
          </View>
      </View>

      {/* Applied Records Tracker list */}
      <View style={styles.card}>
        <View style={styles.cardHeadingRow}>
          <BookOpen size={18} color="#818cf8" style={{ marginRight: 6 }} />
          <Text style={styles.cardHeaderTitle}>APPLICATION LOG TRACKER</Text>
        </View>

        {myApplications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AlertTriangle size={24} color="#64748b" style={{ marginBottom: 6 }} />
            <Text style={styles.emptyText}>No Active Job Applications Logged</Text>
            <Text style={styles.emptySubText}>Browse the catalog list inside the Home tab and log an application to run checkpoints.</Text>
          </View>
        ) : (
          myApplications.map((app) => (
            <View key={app.id} style={styles.appRecordCard}>
              <View style={styles.appCardHeading}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.appCardTitle}>{app.opportunityTitle}</Text>
                  <Text style={styles.appCardOrg}>{app.organization}</Text>
                  <Text style={styles.appCardDate}>Logged on: {app.appliedDate}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => onWithdrawApplication(app.id)}
                  style={styles.withdrawBtn}
                >
                  <Text style={styles.withdrawText}>Withdraw</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.appCardStatusLine}>
                <View style={styles.statusDotRow}>
                  <View style={[styles.dot, styles.dotSuccess]}></View>
                  <Text style={styles.appStatusLabel}>Status: {app.status}</Text>
                </View>
                {app.notes ? (
                  <Text style={styles.appNotesText}>Notes: {app.notes}</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>
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
  profileIndicator: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileHeaderDetails: {
    flex: 1,
  },
  tagRow: {
    flexDirection: "row",
  },
  roleTag: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    color: "#a5b4fc",
    fontSize: 8,
    fontWeight: "bold",
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  profileName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileEmail: {
    color: "#94a3b8",
    fontSize: 11,
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
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 10,
  },
  cardHeaderTitle: {
    color: "#f1f5f9",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    flex: 1,
  },
  editBtn: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editBtnText: {
    color: "#818cf8",
    fontSize: 11,
    fontWeight: "bold",
  },
  saveBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    color: "#f1f5f9",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  toggleDesc: {
    color: "#475569",
    fontSize: 10,
    lineHeight: 14,
  },
  fieldSection: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#070d1e",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    color: "#f1f5f9",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  inputReadonly: {
    backgroundColor: "rgba(7, 13, 30, 0.4)",
    borderColor: "transparent",
    color: "#94a3b8",
  },
  multilineInput: {
    backgroundColor: "#070d1e",
    borderRadius: 10,
    height: 80,
    padding: 10,
    color: "#f1f5f9",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    textAlignVertical: "top",
  },
  rowLayout: {
    flexDirection: "row",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 24,
    borderRadius: 14,
    backgroundColor: "#070d1e",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  emptyText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptySubText: {
    color: "#475569",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 14,
  },
  appRecordCard: {
    backgroundColor: "#070d1e",
    borderColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  appCardHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  appCardTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  appCardOrg: {
    color: "#cbd5e1",
    fontSize: 11,
  },
  appCardDate: {
    color: "#475569",
    fontSize: 9,
    marginTop: 2,
  },
  withdrawBtn: {
    backgroundColor: "rgba(244,63,94,0.1)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderColor: "rgba(244,63,94,0.2)",
    borderWidth: 1,
  },
  withdrawText: {
    color: "#f43f5e",
    fontSize: 9,
    fontWeight: "black",
  },
  appCardStatusLine: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    paddingTop: 8,
  },
  statusDotRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotSuccess: {
    backgroundColor: "#10b981",
  },
  appStatusLabel: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "bold",
  },
  appNotesText: {
    color: "#64748b",
    fontSize: 10,
  },
});
