import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Platform 
} from "react-native";
import { MOCK_COUNTRIES } from "../../lib/mocks";
import { Globe, Award, Heart, HelpCircle, ArrowRight } from "lucide-react-native";

export default function CountryPagesScreen() {
  const [selectedId, setSelectedId] = useState("germany");

  const activeCountry = MOCK_COUNTRIES.find(c => c.id === selectedId) || MOCK_COUNTRIES[1];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Horizontal List Selector of countries */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countryTabsScroll}>
        {MOCK_COUNTRIES.map((c) => (
          <TouchableOpacity 
            key={c.id} 
            style={[styles.tab, selectedId === c.id && styles.tabActive]}
            onPress={() => setSelectedId(c.id)}
          >
            <Text style={styles.flag}>{c.flagEmoji}</Text>
            <Text style={[styles.tabText, selectedId === c.id && styles.tabTextActive]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Country Info Card wrapper */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerFlag}>{activeCountry.flagEmoji}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{activeCountry.name} Guide</Text>
            <Text style={styles.headerSubtitle}>Immigration, Salaries, & Industry Insights</Text>
          </View>
        </View>

        {/* Pathways block */}
        <View style={styles.guideBlock}>
          <Text style={styles.guideHeaderLabel}>IMMIGRATION PATHWAYS</Text>
          <Text style={styles.guideText}>{activeCountry.immigrationPathways}</Text>
        </View>

        {/* Avg salary block */}
        <View style={styles.row}>
          <View style={[styles.guideBlock, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.guideHeaderLabel}>AVERAGE SALARY</Text>
            <Text style={[styles.guideText, styles.highlightVal]}>{activeCountry.averageSalary}</Text>
          </View>
          <View style={[styles.guideBlock, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.guideHeaderLabel}>COST OF LIVING</Text>
            <Text style={styles.guideText}>{activeCountry.costOfLiving}</Text>
          </View>
        </View>

        {/* High Demands Industries */}
        <View style={styles.guideBlock}>
          <Text style={styles.guideHeaderLabel}>POPULAR HIGH-GROWTH INDUSTRIES</Text>
          <View style={styles.industriesRow}>
            {activeCountry.popularIndustries.map((industry, index) => (
              <View key={index} style={styles.industryBadge}>
                <Award size={10} color="#a5b4fc" style={{ marginRight: 4 }} />
                <Text style={styles.industryBadgeText}>{industry}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Visa specs */}
        <View style={styles.guideBlock}>
          <Text style={styles.guideHeaderLabel}>VISA & SPONSORSHIP SPAN</Text>
          <Text style={styles.guideText}>{activeCountry.visaInformation}</Text>
        </View>

        {/* Tech/Masters educations opportunity */}
        <View style={styles.guideBlock}>
          <Text style={styles.guideHeaderLabel}>HIGHER EDUCATION AND SCHOLARSHIPS</Text>
          <Text style={styles.guideText}>{activeCountry.educationOpportunities}</Text>
        </View>
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
  countryTabsScroll: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  tabActive: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderColor: "#6366f1",
  },
  flag: {
    fontSize: 14,
    marginRight: 6,
  },
  tabText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#a5b4fc",
  },
  infoCard: {
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingBottom: 12,
  },
  headerFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "500",
  },
  guideBlock: {
    backgroundColor: "#070d1e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
  },
  guideHeaderLabel: {
    color: "#818cf8",
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  guideText: {
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 18,
  },
  highlightVal: {
    color: "#10b981",
    fontWeight: "bold",
  },
  industriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  industryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(99,102,241,0.1)",
    borderColor: "rgba(99,102,241,0.2)",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  industryBadgeText: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "bold",
  },
});
