"use client";

import { useApp } from "../../contexts/AppContext";
import AiChatbotScreen from "../../components/AiChatbotScreen";

export default function ChatPage() {
  const { chatMessages, isChatSending, handleSendMessage, handleClearChatHistory } = useApp();

  return (
    <AiChatbotScreen
      messages={chatMessages}
      isSending={isChatSending}
      onSendMessage={handleSendMessage}
      onClearHistory={handleClearChatHistory}
    />
  );
}
