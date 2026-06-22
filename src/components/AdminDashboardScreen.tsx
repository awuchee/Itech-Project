"use client";

import React, { useEffect, useState } from "react";
import { UnifiedOpportunity } from "../lib/opportunities/types";
import {
  PlusCircle,
  Trash2,
  Pencil,
  X,
  Check,
  ShieldCheck,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

const emptyForm = { title: "", company: "", location: "", salary: "", applyUrl: "", description: "" };

export default function AdminDashboardScreen() {
  const [scholarships, setScholarships] = useState<UnifiedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/scholarships");
      const data = await res.json();
      setScholarships(data.scholarships || []);
    } catch {
      setError("Failed to load scholarships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  const startEdit = (s: UnifiedOpportunity) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      company: s.company || "",
      location: s.location,
      salary: s.salary || "",
      applyUrl: s.applyUrl,
      description: s.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.company || !form.location || !form.applyUrl || !form.description) {
      setError("Title, organization, location, official link, and description are all required.");
      return;
    }

    setSaving(true);
    try {
      const isEditing = !!editingId;
      const res = await fetch(
        isEditing ? `/api/admin/scholarships/${editingId}` : "/api/admin/scholarships",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed.");
      }

      setMessage(isEditing ? "Scholarship updated." : "Scholarship published live.");
      setForm(emptyForm);
      setEditingId(null);
      await loadScholarships();
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this scholarship from the platform?")) return;
    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      setScholarships((prev) => prev.filter((s) => s.id !== id));
      if (editingId === id) cancelEdit();
    } catch {
      setError("Failed to delete scholarship.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Add / edit form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <PlusCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-black text-white">
            {editingId ? "Edit Scholarship" : "Publish New Scholarship"}
          </h2>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Scholarships are part of the internal dataset — published instantly and visible immediately
          on the live Scholarships page, no moderation queue needed. Jobs, Apprenticeships, and Nanny & Care
          are sourced automatically from live job APIs and aren&apos;t managed here.
        </p>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scholarship Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="DAAD Doctoral Research Grant"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Issuing Organization</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="German Academic Exchange Service"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Germany"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Funding / Stipend</label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="€1,300/month + tuition"
                className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Official Link</label>
            <input
              type="url"
              value={form.applyUrl}
              onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
              placeholder="https://daad.de/en"
              className="w-full px-4 py-3 bg-slate-950/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Eligibility, funding details, application process..."
              rows={4}
              className="w-full p-4 bg-slate-950/40 border border-white/10 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {editingId ? "Save Changes" : "Publish Live"}
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing scholarships list */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-black text-white">Live Scholarships ({scholarships.length})</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar">
            {scholarships.map((s) => (
              <div key={s.id} className="p-5 bg-slate-950/30 border border-white/10 rounded-2xl space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white">{s.title}</h3>
                  <div className="text-[11px] font-semibold text-slate-400">
                    {s.company} — <strong className="text-indigo-400">{s.location}</strong>
                  </div>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed border-t border-white/5 pt-2">
                  {s.description}
                </p>
                <div className="flex space-x-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => startEdit(s)}
                    className="flex-1 py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-extrabold rounded-lg flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="flex-1 py-2 bg-slate-800 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 border border-white/5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
