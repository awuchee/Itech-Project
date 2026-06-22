"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Briefcase, GraduationCap, HardHat, Heart,
  ArrowRight, ChevronLeft, ChevronRight, AlertCircle, LucideIcon,
} from "lucide-react";
import { OpportunityCategory, UnifiedOpportunity } from "../lib/opportunities/types";

interface SearchResponse {
  count: number;
  opportunities: UnifiedOpportunity[];
  sourcesUsed: string[];
  error?: string;
}

const RESULTS_PER_PAGE = 50;

const CATEGORY_META: Record<OpportunityCategory, {
  icon: LucideIcon;
  badge: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchLabel: string;
}> = {
  Jobs: {
    icon: Briefcase,
    badge: "Live Global Job Board",
    title: "Global Job Board",
    subtitle: "Real-time listings aggregated from multiple job sources. Search by role and location to find your next international opportunity.",
    searchPlaceholder: "Job title or keyword (e.g. Software Engineer)",
    searchLabel: "Search Jobs",
  },
  Scholarships: {
    icon: GraduationCap,
    badge: "Curated Scholarship Database",
    title: "Scholarship Opportunities",
    subtitle: "Fully-funded scholarships, grants, and academic fellowships from leading institutions worldwide.",
    searchPlaceholder: "Field of study or keyword (e.g. Computer Science)",
    searchLabel: "Search Scholarships",
  },
  Apprenticeships: {
    icon: HardHat,
    badge: "Live Apprenticeship Listings",
    title: "Apprenticeship Programmes",
    subtitle: "Earn while you learn — paid apprenticeships, traineeships, and vocational programmes sourced from live job listings.",
    searchPlaceholder: "Trade or keyword (e.g. Electrician)",
    searchLabel: "Search Apprenticeships",
  },
  "Nanny & Care": {
    icon: Heart,
    badge: "Live Care & Childcare Listings",
    title: "Nanny & Care Placements",
    subtitle: "Nanny, childcare, elderly care, and home support roles sourced from live job listings worldwide.",
    searchPlaceholder: "Role or keyword (e.g. Live-in Nanny)",
    searchLabel: "Search Care Roles",
  },
};

export default function OpportunitySearchScreen({ category }: { category: OpportunityCategory }) {
  const router = useRouter();
  const meta = CATEGORY_META[category];

  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");
  const [activeWhat, setActiveWhat] = useState("");
  const [activeWhere, setActiveWhere] = useState("");
  const [page, setPage] = useState(1);
  const [opportunities, setOpportunities] = useState<UnifiedOpportunity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (searchWhat: string, searchWhere: string, searchPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ category, page: String(searchPage) });
      if (searchWhat) params.set("what", searchWhat);
      if (searchWhere) params.set("where", searchWhere);

      const res = await fetch(`/api/opportunities/search?${params.toString()}`);
      const data: SearchResponse = await res.json();

      setOpportunities(data.opportunities || []);
      setTotalCount(data.count || 0);
      if (data.error) setError(data.error);
    } catch {
      setOpportunities([]);
      setTotalCount(0);
      setError("Failed to load opportunities. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Reset and reload whenever the category changes (e.g. navigating between nav tabs).
  useEffect(() => {
    setWhat("");
    setWhere("");
    setActiveWhat("");
    setActiveWhere("");
    setPage(1);
    runSearch("", "", 1);
  }, [category, runSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveWhat(what);
    setActiveWhere(where);
    setPage(1);
    runSearch(what, where, 1);
  };

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    runSearch(activeWhat, activeWhere, nextPage);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / RESULTS_PER_PAGE));

  const openDetail = (opportunity: UnifiedOpportunity) => {
    // Persist the full opportunity so the detail page renders instantly and
    // still resolves correctly even if the server-side cache instance
    // differs (Vercel may route /api/opportunities/[id] to a separate
    // serverless instance than the one that served this search).
    sessionStorage.setItem(`opportunity_detail_${opportunity.id}`, JSON.stringify(opportunity));
    router.push(`/opportunities/${opportunity.id}`);
  };

  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Icon className="w-3.5 h-3.5 mr-1" />
            <span>{meta.badge}</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{meta.title}</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">{meta.subtitle}</p>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="glass-panel rounded-2xl p-6 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={meta.searchPlaceholder}
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Location (e.g. London)"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            {meta.searchLabel}
          </button>
        </div>
      </form>

      {/* Results meta */}
      {!loading && !error && (
        <div className="text-xs font-semibold text-slate-400">
          {totalCount.toLocaleString()} {category.toLowerCase()} opportunities found
          {activeWhat && <> for &ldquo;{activeWhat}&rdquo;</>}
          {activeWhere && <> in {activeWhere}</>}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading — skeleton UI */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy="true" aria-label="Loading opportunities">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-3 animate-pulse">
              <div className="h-4 bg-white/10 rounded-md w-3/4" />
              <div className="flex gap-3">
                <div className="h-3 bg-white/10 rounded-md w-1/3" />
                <div className="h-3 bg-white/10 rounded-md w-1/4" />
              </div>
              <div className="h-3 bg-white/10 rounded-md w-full" />
              <div className="h-3 bg-white/10 rounded-md w-5/6" />
              <div className="h-9 bg-white/10 rounded-xl w-full mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && opportunities.length === 0 && !error && (
        <div className="text-center py-16 text-slate-400 text-sm">
          No opportunities found. Try a different search or location.
        </div>
      )}

      {/* List */}
      {!loading && opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((opp, i) => (
            <div
              key={`${opp.id}-${i}`}
              onClick={() => openDetail(opp)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openDetail(opp)}
              className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-2.5 hover:border-indigo-500/40 transition-colors cursor-pointer"
            >
              <h3 className="font-bold text-white text-base leading-snug">{opp.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                {opp.company && <span className="font-semibold text-slate-300">{opp.company}</span>}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {opp.location}
                </span>
                {opp.salary && <span className="text-emerald-400 font-bold">{opp.salary}</span>}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed flex-1 line-clamp-3">{opp.description}</p>
              <button
                onClick={(e) => { e.stopPropagation(); openDetail(opp); }}
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalCount > RESULTS_PER_PAGE && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="p-2.5 rounded-xl border border-white/10 text-slate-300 hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-400">
            Page {page} of {totalPages.toLocaleString()}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="p-2.5 rounded-xl border border-white/10 text-slate-300 hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
