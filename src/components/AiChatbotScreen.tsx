"use client";

import React, { useState } from "react";
import { ChatMessage } from "../types";
import { Send, Bot, Trash2, ShieldAlert, Sparkles, User, HelpCircle } from "lucide-react";

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

  const shortcutPrompts = [
    "Germany Chancenkarte points checklist?",
    "DAAD cover letter guidelines?",
    "High demand careers in Canada?",
    "What is H1B visa sponsorship?"
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-180px)] glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Bot Chat Header */}
      <div className="px-6 py-4 bg-slate-950/40 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Hubbie AI Mobility Assistant</h3>
            <p className="text-[11px] text-slate-400 font-medium">Your dedicated consultant on visa requirements & CV standards</p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all"
          title="Clear Conversation Thread"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
            <div className="p-4 rounded-full bg-slate-900 border border-white/5 text-indigo-400">
              <Bot className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Begin Advice Conversation</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Our Generative AI agent can help you compute express entry eligibility, clarify Chancenkarte criteria, or structure top academic essays.
              </p>
            </div>

            {/* Suggestions Carousel */}
            <div className="pt-2 w-full space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center justify-center">
                <HelpCircle className="w-3 h-3 mr-1" /> Quick suggestions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {shortcutPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(prompt)}
                    className="p-3 text-xs bg-slate-950/20 hover:bg-indigo-600/15 text-slate-300 hover:text-indigo-300 rounded-xl border border-white/5 hover:border-indigo-500/30 text-left transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isAi = message.sender === "ai";
            return (
              <div 
                key={message.id}
                className={`flex ${isAi ? "justify-start" : "justify-end"}`}
              >
                <div 
                  className={`max-w-[75%] rounded-2xl p-4 space-y-1.5 shadow-md ${
                    isAi 
                      ? "bg-slate-900 border border-white/5 text-slate-200" 
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400">
                    {isAi ? (
                      <>
                        <Bot className="w-3 h-3 text-indigo-400" />
                        <span className="text-indigo-400">Hubbie AI</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-indigo-200" />
                        <span className="text-indigo-200">Me</span>
                      </>
                    )}
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-500 font-normal">{message.timestamp}</span>
                  </div>

                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.text}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Loading Bubble */}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center space-x-2 text-slate-300 max-w-[50%]">
              <span className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></span>
              <span className="text-xs font-semibold">Hubbie writing advice...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips Row Carousel on Active Chats */}
      {messages.length > 0 && (
        <div className="px-6 py-2 bg-slate-950/20 border-t border-white/5 flex items-center space-x-2 overflow-x-auto whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Ask Advisor:</span>
          {shortcutPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt)}
              className="py-1 px-3 bg-slate-950/30 hover:bg-slate-800 text-xs text-slate-300 rounded-full border border-white/5 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input panel prompt box */}
      <form onSubmit={handleSend} className="p-4 bg-slate-950/40 border-t border-white/5 flex items-center space-x-3">
        <input
          type="text"
          placeholder="Ask about Chancenkarte criteria, DAAD structure, resume checklists..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isSending}
          className="flex-1 px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSending || !inputText.trim()}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-30 disabled:scale-100 transform active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
