"use client";

import React, { useState } from "react";
import { CountryDetail } from "../types";
import { MOCK_COUNTRIES } from "../lib/mocks";
import { 
  Compass, 
  MapPin, 
  Coins, 
  TrendingUp, 
  Workflow, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";

export default function CountryPagesScreen() {
  const [selectedCountry, setSelectedCountry] = useState<CountryDetail | null>(null);

  return (
    <div className="space-y-6">
      {/* Country Hub description header */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/20">
          <Compass className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Immigration & Pathways Hub</h2>
          <p className="text-slate-400 text-xs mt-0.5">Explore global pathways, average salaries, and visa regulations by country.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COUNTRIES.map((country) => (
          <div 
            key={country.id}
            onClick={() => setSelectedCountry(country)}
            className="glass-card rounded-2xl p-6 border border-white/5 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl" role="img" aria-label={country.name}>
                  {country.flagEmoji}
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-indigo-500/15 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/25">
                  Pathways Active
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-black text-white flex items-center">
                  <span>{country.name}</span>
                </h3>
                
                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  <strong>Routes:</strong> {country.immigrationPathways}
                </p>
                
                <div className="flex items-center space-x-2 text-xs text-slate-400 pt-1 border-t border-white/5 font-semibold">
                  <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Salary: {country.averageSalary}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-2 flex items-center justify-between text-xs font-bold text-indigo-400 group">
              <span>View full regulations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Country detail full dialog popup */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setSelectedCountry(null)}></div>
          
          <div className="relative max-w-2xl w-full max-h-[85vh] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden animate-zoom-in">
            {/* Header banner custom */}
            <div className="p-6 bg-gradient-to-r from-indigo-950 to-slate-950 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-5xl">{selectedCountry.flagEmoji}</span>
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedCountry.name}</h3>
                  <p className="text-xs font-bold text-indigo-400">Immigration Routes & Compensation Indexes</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCountry(null)}
                className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-full"
              >
                Close
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed scrollbar">
              {/* Popular industries tags */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-400" /> High-Demannd Industries:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCountry.popularIndustries.map((ind, i) => (
                    <span key={i} className="py-1 px-2.5 rounded-lg text-xs bg-slate-950 text-slate-300 font-semibold border border-white/5">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pathways catalog */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Immigration pathways</span>
                  <p className="text-xs text-slate-300">{selectedCountry.immigrationPathways}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Visa Requirements</span>
                  <p className="text-xs text-slate-300">{selectedCountry.visaInformation}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Average Salary</span>
                  <p className="text-xs text-emerald-400 font-mono font-bold">{selectedCountry.averageSalary}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Cost of Living</span>
                  <p className="text-xs text-slate-300">{selectedCountry.costOfLiving}</p>
                </div>
              </div>

              {/* Education details */}
              <div className="p-4 bg-indigo-950/10 border border-indigo-500/15 rounded-2xl space-y-2 flex items-start space-x-3 text-xs text-slate-300 leading-relaxed">
                <BookOpen className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Educational Institutions & Study Pathways</h4>
                  <p className="mt-1">{selectedCountry.educationOpportunities}</p>
                </div>
              </div>

              {/* Context checklist footer */}
              <div className="p-4 bg-slate-950/30 rounded-xl border border-white/5 flex items-center space-x-2 text-[10px] leading-tight text-slate-500">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>
                  Visual assets mapped to: {selectedCountry.imageDescription}. Always verify active limits via the official consular pipelines.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
