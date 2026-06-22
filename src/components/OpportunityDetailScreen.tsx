"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, ExternalLink, ArrowLeft, AlertCircle, Tag, FileSignature } from "lucide-react";
import { UnifiedOpportunity } from "../lib/opportunities/types";
import { useApp } from "../contexts/AppContext";

const CATEGORY_BACK_ROUTE: Record<string, string> = {
  Jobs: "/jobs",
  Scholarships: "/scholarships",
  Apprenticeships: "/apprenticeships",
  "Nanny & Care": "/nanny",
};

const sessionKey = (id: string) => `opportunity_detail_${id}`;

export default function OpportunityDetailScreen({ opportunityId }: { opportunityId: string }) {
  const router = useRouter();
  const { handlePreloadDocDrawer } = useApp();
  const [opportunity, setOpportunity] = useState<UnifiedOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    // Instant path: the opportunity was just clicked from a search list and
    // is already in this browser session — no network round-trip needed.
    const cached = sessionStorage.getItem(sessionKey(opportunityId));
    if (cached) {
      try {
        setOpportunity(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {
        // fall through to network fetch on parse failure
      }
    }

    fetch(`/api/opportunities/${opportunityId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (active) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (active && data.opportunity) {
          setOpportunity(data.opportunity);
          sessionStorage.setItem(sessionKey(opportunityId), JSON.stringify(data.opportunity));
        } else if (active) {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [opportunityId]);

  const backRoute = opportunity ? (CATEGORY_BACK_ROUTE[opportunity.category] || "/jobs") : "/jobs";

  const draftDocuments = () => {
    if (!opportunity) return;
    handlePreloadDocDrawer({
      id: opportunity.id,
      title: opportunity.title,
      organization: opportunity.company || "Unknown Organization",
      country: opportunity.location,
      category: opportunity.category,
      deadline: "",
      fundingAmount: opportunity.salary || "N/A",
      isFullyFunded: false,
      eligibility: "See the full description for eligibility details.",
      description: opportunity.description,
      benefits: "N/A",
      officialLink: opportunity.applyUrl,
      datePosted: opportunity.postedAt,
      status: "APPROVED",
      visaSponsorship: false,
      remote: false,
      noIeltsRequired: false,
      govtSponsored: false,
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5 animate-pulse" aria-busy="true" aria-label="Loading opportunity details">
        <div className="h-5 bg-white/10 rounded-md w-32" />
        <div className="rounded-3xl p-6 md:p-8 bg-white/5 border border-white/10 space-y-4">
          <div className="h-8 bg-white/10 rounded-md w-3/4" />
          <div className="h-4 bg-white/10 rounded-md w-1/2" />
          <div className="h-4 bg-white/10 rounded-md w-1/3" />
        </div>
        <div className="rounded-3xl p-6 md:p-8 bg-white/5 border border-white/10 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-white/10 rounded-md" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !opportunity) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-black text-white">Opportunity not available</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          This listing may have expired from cache, or the link is invalid. Please search again to find live opportunities.
        </p>
        <button
          onClick={() => router.push("/jobs")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <button
        onClick={() => router.push(backRoute)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to {opportunity.category}
      </button>

      {/* Header */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-white/10 shadow-xl space-y-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <Tag className="w-3 h-3" /> {opportunity.category}
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white leading-snug">{opportunity.title}</h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
          {opportunity.company && (
            <span className="flex items-center gap-1.5 font-semibold">
              <Building2 className="w-4 h-4 text-indigo-400" /> {opportunity.company}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-400" /> {opportunity.location}
          </span>
          {opportunity.salary && (
            <span className="text-emerald-400 font-bold">{opportunity.salary}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={opportunity.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-colors"
          >
            Apply Now <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={draftDocuments}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors"
          >
            Draft Cover Letter / CV <FileSignature className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full description */}
      <div className="rounded-3xl p-6 md:p-8 bg-white/5 border border-white/10">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">Description</h2>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{opportunity.description}</p>
      </div>

      <div className="text-center">
        <a
          href={opportunity.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-colors"
        >
          Apply Now <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
