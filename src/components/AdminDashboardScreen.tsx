"use client";

import React, { useState } from "react";
import { Opportunity, UserProfile } from "../types";
import { 
  PlusCircle, 
  Check, 
  Trash2, 
  ArrowUpRight, 
  AlertTriangle, 
  Clock, 
  FileCheck,
  ShieldCheck,
  Globe,
  Settings
} from "lucide-react";

interface AdminDashboardScreenProps {
  opportunities: Opportunity[];
  userProfile: UserProfile | null;
  onPostOpportunity: (opp: Omit<Opportunity, "id">) => void;
  onApproveOpportunity: (id: string | number) => void;
  onRejectOpportunity: (id: string | number) => void;
}

export default function AdminDashboardScreen({
  opportunities,
  userProfile,
  onPostOpportunity,
  onApproveOpportunity,
  onRejectOpportunity
}: AdminDashboardScreenProps) {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("Germany");
  const [category, setCategory] = useState("Scholarships");
  const [deadline, setDeadline] = useState("2026-12-31");
  const [fundingAmount, setFundingAmount] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [officialLink, setOfficialLink] = useState("");

  // Tag values
  const [isFullyFunded, setIsFullyFunded] = useState(false);
  const [visaSponsorship, setVisaSponsorship] = useState(true);
  const [remote, setRemote] = useState(false);
  const [noIeltsRequired, setNoIeltsRequired] = useState(false);
  const [govtSponsored, setGovtSponsored] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Get list of pending submissions
  const pendingOpportunities = opportunities.filter((opp) => opp.status === "PENDING" || opp.status === "Pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization || !eligibility || !description) {
      alert("Please fill in core fields: title, company, description, eligibility requirements.");
      return;
    }

    setSaving(true);
    
    // Auto-approve if created by Admin
    const initialStatus = userProfile?.role === "ADMIN" ? "APPROVED" : "PENDING";

    const newOpp: Omit<Opportunity, "id"> = {
      title,
      organization,
      country,
      category,
      deadline,
      fundingAmount: fundingAmount || "N/A",
      isFullyFunded,
      eligibility,
      description,
      benefits: benefits || "N/A",
      officialLink: officialLink || "https://example.com",
      datePosted: new Date().toISOString().split("T")[0],
      status: initialStatus,
      isFeatured: false,
      visaSponsorship,
      remote,
      noIeltsRequired,
      govtSponsored,
      rating: 4.5,
      creatorEmail: userProfile?.email || "richardprempe@gmail.com"
    };

    setTimeout(() => {
      onPostOpportunity(newOpp);
      setSaving(false);
      setMessage(
        initialStatus === "APPROVED" 
          ? "Opportunity posted directly live to Cloud Firestore!" 
          : "Opportunity submitted successfully for Admin review approval!"
      );
      
      // Reset form variables
      setTitle("");
      setOrganization("");
      setFundingAmount("");
      setEligibility("");
      setDescription("");
      setBenefits("");
      setOfficialLink("");
      
      setTimeout(() => setMessage(""), 3000);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Post New Form wizard */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <PlusCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-black text-white">Post New Global Opportunity</h2>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Opportunity title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="DAAD Doctoral Research Grant"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-505"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Issuing Organization / Company</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="German Academic Exchange Service"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-505"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-505"
              >
                <option value="Germany">Germany 🇩🇪</option>
                <option value="Canada">Canada 🇨🇦</option>
                <option value="United Kingdom">United Kingdom 🇬🇧</option>
                <option value="Japan">Japan 🇯🇵</option>
                <option value="Australia">Australia 🇦🇺</option>
                <option value="United States">United States 🇺🇸</option>
                <option value="Ireland">Ireland 🇮🇪</option>
                <option value="Switzerland">Switzerland 🇨🇭</option>
                <option value="Anywhere">Anywhere / Remote 🌎</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-505"
              >
                <option value="Scholarships">Scholarships</option>
                <option value="Apprenticeships">Apprenticeships</option>
                <option value="Nanny & Care">Nanny &amp; Care</option>
                <option value="Internships">Internships</option>
                <option value="Immigration Programs">Immigration Programs</option>
                <option value="Startup Funding">Startup Funding</option>
                <option value="Conferences">Conferences</option>
                <option value="Grants">Grants</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Deadline Date</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-505"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Compensation / Stipend amount</label>
              <input
                type="text"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                placeholder="e.g. €1,300/Month Stipend + Flights"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-505"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Candidate Selection Eligibility</label>
            <textarea
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="e.g. Bachelor or Master degree in Science fields, score level of IELTS 6.5 or equivalent research outlines proposals..."
              rows={3}
              className="w-full p-4 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-505 placeholder:text-slate-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Core Description of Tasks & Responsibilities</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive breakdown detailing research structures or workplace roles..."
              rows={4}
              className="w-full p-4 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-505 placeholder:text-slate-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Specific Benefits & Allowances</label>
              <input
                type="text"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="Health coverage, settle allowance, RSUs options..."
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-505"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Official Portal Registry Link</label>
              <input
                type="url"
                value={officialLink}
                onChange={(e) => setOfficialLink(e.target.value)}
                placeholder="https://daad.de/grant"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-505"
              />
            </div>
          </div>

          {/* Inline switches/checkbox maps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <label className="flex items-center space-x-2 py-2 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={isFullyFunded} 
                onChange={() => setIsFullyFunded(!isFullyFunded)}
                className="accent-indigo-500 w-3.5 h-3.5"
              />
              <span>Fully Funded</span>
            </label>

            <label className="flex items-center space-x-2 py-2 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={visaSponsorship} 
                onChange={() => setVisaSponsorship(!visaSponsorship)}
                className="accent-indigo-500 w-3.5 h-3.5"
              />
              <span>Visa Sponsorship</span>
            </label>

            <label className="flex items-center space-x-2 py-2 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={remote} 
                onChange={() => setRemote(!remote)}
                className="accent-indigo-500 w-3.5 h-3.5"
              />
              <span>Remote Only</span>
            </label>

            <label className="flex items-center space-x-2 py-2 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={noIeltsRequired} 
                onChange={() => setNoIeltsRequired(!noIeltsRequired)}
                className="accent-indigo-500 w-3.5 h-3.5"
              />
              <span>No IELTS required</span>
            </label>

            <label className="flex items-center space-x-2 py-2 px-3 rounded-lg border border-white/5 bg-slate-950/25 text-xs text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={govtSponsored} 
                onChange={() => setGovtSponsored(!govtSponsored)}
                className="accent-indigo-500 w-3.5 h-3.5"
              />
              <span>Govt Sponsored</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-50 text-white font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-40"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <span>Publish Opportunity List</span>
            )}
          </button>
        </form>
      </div>

      {/* Moderation section approval queue */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h2 className="text-xl font-black text-white">Pending Moderation Queue</h2>
        </div>

        {pendingOpportunities.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center space-y-3">
            <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-white font-bold text-sm">Review Queue Empty</h4>
            <p className="text-slate-500 text-xs max-w-xs mx-auto leading-normal">
              Excellent! No pending applicant or recruiter submittals require moderator validation.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar">
            {pendingOpportunities.map((opp) => (
              <div 
                key={opp.id}
                className="p-5 bg-slate-950/30 border border-white/10 rounded-2xl space-y-3 relative"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase bg-rose-500/10 text-rose-300 py-0.5 px-2 rounded-full border border-rose-500/25">
                    Needs Review
                  </span>
                  <h3 className="text-sm font-black text-white pt-1">{opp.title}</h3>
                  <div className="text-[11px] font-semibold text-slate-400">
                    {opp.organization} — <strong className="text-indigo-400">{opp.country}</strong>
                  </div>
                </div>

                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed border-t border-white/5 pt-2">
                  <strong>Description:</strong> {opp.description}
                </p>

                <div className="flex space-x-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onApproveOpportunity(opp.id)}
                    className="flex-1 py-2 bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-extrabold rounded-lg flex items-center justify-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onRejectOpportunity(opp.id)}
                    className="flex-1 py-2 bg-slate-800 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 border border-white/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Console info metrics */}
        <div className="p-4 bg-indigo-950/15 border border-indigo-500/20 rounded-2xl space-y-1">
          <h4 className="text-xs font-black text-white uppercase flex items-center">
            <Globe className="w-3.5 h-3.5 mr-1 text-indigo-400" /> Database Live Information Metrics
          </h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Your publisher panel controls synchronize immediately across all connecting instances. Pre-loaded mocks are seedeed natively.
          </p>
        </div>
      </div>
    </div>
  );
}
