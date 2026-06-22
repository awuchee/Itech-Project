"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Briefcase,
  GraduationCap,
  HardHat,
  Heart,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle,
  Shield,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
} from "lucide-react";
import { Opportunity } from "../types";

interface LandingPageProps {
  opportunities: Opportunity[];
}

export default function LandingPage({ opportunities }: LandingPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const approved = opportunities.filter(
    (o) => o.status === "APPROVED" || o.status === "Active"
  );
  const scholarships = approved
    .filter((o) => o.category === "Scholarships")
    .slice(0, 3);

  const handleSearch = () => router.push("/jobs");
  const handleSubscribe = () => {
    if (email.includes("@")) setSubscribed(true);
  };

  return (
    <div className="landing-root bg-white">

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 480 }}>
        {/* Background layers */}
        <div className="absolute inset-0 landing-hero-bg" />
        <div className="absolute inset-0 landing-hero-overlay" />

        {/* Decorative globe grid — right side */}
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none opacity-[0.12]">
          <svg viewBox="0 0 500 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="220" stroke="white" strokeWidth="1.5" fill="none" />
            <ellipse cx="250" cy="250" rx="100" ry="220" stroke="white" strokeWidth="1" fill="none" />
            <ellipse cx="250" cy="250" rx="220" ry="80" stroke="white" strokeWidth="1" fill="none" />
            <ellipse cx="250" cy="250" rx="220" ry="160" stroke="white" strokeWidth="0.7" fill="none" />
            {[100,150,200,250,300,350,400].map((y) => (
              <line key={y} x1="30" y1={y} x2="470" y2={y} stroke="white" strokeWidth="0.6" strokeOpacity="0.6" />
            ))}
            {[100,150,200,250,300,350,400].map((x) => (
              <line key={x} x1={x} y1="30" x2={x} y2="470" stroke="white" strokeWidth="0.6" strokeOpacity="0.6" />
            ))}
            <circle cx="250" cy="250" r="8" fill="rgba(255,255,255,0.6)" />
            {[[120,130],[380,200],[300,380],[170,340],[420,340]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.4)" />
            ))}
          </svg>
        </div>

        {/* Decorative glow blobs */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-10 w-60 h-60 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            🌍 500+ Global Opportunities Updated Daily
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.1] mb-5 tracking-tight">
            Unlock Your Potential Anywhere:
            <br />
            <span className="text-teal-300">Premium Global Opportunities Hub</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-8 font-medium leading-relaxed">
            Jobs, Scholarships, Apprenticeships, Nanny Placements.
            <br className="hidden sm:block" />
            Your Global Future Starts Here.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 max-w-2xl mx-auto mb-7">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Type, Industry, Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-sm font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl shadow-xl transition-all whitespace-nowrap text-sm"
            >
              Search All Opportunities
            </button>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white/75">
            <span className="font-bold text-white/60">Quick Links</span>
            {[
              "Top Remote Roles",
              "Fully Funded Grants",
              "Tech Apprenticeships",
              "Live-in Nanny",
            ].map((label, i, arr) => (
              <React.Fragment key={label}>
                <button
                  onClick={handleSearch}
                  className="hover:text-teal-300 hover:underline underline-offset-2 transition-colors font-semibold"
                >
                  [ {label} ]
                </button>
                {i < arr.length - 1 && (
                  <span className="text-white/30 hidden sm:inline">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURE CARDS ═══════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <JobBoardCard />
          <ScholarshipCard scholarships={scholarships} />
          <ApprenticeshipsCard />
          <NannyCareCard />
        </div>
      </section>

      {/* ═══════════════════════════ STATS BAND ═══════════════════════════ */}
      <section className="bg-gray-50 border-y border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50,000+", label: "Opportunities Listed" },
            { value: "120+", label: "Countries Covered" },
            { value: "98%", label: "Placement Success" },
            { value: "15,000+", label: "Families Matched" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-teal-600 mb-1">{s.value}</div>
              <div className="text-sm font-semibold text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════ NEWSLETTER ═══════════════════════════ */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 mb-4">
            <Mail className="w-6 h-6 text-teal-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Never Miss an Opportunity.
          </h2>
          <p className="text-gray-500 font-medium mb-6">
            Get Weekly Global Listings in Your Inbox.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-teal-600 font-bold text-sm">
              <CheckCircle className="w-5 h-5" />
              You&apos;re subscribed! Check your inbox for a confirmation.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-50"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow transition-all whitespace-nowrap"
              >
                [ Subscribe for Free ]
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-white text-sm">
                <span className="text-teal-400">Global</span> Opportunities Hub
              </span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs font-semibold">
              {[
                { label: "About Us", href: "/about" },
                { label: "Trust & Safety", href: "/jobs" },
                { label: "Contact Support", href: "/contact" },
                { label: "Privacy Policy", href: "/jobs" },
                { label: "Terms", href: "/jobs" },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => router.push(link.href)}
                  className="hover:text-teal-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-800 pt-5 text-center text-xs">
            © 2026 Global Opportunities Hub (GH) · Jobs · Scholarships · Apprenticeships · Nanny Placements
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CARD 1 — Global Job Board (live Adzuna preview)
══════════════════════════════════════════════ */
interface LiveJobPreview {
  title: string;
  company: string;
  location: string;
  salary: string | null;
  applyUrl: string;
}

const COMPANY_COLORS = ["#0d9488", "#635bff", "#f26522", "#0ea5e9", "#34a853"];

function JobBoardCard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<LiveJobPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/jobs/search?page=1")
      .then((res) => res.json())
      .then((data) => {
        if (active) setJobs((data.jobs || []).slice(0, 3));
      })
      .catch(() => {
        if (active) setJobs([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="feature-card rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white text-base leading-tight">Global Job Board</h3>
            <p className="text-orange-100 text-[11px] font-medium">Live International Careers</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-white p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-black text-gray-700">Featured Live Jobs</span>
        </div>

        {/* Job rows */}
        {loading ? (
          <div className="py-6 text-center text-xs text-gray-400 font-semibold">Loading live jobs…</div>
        ) : jobs.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400 font-semibold">No live jobs available right now.</div>
        ) : (
          jobs.map((job, i) => (
            <div
              key={`${job.applyUrl}-${i}`}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all cursor-pointer group"
              onClick={() => router.push("/jobs")}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0 shadow-sm"
                style={{ background: COMPANY_COLORS[i % COMPANY_COLORS.length] }}
              >
                {job.company[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-800 truncate group-hover:text-orange-700">
                  {job.title}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  <span className="truncate">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="text-[10px] font-semibold text-teal-600 mt-0.5 truncate">
                    {job.salary}
                  </div>
                )}
              </div>
              <button className="text-[10px] bg-orange-500 hover:bg-orange-600 text-white font-bold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap flex-shrink-0">
                Apply Now
              </button>
            </div>
          ))
        )}

        <button
          onClick={() => router.push("/jobs")}
          className="mt-auto flex items-center justify-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 py-2 border-t border-gray-50 hover:underline transition-colors"
        >
          Browse All Jobs <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CARD 2 — Scholarship Opportunities
══════════════════════════════════════════════ */
function ScholarshipCard({ scholarships }: { scholarships: Opportunity[] }) {
  const router = useRouter();
  const items = scholarships.length
    ? scholarships
    : [
        { id: "s1", title: "Global STEM Innovators Grant – Full Tuition", organization: "Global STEM Innovators Grant", deadline: "Oct 15", isFullyFunded: true },
        { id: "s2", title: "Women in Leadership Award – $15,000", organization: "Women in Leadership Awrd – $15,000", deadline: "Nov 01", isFullyFunded: false },
        { id: "s3", title: "International Arts Fellowship – Fully Funded", organization: "International Arts Fellowship", deadline: "Nov 01", isFullyFunded: true },
      ];

  return (
    <div className="feature-card rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white text-base leading-tight">Scholarship Opportunities</h3>
            <p className="text-slate-300 text-[11px] font-medium">Academic Funding</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-white p-4 flex flex-col gap-3">
        <div className="text-xs font-black text-gray-700 mb-1">Fund Your Education</div>

        {items.slice(0, 3).map((s: any, i: number) => {
          const icons = ["🏆", "🎖️", "🌐"];
          const iconBgs = ["bg-amber-50 border-amber-200", "bg-purple-50 border-purple-200", "bg-teal-50 border-teal-200"];
          const iconColors = ["text-amber-500", "text-purple-500", "text-teal-500"];
          const deadline = s.deadline?.includes("-")
            ? new Date(s.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : s.deadline;

          return (
            <div key={s.id} className="flex gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer group" onClick={() => router.push("/jobs")}>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 text-base ${iconBgs[i]}`}>
                {icons[i]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-800 leading-tight truncate group-hover:text-slate-900">
                  {s.title.length > 38 ? s.title.slice(0, 38) + "…" : s.title}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 truncate">{s.organization}</div>
                <div className="flex items-center gap-2 mt-1">
                  {s.isFullyFunded && (
                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                      Fully Funded
                    </span>
                  )}
                  <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {deadline}
                  </span>
                </div>
              </div>
              <button className="text-[10px] text-slate-500 hover:text-slate-700 font-bold whitespace-nowrap self-start mt-0.5 hover:underline">
                Learn More
              </button>
            </div>
          );
        })}

        <button
          onClick={() => router.push("/jobs")}
          className="mt-auto flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 py-2 border-t border-gray-50 hover:underline transition-colors"
        >
          All Scholarships <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CARD 3 — Apprenticeships
══════════════════════════════════════════════ */
const APPRENTICESHIPS = [
  {
    title: "Tech & IT Apprentice Fast-Track",
    color: "from-blue-500 to-cyan-500",
    icon: "💻",
    duration: "12 months",
    entry: "A-Level / BTEC",
    perks: "Paid from Day 1",
  },
  {
    title: "Skilled Trades Apprentice",
    color: "from-amber-500 to-orange-400",
    icon: "🔧",
    duration: "24 months",
    entry: "GCSE minimum",
    perks: "Tools provided",
  },
  {
    title: "Digital Marketing Apprentice",
    color: "from-pink-500 to-rose-400",
    icon: "📱",
    duration: "18 months",
    entry: "Open entry",
    perks: "Remote available",
  },
];

function ApprenticeshipsCard() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i - 1 + APPRENTICESHIPS.length) % APPRENTICESHIPS.length);
  const next = () => setIdx((i) => (i + 1) % APPRENTICESHIPS.length);

  const visible = [
    APPRENTICESHIPS[idx % APPRENTICESHIPS.length],
    APPRENTICESHIPS[(idx + 1) % APPRENTICESHIPS.length],
    APPRENTICESHIPS[(idx + 2) % APPRENTICESHIPS.length],
  ].slice(0, 3);

  return (
    <div className="feature-card rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white text-base leading-tight">Apprenticeships</h3>
            <p className="text-amber-100 text-[11px] font-medium">Earn While You Learn</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-white p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-gray-700">Learn and Earn</span>
          <div className="flex gap-1">
            <button onClick={prev} className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-amber-50 hover:border-amber-300 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button onClick={next} className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-amber-50 hover:border-amber-300 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {visible.map((a, i) => (
            <div
              key={i}
              className={`flex-1 rounded-xl bg-gradient-to-br ${a.color} p-3 text-white cursor-pointer hover:scale-[1.03] transition-transform shadow-sm`}
              onClick={() => router.push("/jobs")}
            >
              <div className="text-2xl mb-1.5">{a.icon}</div>
              <div className="text-[11px] font-black leading-tight">{a.title}</div>
            </div>
          ))}
        </div>

        {/* Details of active */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
            {visible[0].title}
          </div>
          <div className="space-y-1">
            {[
              { icon: "⏱", label: "Show duration", val: visible[0].duration },
              { icon: "📋", label: "Key entrl reqs", val: visible[0].entry },
              { icon: "⭐", label: "Key perks", val: visible[0].perks },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-1.5 text-[10px] text-gray-600">
                <span>{row.icon}</span>
                <span className="font-semibold">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/jobs")}
          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors mt-auto"
        >
          [ Apply ]
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CARD 4 — Nanny & Care
══════════════════════════════════════════════ */
const NANNY_TYPES = [
  { title: "Au Pair", location: "Paris, France", color: "from-rose-400 to-pink-500", emoji: "👩‍👧" },
  { title: "Newborn Care Specialist", location: "Dubai, UAE", color: "from-violet-400 to-purple-500", emoji: "👶" },
  { title: "Temporary Travel Nanny", location: "London, UK", color: "from-sky-400 to-blue-500", emoji: "✈️" },
];

function NannyCareCard() {
  const router = useRouter();
  return (
    <div className="feature-card rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-teal-700 to-teal-600">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white text-base leading-tight">Nanny & Care</h3>
            <p className="text-teal-200 text-[11px] font-medium">Trusted Caregiving</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-white p-4 flex flex-col">
        <div className="text-xs font-black text-gray-700 mb-3">Global Caregiving Connect</div>

        {/* Profile grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {NANNY_TYPES.map((n) => (
            <div
              key={n.title}
              className="cursor-pointer group"
              onClick={() => router.push("/jobs")}
            >
              <div className={`rounded-xl bg-gradient-to-br ${n.color} aspect-square flex items-center justify-center text-3xl mb-1.5 group-hover:scale-105 transition-transform shadow-sm`}>
                {n.emoji}
              </div>
              <div className="text-[10px] font-bold text-gray-700 text-center leading-tight">{n.title}</div>
              <div className="text-[9px] text-gray-400 text-center">{n.location}</div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-[10px] font-bold text-emerald-700">Background Verified</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-2">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="text-[10px] font-bold text-blue-700">Visa Support</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/jobs")}
          className="mt-auto w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors"
        >
          [ View Family Profiles ]
        </button>
      </div>
    </div>
  );
}
