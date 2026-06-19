import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Mail, Lock, User, Phone, Briefcase, KeyRound, Compass, AlertCircle } from "lucide-react-native";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, isMocked } from "../../lib/firebase";

interface AuthScreenProps {
  onAuthSuccess: (email: string, fullName: string, role: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration extras
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("CANDIDATE"); // "CANDIDATE" | "RECRUITER"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please key in your email and password.");
      return;
    }
    if (!isLogin && !fullName) {
      setError("Please supply your full name for onboarding.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        if (!isMocked) {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          // If we had user profiles collection, we could retrieve they role.
          // For safe cross-device sandboxing, check admin email or fallback CANDIDATE.
          const finalRole = email === "richardprempe@gmail.com" ? "ADMIN" : "CANDIDATE";
          onAuthSuccess(email, email.split("@")[0], finalRole);
        } else {
          // Mock login
          const finalRole = email === "richardprempe@gmail.com" ? "ADMIN" : "CANDIDATE";
          onAuthSuccess(email, email.split("@")[0], finalRole);
        }
      } else {
        if (!isMocked) {
          await createUserWithEmailAndPassword(auth, email, password);
          onAuthSuccess(email, fullName, role);
        } else {
          onAuthSuccess(email, fullName, role);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Authentication credentials rejected.");
    } finally {
      setLoading(false);
    }
  };

  const triggerPresetRichard = () => {
    setEmail("richardprempe@gmail.com");
    setPassword("richard2026");
    setFullName("Richard Prempe");
    setIsLogin(true);
    setError(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.authCard}>
        <View style={styles.iconCircle}>
          <Compass size={28} color="#818cf8" />
        </View>

        <Text style={styles.title}>
          {isLogin ? "Synchronize Account" : "Join Global Hub"}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin 
            ? "Connect your credentials to access active application checklist logs and AI analyzers." 
            : "Forge a profile to secure international vacancies and DAAD sponsorships."}
        </Text>

        {error && (
          <View style={styles.errorBox}>
            <AlertCircle size={14} color="#f43f5e" style={{ marginRight: 6 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <User size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#475569"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Mail size={16} color="#64748b" style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#475569"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={16} color="#64748b" style={styles.inputIcon} />
            <TextInput
              placeholder="Account Password"
              placeholderTextColor="#475569"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {!isLogin && (
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>I want to register as a:</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity 
                  style={[styles.roleBtn, role === "CANDIDATE" && styles.roleBtnActive]}
                  onPress={() => setRole("CANDIDATE")}
                >
                  <Text style={[styles.roleBtnText, role === "CANDIDATE" && styles.roleBtnTextActive]}>Candidate</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.roleBtn, role === "RECRUITER" && styles.roleBtnActive]}
                  onPress={() => setRole("RECRUITER")}
                >
                  <Text style={[styles.roleBtnText, role === "RECRUITER" && styles.roleBtnTextActive]}>Recruiter</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitText}>
                {isLogin ? "Authenticate" : "Onboard Account"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchBtn} 
            onPress={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
          >
            <Text style={styles.switchText}>
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Admin Shortcut */}
        <TouchableOpacity style={styles.adminPresetBtn} onPress={triggerPresetRichard}>
          <KeyRound size={12} color="#818cf8" style={{ marginRight: 6 }} />
          <Text style={styles.adminPresetText}>Quick Fill Richard Prempe (Admin)</Text>
        </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    paddingBottom: 40,
  },
  authCard: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.2)",
    borderRadius: 12,
    padding: 10,
    width: "100%",
    marginBottom: 16,
  },
  errorText: {
    color: "#fb7185",
    fontSize: 11,
    fontWeight: "bold",
    flex: 1,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#070d1e",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    color: "#ffffff",
    fontSize: 13,
    flex: 1,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roleBtn: {
    flex: 1,
    height: 38,
    backgroundColor: "#070d1e",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 4,
  },
  roleBtnActive: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderColor: "#6366f1",
  },
  roleBtnText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "bold",
  },
  roleBtnTextActive: {
    color: "#818cf8",
  },
  submitBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  switchBtn: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  switchText: {
    color: "#818cf8",
    fontSize: 11,
    fontWeight: "bold",
  },
  adminPresetBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(99, 102, 241, 0.06)",
    borderColor: "rgba(99, 102, 241, 0.15)",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  adminPresetText: {
    color: "#a5b4fc",
    fontSize: 10,
    fontWeight: "800",
  },
});
