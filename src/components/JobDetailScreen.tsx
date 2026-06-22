"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, ExternalLink, ArrowLeft, AlertCircle } from "lucide-react";

interface LiveJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  applyUrl: string;
  description: string;
}

const sessionKey = (id: string) => `job_detail_${id}`;

export default function JobDetailScreen({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [job, setJob] = useState<LiveJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    // Instant path: the job was just clicked from the search list and is
    // already in this browser session — no network round-trip needed.
    const cached = sessionStorage.getItem(sessionKey(jobId));
    if (cached) {
      try {
        setJob(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {
        // fall through to network fetch on parse failure
      }
    }

    fetch(`/api/jobs/${jobId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (active) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (active && data.job) {
          setJob(data.job);
          sessionStorage.setItem(sessionKey(jobId), JSON.stringify(data.job));
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
  }, [jobId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5 animate-pulse" aria-busy="true" aria-label="Loading job details">
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

  if (notFound || !job) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-black text-white">Job listing not available</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          This listing may have expired from cache, or the link is invalid. Please search again to find live opportunities.
        </p>
        <button
          onClick={() => router.push("/jobs")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Board
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <button
        onClick={() => router.push("/jobs")}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Board
      </button>

      {/* Header */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-white/10 shadow-xl space-y-4">
        <h1 className="text-2xl md:text-3xl font-black text-white leading-snug">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
          <span className="flex items-center gap-1.5 font-semibold">
            <Building2 className="w-4 h-4 text-indigo-400" /> {job.company}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-400" /> {job.location}
          </span>
          {job.salary && (
            <span className="text-emerald-400 font-bold">{job.salary}</span>
          )}
        </div>

        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-colors"
        >
          Apply Now <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Full description */}
      <div className="rounded-3xl p-6 md:p-8 bg-white/5 border border-white/10">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">Job Description</h2>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
      </div>

      <div className="text-center">
        <a
          href={job.applyUrl}
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
