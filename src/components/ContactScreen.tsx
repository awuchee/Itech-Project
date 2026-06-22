"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactScreen() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8 text-slate-100">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mx-auto">
          <Mail className="w-7 h-7 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black">Contact <span className="text-indigo-400">Our Team</span></h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Have a question, partnership request, or feedback? We respond within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Mail, label: "Email", value: "support@globalopportunitieshub.com", color: "text-indigo-400" },
            { icon: Phone, label: "Phone", value: "+1 (800) 456-7890", color: "text-teal-400" },
            { icon: MapPin, label: "HQ", value: "London · Berlin · Accra", color: "text-orange-400" },
            { icon: MessageSquare, label: "Live Chat", value: "Available via AI Chatbot", color: "text-purple-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Icon className={`w-5 h-5 ${color} mt-0.5 flex-shrink-0`} />
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-wider">{label}</div>
                <div className="text-sm font-semibold text-white mt-0.5">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-white/5 border border-white/10">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
              <CheckCircle className="w-12 h-12 text-teal-400" />
              <h3 className="font-black text-xl text-white">Message Sent!</h3>
              <p className="text-slate-400 text-sm">Thanks {form.name}. We'll reply to {form.email} within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="Partnership / Support / General"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
