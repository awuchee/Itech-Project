"use client";

import React, { useState, useMemo } from "react";
import { Opportunity, UserProfile, ApplicationRecord } from "../types";
import { 
  Search, 
  MapPin, 
  Filter, 
  Bookmark, 
  ArrowUpRight, 
  Star, 
  Sparkles, 
  Award,
  BookOpen, 
  Globe, 
  X, 
  Check, 
  FileText,
  Clock,
  Briefcase
} from "lucide-react";

interface HomeScreenProps {
  opportunities: Opportunity[];
  userProfile: UserProfile | null;
  savedBookmarkIds: (string | number)[];
  onToggleBookmark: (opportunityId: string | number) => void;
  onApply: (opportunity: Opportunity, notes: string) => void;
  applicationRecords: ApplicationRecord[];
  onPreloadDoc: (opp: Opportunity) => void;
  onAddReview: (opportunityId: string | number, score: number) => void;
  defaultCategory?: string;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function HomeScreen({
  opportunities,
  userProfile,
  savedBookmarkIds,
  onToggleBookmark,
  onApply,
  applicationRecords,
  onPreloadDoc,
  onAddReview,
  defaultCategory = "Any",
  pageTitle = "Discover Global Work & Study Gateways",
  pageSubtitle = "Search top scholarships, jobs with visa sponsorship, government immigration visas, and fully funded pathways. Tailor your submission documents instantly using our integrated model intelligence.",
}: HomeScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Any");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  
  // Filter checkboxes
  const [fullyFundedOnly, setFullyFundedOnly] = useState(false);
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [noIeltsOnly, setNoIeltsOnly] = useState(false);
  const [govtSponsoredOnly, setGovtSponsoredOnly] = useState(false);

  // Selected opportunity for detail modal view
  const [detailOpp, setDetailOpp] = useState<Opportunity | null>(null);
  const [applyNotes, setApplyNotes] = useState("");
  const [showApplyPanel, setShowApplyPanel] = useState(false);
  const [hasAppliedForCurrent, setHasAppliedForCurrent] = useState(false);
  
  // Custom user rating score input state
  const [userRating, setUserRating] = useState<number>(5);

  // Get lists for drop-downs
  const countriesList = useMemo(() => {
    const list = new Set(opportunities.map(o => o.country));
    return ["Any", ...Array.from(list)];
  }, [opportunities]);

  const categoriesList = useMemo(() => {
    const list = new Set(opportunities.map(o => o.category));
    return ["Any", ...Array.from(list)];
  }, [opportunities]);

  // Apply filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Approve filter (We display APPROVED or preloaded items)
      if (opp.status && opp.status === "PENDING" && userProfile?.role !== "ADMIN") {
        return false;
      }

      const matchSearch = 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.eligibility.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCountry = selectedCountry === "Any" || opp.country === selectedCountry;
      const matchCategory = selectedCategory === "Any" || opp.category === selectedCategory;

      const matchFunding = !fullyFundedOnly || opp.isFullyFunded;
      const matchVisa = !visaSponsorshipOnly || opp.visaSponsorship;
      const matchRemote = !remoteOnly || opp.remote;
      const matchIelts = !noIeltsOnly || opp.noIeltsRequired;
      const matchGovt = !govtSponsoredOnly || opp.govtSponsored;

      return matchSearch && matchCountry && matchCategory && matchFunding && matchVisa && matchRemote && matchIelts && matchGovt;
    });
  }, [
    opportunities, 
    searchTerm, 
    selectedCountry, 
    selectedCategory, 
    fullyFundedOnly, 
    visaSponsorshipOnly, 
    remoteOnly, 
    noIeltsOnly, 
    govtSponsoredOnly,
    userProfile
  ]);

  // Detect application record
  const checkHasApplied = (oppId: string | number) => {
    return applicationRecords.some(app => app.opportunityId === oppId);
  };

  const handleOpenDetail = (opp: Opportunity) => {
    setDetailOpp(opp);
    setHasAppliedForCurrent(checkHasApplied(opp.id));
    setShowApplyPanel(false);
    setApplyNotes("");
  };

  const executeApply = () => {
    if (!detailOpp) return;
    onApply(detailOpp, applyNotes);
    setHasAppliedForCurrent(true);
    setShowApplyPanel(false);
  };

  const handleRatingSubmit = (oppId: string | number) => {
    onAddReview(oppId, userRating);
    // Refresh modal rating estimation block
    if (detailOpp && detailOpp.id === oppId) {
      setDetailOpp({
        ...detailOpp,
        rating: Math.min(5, Math.max(1, ((detailOpp.rating || 4.5) * 4 + userRating) / 5))
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Hub Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            <span>AI-Optimized Internships & Programs</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {pageTitle}
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {pageSubtitle}
          </p>
        </div>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative flex-1 col-span-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by keywords, organization, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          {/* Country Selection */}
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Any">🌎 All Countries / Anywhere</option>
              {countriesList.filter(c => c !== "Any").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Any">📚 All Formats/Categories</option>
              {categoriesList.filter(cat => cat !== "Any").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Feature Checkboxes / Quick Pills */}
        <div className="pt-2 flex flex-wrap gap-3 items-center">
          <span className="text-xs font-black uppercase text-slate-500 mr-2 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Filters:
          </span>

          <label className="flex items-center space-x-2 py-1.5 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none hover:border-indigo-500/50 hover:bg-slate-950/40 transition-colors">
            <input 
              type="checkbox" 
              checked={fullyFundedOnly} 
              onChange={() => setFullyFundedOnly(!fullyFundedOnly)}
              className="accent-indigo-500 w-3.5 h-3.5 rounded"
            />
            <span>Fully Funded</span>
          </label>

          <label className="flex items-center space-x-2 py-1.5 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none hover:border-indigo-500/50 hover:bg-slate-950/40 transition-colors">
            <input 
              type="checkbox" 
              checked={visaSponsorshipOnly} 
              onChange={() => setVisaSponsorshipOnly(!visaSponsorshipOnly)}
              className="accent-indigo-500 w-3.5 h-3.5 rounded"
            />
            <span>Visa Sponsorship</span>
          </label>

          <label className="flex items-center space-x-2 py-1.5 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none hover:border-indigo-500/50 hover:bg-slate-950/40 transition-colors">
            <input 
              type="checkbox" 
              checked={remoteOnly} 
              onChange={() => setRemoteOnly(!remoteOnly)}
              className="accent-indigo-500 w-3.5 h-3.5 rounded"
            />
            <span>Remote</span>
          </label>

          <label className="flex items-center space-x-2 py-1.5 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none hover:border-indigo-500/50 hover:bg-slate-950/40 transition-colors">
            <input 
              type="checkbox" 
              checked={noIeltsOnly} 
              onChange={() => setNoIeltsOnly(!noIeltsOnly)}
              className="accent-indigo-500 w-3.5 h-3.5 rounded"
            />
            <span>No IELTS Required</span>
          </label>

          <label className="flex items-center space-x-2 py-1.5 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none hover:border-indigo-500/50 hover:bg-slate-950/40 transition-colors">
            <input 
              type="checkbox" 
              checked={govtSponsoredOnly} 
              onChange={() => setGovtSponsoredOnly(!govtSponsoredOnly)}
              className="accent-indigo-500 w-3.5 h-3.5 rounded"
            />
            <span>Govt Sponsored</span>
          </label>
        </div>
      </div>

      {/* Search results status summary */}
      <div className="flex justify-between items-center text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-white">{filteredOpportunities.length}</span> opportunities match
        </div>
        <div>
          {savedBookmarkIds.length > 0 && (
            <span className="font-medium">
              Saved bookmarks: <span className="text-rose-400 font-bold">{savedBookmarkIds.length}</span> items
            </span>
          )}
        </div>
      </div>

      {/* Opportunities Grid List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOpportunities.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-white/5">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-1">No Opportunities Found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              We couldn't locate matching programs. Try adjusting your parameters or search query list!
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
            const isSaved = savedBookmarkIds.includes(opp.id);
            const applied = checkHasApplied(opp.id);

            return (
              <div 
                key={opp.id}
                className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/5">
                      {opp.category}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleBookmark(opp.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          isSaved 
                            ? "bg-rose-500/20 border-rose-500/30 text-rose-400" 
                            : "border-white/5 text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                        title={isSaved ? "Remove Bookmark" : "Save Opportunity"}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      {opp.isFeatured && (
                        <span className="inline-flex mt-0.5 items-center p-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0" title="Featured Highlight">
                          <Award className="w-3" />
                        </span>
                      )}
                      <h3 
                        onClick={() => handleOpenDetail(opp)}
                        className="text-lg font-black text-white hover:text-indigo-400 transition-colors cursor-pointer leading-tight line-clamp-1"
                      >
                        {opp.title}
                      </h3>
                    </div>

                    <div className="text-sm font-semibold text-slate-300 flex items-center space-x-1">
                      <span>{opp.organization}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-indigo-400">{opp.country}</span>
                    </div>

                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed pt-1">
                      {opp.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-400">
                    {opp.fundingAmount && (
                      <span className="bg-slate-950/30 py-1 px-2 rounded-md font-mono text-indigo-300 border border-white/5">
                        {opp.fundingAmount}
                      </span>
                    )}
                    {opp.visaSponsorship && (
                      <span className="bg-indigo-600/10 text-indigo-300 py-1 px-2 rounded-md">
                        ✈️ Visa Sponsorship
                      </span>
                    )}
                    {opp.isFullyFunded && (
                      <span className="bg-emerald-600/10 text-emerald-300 py-1 px-2 rounded-md">
                        💰 Fully Funded
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end">
                    {applied && (
                      <span className="px-2.5 py-1 bg-slate-800/80 rounded-xl border border-white/5 text-[11px] font-semibold text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Applied
                      </span>
                    )}
                    <button
                      onClick={() => handleOpenDetail(opp)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/10"
                    >
                      <span>Explore details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Opportunity Detail Slide-Over Modal */}
      {detailOpp && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-end bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="absolute inset-0" onClick={() => setDetailOpp(null)}></div>
          
          <div className="relative max-w-2xl w-full h-full glass-panel border-l border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-y-auto z-10 animate-slide-in">
            {/* Modal header */}
            <div className="p-6 border-b border-white/10 sticky top-0 bg-slate-950/80 backdrop-blur-md z-20 flex justify-between items-center">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-indigo-300 border border-indigo-505/20">
                  {detailOpp.category}
                </span>
                <h2 className="text-xl font-extrabold text-white mt-2 leading-tight">{detailOpp.title}</h2>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">{detailOpp.organization} — {detailOpp.country}</p>
              </div>
              <button 
                onClick={() => setDetailOpp(null)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Highlight statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/30 border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rating Score</div>
                  <div className="text-white font-mono text-base font-bold flex items-center mt-1">
                    <Star className="w-4 h-4 text-amber-400 mr-1 fill-amber-400" />
                    {detailOpp.rating ? detailOpp.rating.toFixed(1) : "4.5"} / 5.0
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/30 border border-white/5">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Deadline</div>
                  <div className="text-slate-200 text-sm font-semibold mt-1 truncate">{detailOpp.deadline}</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/30 border border-white/5 col-span-2 sm:col-span-1">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Compensation</div>
                  <div className="text-indigo-300 text-sm font-bold truncate mt-1">{detailOpp.fundingAmount || "No salary listed"}</div>
                </div>
              </div>

              {/* Bullet Features tags row */}
              <div className="flex flex-wrap gap-2 pt-1">
                {detailOpp.visaSponsorship && (
                  <span className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    ✈️ Visa Sponsorship
                  </span>
                )}
                {detailOpp.isFullyFunded && (
                  <span className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    💰 Fully Funded
                  </span>
                )}
                {detailOpp.remote && (
                  <span className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    🏠 Remote Only
                  </span>
                )}
                {detailOpp.noIeltsRequired && (
                  <span className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    🚫 No IELTS Required
                  </span>
                )}
                {detailOpp.govtSponsored && (
                  <span className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    🏛️ Government Program
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Description</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{detailOpp.description}</p>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Candidate Eligibility</h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-white/5">{detailOpp.eligibility}</p>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Key Benefits</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{detailOpp.benefits}</p>
                </div>
              </div>

              {/* Document Preloader redirection */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-indigo-400" /> Auto-draft resumes or essay
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Use AI Document Generator tailored to this opportunity's eligibility details.</p>
                </div>
                <button
                  onClick={() => {
                    onPreloadDoc(detailOpp);
                    setDetailOpp(null);
                  }}
                  className="px-4 py-2 bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl hover:bg-indigo-600/50 transition-all self-end"
                >
                  Draft Cover Letter
                </button>
              </div>

              {/* Submission Action Blocks */}
              {userProfile ? (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  {/* Application Form */}
                  {!hasAppliedForCurrent ? (
                    showApplyPanel ? (
                      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
                        <label className="block text-xs font-bold uppercase text-slate-400">Add Applicant Notes (Optional)</label>
                        <textarea
                          placeholder="Example: Eager to participate in this scholarship, I have precompiled cover letters in the console tab..."
                          value={applyNotes}
                          onChange={(e) => setApplyNotes(e.target.value)}
                          rows={3}
                          className="w-full p-3 bg-slate-950/60 border border-white/10 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                        />
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => setShowApplyPanel(false)}
                            className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={executeApply}
                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Submit Application</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowApplyPanel(true)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-5050 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-lg"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Apply For Opportunity</span>
                      </button>
                    )
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-sm font-bold flex items-center justify-center space-x-2">
                      <Check className="w-5 h-5" />
                      <span>Applied successfully! Status: Applied (Pending Sync)</span>
                    </div>
                  )}

                  {/* Rating Score Form */}
                  <div className="p-4 rounded-xl bg-slate-950/30 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-400">Submit User Rating</h4>
                      <p className="text-[11px] text-slate-500 leading-none mt-1">Grade the complexity of selection processes</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <select
                        value={userRating}
                        onChange={(e) => setUserRating(Number(e.target.value))}
                        className="bg-slate-900 border border-white/10 rounded-md py-1 px-2 text-slate-300 text-xs text-center"
                      >
                        <option value={5}>🌟 5 (Exceptional)</option>
                        <option value={4}>⭐ 4 (Great)</option>
                        <option value={3}>⭐ 3 (Average)</option>
                        <option value={2}>⭐ 2 (Tough)</option>
                        <option value={1}>⭐ 1 (Flawed)</option>
                      </select>

                      <button
                        onClick={() => handleRatingSubmit(detailOpp.id)}
                        className="py-1.5 px-3 bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 text-xs font-semibold rounded-lg transition-colors border border-indigo-500/20 hover:text-white"
                      >
                        Grade
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 text-center text-slate-400 text-xs mt-4">
                  🔒 Please <strong>Authenticate Portal</strong> to submit applications or bookmarks tracking.
                </div>
              )}

              {detailOpp.officialLink && (
                <a
                  href={detailOpp.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-slate-900 text-center hover:bg-slate-800 text-slate-200 border border-white/10 font-bold rounded-xl flex items-center justify-center space-x-2 transition-transform"
                >
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Explore Official Registry Hub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
