"use client";

import React, { useState } from "react";
import { UserProfile, ApplicationRecord } from "../types";
import { 
  User, 
  Send, 
  Clock, 
  Trash2, 
  Save, 
  Settings, 
  Building, 
  BookOpen, 
  ToggleLeft, 
  Check, 
  ListChecks,
  AlertTriangle,
  Briefcase
} from "lucide-react";

interface UserDashboardScreenProps {
  userProfile: UserProfile | null;
  applicationRecords: ApplicationRecord[];
  onSaveProfile: (profile: UserProfile) => void;
  onWithdrawApplication: (applicationId: string | number) => void;
}

export default function UserDashboardScreen({
  userProfile,
  applicationRecords,
  onSaveProfile,
  onWithdrawApplication
}: UserDashboardScreenProps) {
  const [fullName, setFullName] = useState(userProfile?.fullName || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [education, setEducation] = useState(userProfile?.education || "");
  const [experience, setExperience] = useState(userProfile?.experience || "");
  const [skills, setSkills] = useState(userProfile?.skills || "");
  const [cvText, setCvText] = useState(userProfile?.cvText || "");
  const [preferredCountry, setPreferredCountry] = useState(userProfile?.preferredCountry || "Any");
  const [preferredCategory, setPreferredCategory] = useState(userProfile?.preferredCategory || "Any");

  // Checkbox maps
  const [noIeltsChecked, setNoIeltsChecked] = useState(userProfile?.noIeltsChecked || false);
  const [visaSponsorshipNeeded, setVisaSponsorshipNeeded] = useState(userProfile?.visaSponsorshipNeeded || false);
  const [remoteOnly, setRemoteOnly] = useState(userProfile?.remoteOnly || false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setSaving(true);
    setMessage("");

    const updatedProfile: UserProfile = {
      email: userProfile?.email || "richardprempe@gmail.com",
      role: userProfile?.role || "CANDIDATE",
      fullName,
      phone,
      education,
      experience,
      skills,
      cvText,
      preferredCountry,
      preferredCategory,
      noIeltsChecked,
      visaSponsorshipNeeded,
      remoteOnly
    };

    setTimeout(() => {
      onSaveProfile(updatedProfile);
      setSaving(false);
      setMessage("Candidate console synchronized with Firestore successfully!");
      setTimeout(() => setMessage(""), 3000);
    }, 800);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Offer":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "Interview":
        return "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
      case "In Review":
        return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "Closed":
        return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      default:
        return "bg-slate-800 border-white/5 text-slate-300";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile detail editor form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-black text-white">Candidate Console Dashboard</h2>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elizabeth Vance"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Identifier</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 012-9283"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Academic Degrees & Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="BSc. in Mathematics, MIT (2025)"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Skills Keywords (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, LaTeX Research, English C1, Data Processing"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Professional Experience & Projects</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="List core research projects, professional milestones, or past jobs..."
              rows={4}
              className="w-full p-4 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Raw Resume Text Buffer (Optimizes covers drafting)</label>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your raw text resume directly. Our generator references this database text when crafting templates."
              rows={5}
              className="w-full p-4 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-5050 text-white font-black text-sm rounded-xl flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-40 shadow-lg shadow-indigo-600/10"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-0.5" />
                <span>Save & Sync Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Constraints and Live trackers list */}
      <div className="space-y-6">
        {/* Onboarding Preferences */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider flex items-center">
            <ListChecks className="w-4 h-4 mr-1.5 text-indigo-400" /> Preferences Checklist:
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <span className="text-xs text-slate-200">Require Visa Sponsorship</span>
              <input 
                type="checkbox" 
                checked={visaSponsorshipNeeded} 
                onChange={() => setVisaSponsorshipNeeded(!visaSponsorshipNeeded)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <span className="text-xs text-slate-200">Exempt from IELTS / TOEFL</span>
              <input 
                type="checkbox" 
                checked={noIeltsChecked} 
                onChange={() => setNoIeltsChecked(!noIeltsChecked)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <span className="text-xs text-slate-200">Remote Opportunities Only</span>
              <input 
                type="checkbox" 
                checked={remoteOnly} 
                onChange={() => setRemoteOnly(!remoteOnly)}
                className="w-4 h-4 accent-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Dynamic Registered Application Logs timeline */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-indigo-400 animate-pulse" /> My Application Submissions:
          </h3>

          {applicationRecords.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 font-semibold space-y-2">
              <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No active opportunity logs reported. Head to 'Discover' to submit an application!</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[300px] scrollbar pr-1">
              {applicationRecords.map((app) => (
                <div 
                  key={app.id}
                  className="p-3 bg-slate-950/30 border border-white/5 rounded-xl space-y-2 relative"
                >
                  <button
                    onClick={() => onWithdrawApplication(app.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-all"
                    title="Withdraw application log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="pr-6 space-y-1">
                    <h4 className="text-xs font-black text-white line-clamp-1">{app.opportunityTitle}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center">
                      <Building className="w-3 h-3 mr-1 text-slate-500" /> {app.organization}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] font-semibold text-slate-500">Submitted: {app.appliedDate}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
