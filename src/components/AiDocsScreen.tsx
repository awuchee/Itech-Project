"use client";

import React, { useState, useEffect } from "react";
import { Opportunity, UserProfile } from "../types";
import { callGemini } from "../lib/gemini";
import { 
  FileSignature, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Eraser, 
  Sparkles, 
  ChevronDown, 
  Bookmark,
  Briefcase,
  Layers,
  Check
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("Cover Letter"); // "CV", "Cover Letter", "Scholarship Essay"
  const [selectedOppId, setSelectedOppId] = useState<string | number>("");
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set selected opportunity if preloaded
  useEffect(() => {
    if (preloadedOpportunity) {
      setSelectedOppId(preloadedOpportunity.id);
    } else if (opportunities.length > 0 && !selectedOppId) {
      setSelectedOppId(opportunities[0].id);
    }
  }, [preloadedOpportunity, opportunities]);

  const docCategories = ["CV", "Cover Letter", "Scholarship Essay"];

  // Fetch current selected opportunity
  const currentOpportunity = opportunities.find(o => o.id === selectedOppId) || preloadedOpportunity;

  // Check if profile details are populated
  const canGenerate = userProfile && (
    (userProfile.education && userProfile.education.trim().length > 0) ||
    (userProfile.experience && userProfile.experience.trim().length > 0)
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedDoc(null);

    const safeProfile = userProfile || {
      fullName: "Global Candidate",
      education: "None listed in dashboard",
      experience: "None listed in dashboard",
      skills: "None listed in dashboard"
    };

    const safeOpp = currentOpportunity || {
      title: "General Global Pathway Program",
      organization: "International Entity",
      country: "Global",
      description: "Comprehensive scholarship, internship, and relocation opportunities.",
      eligibility: "Academicians or professionals seeking mobility."
    };

    const systemPrompt = `You are a professional recruiting HR expert and AI document generator. Generate an optimized ${activeTab} document.`;
    
    const userPrompt = `
      DOCUMENT TYPE: ${activeTab}
      
      USER PROFILE DETAILS:
      - Full Name: ${safeProfile.fullName}
      - Academic Degrees: ${safeProfile.education}
      - Work Experience: ${safeProfile.experience}
      - Skills: ${safeProfile.skills}
      
      TARGET OPPORTUNITY:
      - Title: ${safeOpp.title}
      - Organization: ${safeOpp.organization}
      - Country/Region: ${safeOpp.country}
      - Description: ${safeOpp.description}
      - Selection Eligibility: ${safeOpp.eligibility}
      
      INSTRUCTION:
      Please write a professional, highly aligned ${activeTab} tailored precisely to this opportunity. Weave the candidate's education and skills seamlessly. Keep the tone elegant, confident, and highly tailored. Avoid general boilerplate phrases.
    `;

    try {
      const draft = await callGemini(userPrompt, systemPrompt);
      setGeneratedDoc(draft);
    } catch (error) {
      console.error("AI Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center space-x-2">
            <FileSignature className="w-6 h-6 text-indigo-400" />
            <span>AI Document Generator</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">Tailor your credentials instantly using model intelligence.</p>
        </div>
        {preloadedOpportunity && (
          <button
            onClick={onClearPreload}
            className="text-xs font-bold text-slate-500 hover:text-rose-400 border border-white/5 py-1 px-3 rounded-xl hover:bg-white/5 transition-all"
          >
            Clear active preloader selection
          </button>
        )}
      </div>

      {/* Select document type tabs */}
      <div className="grid grid-cols-3 gap-2">
        {docCategories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`py-3 rounded-xl font-bold text-xs transition-all border ${
                isActive 
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                  : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Selector and Warnings banner controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Opportunity drop list */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3">
          <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">
            Selected Job / Scholarship Profile:
          </label>
          
          {preloadedOpportunity ? (
            <div className="p-3 bg-indigo-950/20 text-indigo-300 border border-indigo-500/20 rounded-xl flex items-center space-x-2 text-xs font-bold">
              <Bookmark className="w-4 h-4 shrink-0" />
              <span className="truncate">Active selection: {preloadedOpportunity.organization} - {preloadedOpportunity.title}</span>
            </div>
          ) : opportunities.length > 0 ? (
            <div className="relative">
              <select
                value={selectedOppId}
                onChange={(e) => setSelectedOppId(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {opportunities.map(o => (
                  <option key={o.id} value={o.id}>{o.organization} - {o.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-semibold p-3 bg-slate-950/20 rounded-xl">
              No opportunity entries seeded. Falls back to General template defaults.
            </div>
          )}
        </div>

        {/* Credentials safe alert card */}
        <div className={`p-5 rounded-2xl border flex items-start space-x-3 text-xs ${
          canGenerate 
            ? "bg-slate-950/30 border-white/5 text-slate-300"
            : "bg-rose-500/10 border-rose-500/25 text-rose-300"
        }`}>
          {canGenerate ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-0.5">Onboarding Credentials Safe</h4>
                <p className="text-slate-400 leading-relaxed">
                  Your listed academic qualifications details and work histories will be woven straight into the draft text automatically.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h4 className="font-bold text-rose-300 mb-0.5 font-black">Details Form Incomplete</h4>
                <p className="text-rose-400/80 leading-relaxed">
                  Your profile console details have blanks! Head over to the **Console** tab first to specify skills so AI generates highly complete matching templates.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Trigger build process */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/10 disabled:opacity-40 transition-all transform active:scale-[0.99]"
      >
        {isGenerating ? (
          <>
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span>Assembling dynamic alignment (AI)...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-1 text-indigo-200" />
            <span>Generate Optimized Template (AI)</span>
          </>
        )}
      </button>

      {/* Editor Result workspace */}
      {generatedDoc ? (
        <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">Editable AI Draft Layout</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold transition-all border border-indigo-500/20"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={() => setGeneratedDoc(null)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950/40 hover:bg-slate-950/70 text-slate-400 text-xs font-bold transition-all border border-white/5"
                title="Clear content buffer"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <textarea
            value={generatedDoc}
            onChange={(e) => setGeneratedDoc(e.target.value)}
            rows={15}
            className="w-full p-4 bg-slate-950/60 border border-white/10 rounded-xl text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500 scrollbar"
          />
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-slate-950/10">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-white font-bold text-sm">Material generation buffer is empty</h4>
          <p className="text-slate-500 text-xs max-w-xs mx-auto mt-1leading-relaxed">
            Configure target job selections and hit 'Generate' to compile tailored documents.
          </p>
        </div>
      )}
    </div>
  );
}
