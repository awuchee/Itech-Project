import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { ChatMessage } from "../../types";
import { Send, Bot, Trash2, ShieldAlert, Sparkles, User, HelpCircle } from "lucide-react-native";

interface AiChatbotScreenProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
}

export default function AiChatbotScreen({
  messages,
  isSending,
  onSendMessage,
  onClearHistory
}: AiChatbotScreenProps) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
    // Scroll to bottom after dispatch
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleTriggerSuggestion = (text: string) => {
    onSendMessage(text);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      {/* Header operations row */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.iconCircle}>
            <Bot size={18} color="#818cf8" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Hubbie AI Advisor</Text>
            <Text style={styles.headerStatus}>Gemini-3.5-Flash Active</Text>
          </View>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity onPress={onClearHistory} style={styles.clearBtn}>
            <Trash2 size={14} color="#f43f5e" />
          </TouchableOpacity>
        )}
      </View>

      {/* Main chat history list scroll */}
      <ScrollView 
        ref={scrollRef} 
        style={styles.chatArea} 
        contentContainerStyle={styles.chatScrollContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <View style={styles.welcomeBox}>
            <Bot size={40} color="#818cf8" style={{ marginBottom: 12 }} />
            <Text style={styles.welcomeTitle}>International Mobility Chatbot</Text>
            <Text style={styles.welcomeDesc}>
              Ask me about Germany's Chancenkarte points, Canada express entries, visa sponsoring IT jobs, or DAAD requirements!
            </Text>

            {/* Suggetion pills */}
            <Text style={styles.suggestionTitle}>Suggested Questions:</Text>
            
            <TouchableOpacity 
              style={styles.suggestionPill} 
              onPress={() => handleTriggerSuggestion("Explain the German Chancenkarte points system requirements")}
            >
              <Sparkles size={11} color="#a5b4fc" style={{ marginRight: 6 }} />
              <Text style={styles.suggestionPillText}>German Chancenkarte Points System</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.suggestionPill} 
              onPress={() => handleTriggerSuggestion("What is Canada Express Entry FSWP score system?")}
            >
              <Sparkles size={11} color="#a5b4fc" style={{ marginRight: 6 }} />
              <Text style={styles.suggestionPillText}>Canada Express Entry FSWP Score</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.suggestionPill} 
              onPress={() => handleTriggerSuggestion("Does DAAD scholarship cover airline flights?")}
            >
              <Sparkles size={11} color="#a5b4fc" style={{ marginRight: 6 }} />
              <Text style={styles.suggestionPillText}>DAAD Flight Scholarships</Text>
            </TouchableOpacity>
          </View>
        ) : (
          messages.map((m) => {
            const isAi = m.sender === "ai";
            return (
              <View 
                key={m.id} 
                style={[
                  styles.msgContainer, 
                  isAi ? styles.msgLeft : styles.msgRight
                ]}
              >
                {isAi && (
                  <View style={styles.avatarMini}>
                    <Bot size={12} color="#ffffff" />
                  </View>
                )}
                <View 
                  style={[
                    styles.bubble, 
                    isAi ? styles.bubbleLeft : styles.bubbleRight
                  ]}
                >
                  <Text style={[styles.bubbleText, !isAi && styles.bubbleTextUser]}>{m.text}</Text>
                  <Text style={styles.timestamp}>{m.timestamp}</Text>
                </View>
              </View>
            );
          })
        )}

        {isSending && (
          <View style={[styles.msgContainer, styles.msgLeft]}>
            <View style={styles.avatarMini}>
              <Bot size={12} color="#ffffff" />
            </View>
            <View style={[styles.bubble, styles.bubbleLeft, styles.loadingBubble]}>
              <ActivityIndicator color="#818cf8" size="small" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer input layout bar */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputBar}>
          <TextInput
            placeholder="Query Hubbie AI..."
            placeholderTextColor="#475569"
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Send size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "#070d1e",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderColor: "rgba(99, 102, 241, 0.2)",
    borderWidth: 1,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  headerStatus: {
    color: "#10b981",
    fontSize: 9,
    fontWeight: "bold",
  },
  clearBtn: {
    padding: 8,
    backgroundColor: "rgba(244, 63, 94, 0.05)",
    borderColor: "rgba(244, 63, 94, 0.12)",
    borderWidth: 1,
    borderRadius: 8,
  },
  chatArea: {
    flex: 1,
  },
  chatScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  welcomeBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 24,
  },
  welcomeTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  welcomeDesc: {
    color: "#64748b",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  suggestionTitle: {
    color: "#818cf8",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 1,
  },
  suggestionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#070d1e",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    width: "100%",
  },
  suggestionPillText: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "bold",
  },
  msgContainer: {
    flexDirection: "row",
    marginBottom: 14,
    maxWidth: "85%",
  },
  msgLeft: {
    alignSelf: "flex-start",
  },
  msgRight: {
    alignSelf: "flex-end",
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    top: 4,
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
  },
  bubbleLeft: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  bubbleRight: {
    backgroundColor: "#6366f1",
    borderTopRightRadius: 4,
  },
  loadingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bubbleText: {
    color: "#e2e8f0",
    fontSize: 12,
    lineHeight: 18,
  },
  bubbleTextUser: {
    color: "#ffffff",
    fontWeight: "600",
  },
  timestamp: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 8,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#070d1e",
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 16,
    color: "#ffffff",
    fontSize: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
});
