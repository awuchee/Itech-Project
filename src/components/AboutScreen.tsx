"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Globe, Users, Target, Award, ArrowRight } from "lucide-react";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10 text-slate-100">

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600/20 border border-teal-500/30 mx-auto">
          <Globe className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          About <span className="text-teal-400">Global Opportunities Hub</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          We connect ambitious individuals worldwide with life-changing opportunities — jobs, scholarships, apprenticeships, and nanny placements across 120+ countries.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Target, title: "Our Mission", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", body: "To democratize access to global opportunities so that talent anywhere can thrive everywhere." },
          { icon: Users, title: "Our Community", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", body: "Over 50,000 opportunity seekers have found jobs, scholarships, and placements through our platform." },
          { icon: Award, title: "Our Standards", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20", body: "Every listing is vetted by our team. We maintain a 98% placement satisfaction rate globally." },
        ].map(({ icon: Icon, title, color, bg, body }) => (
          <div key={title} className={`p-5 rounded-2xl border ${bg} space-y-3`}>
            <Icon className={`w-7 h-7 ${color}`} />
            <h3 className="font-black text-white">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h2 className="text-xl font-black text-white">Our Story</h2>
        <p className="text-slate-400 leading-relaxed">
          Global Opportunities Hub (GH) was founded with a single belief: geography should never limit potential. We built an intelligent platform that aggregates premium international opportunities, provides AI-powered application assistance, and supports candidates from first search to final placement.
        </p>
        <p className="text-slate-400 leading-relaxed">
          From DAAD and Fulbright scholarships to remote tech roles at leading multinationals, we curate only the most impactful listings — updated daily, across every discipline and country.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { value: "50,000+", label: "Opportunities" },
          { value: "120+", label: "Countries" },
          { value: "98%", label: "Satisfaction" },
          { value: "15k+", label: "Families Matched" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-2xl font-black text-teal-400">{s.value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={() => router.push("/jobs")}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition-all"
        >
          Explore All Opportunities <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
