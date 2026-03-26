"use client";

import React, { useState } from "react";
import type { FeedbackItem } from "./feedbackItem";
import type { Recommendation, RecommendationCategory } from "./recommendationType";

// ─── Category styles ──────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  RecommendationCategory,
  { label: string; badge: string; highlight: string; highlightActive: string }
> = {
  technical:  { label: "Technical",   badge: "bg-blue-100 text-blue-700",   highlight: "bg-blue-100",   highlightActive: "bg-blue-300" },
  experience: { label: "Experience",  badge: "bg-purple-100 text-purple-700", highlight: "bg-purple-100", highlightActive: "bg-purple-300" },
  education:  { label: "Education",   badge: "bg-indigo-100 text-indigo-700", highlight: "bg-indigo-100", highlightActive: "bg-indigo-300" },
  softSkills: { label: "Soft Skills", badge: "bg-teal-100 text-teal-700",   highlight: "bg-teal-100",   highlightActive: "bg-teal-300" },
  formatting: { label: "Formatting",  badge: "bg-gray-100 text-gray-600",   highlight: "bg-gray-200",   highlightActive: "bg-gray-400" },
  keywords:   { label: "Keywords",    badge: "bg-red-100 text-red-700",     highlight: "bg-red-100",    highlightActive: "bg-red-300" },
};

// ─── Segment builder ─────────────────────────────────────────────────────────

type Segment = {
  text: string;
  recId: string | null;
  category: RecommendationCategory | null;
};

function buildSegments(resumeText: string, recommendations: Recommendation[]): Segment[] {
  let segments: Segment[] = [{ text: resumeText, recId: null, category: null }];

  for (const rec of recommendations) {
    if (!rec.originalText) continue;
    const escaped = rec.originalText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    const next: Segment[] = [];

    for (const seg of segments) {
      if (seg.recId !== null) { next.push(seg); continue; }
      let last = 0;
      let m: RegExpExecArray | null;
      regex.lastIndex = 0;
      while ((m = regex.exec(seg.text)) !== null) {
        if (m.index > last) next.push({ text: seg.text.slice(last, m.index), recId: null, category: null });
        next.push({ text: m[0], recId: rec.id, category: rec.category });
        last = regex.lastIndex;
      }
      if (last < seg.text.length) next.push({ text: seg.text.slice(last), recId: null, category: null });
    }
    segments = next;
  }
  return segments;
}

// ─── RecommendationCard ───────────────────────────────────────────────────────

function RecommendationCard({
  rec,
  isActive,
  onSelect,
}: {
  rec: Recommendation;
  isActive: boolean;
  onSelect: () => void;
}) {
  const meta = CATEGORY_META[rec.category] ?? CATEGORY_META.keywords;
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border p-4 flex flex-col gap-2 transition-colors ${
        isActive
          ? "border-orange-400 bg-orange-50"
          : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"
      }`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded font-semibold tracking-wide ${meta.badge}`}>
          {meta.label.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500 truncate">{rec.issue}</span>
      </div>

      <div className="text-xs text-gray-500 font-medium mt-1">Replace:</div>
      <div className="text-sm text-gray-700 font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1 line-clamp-2">
        {rec.originalText}
      </div>

      <div className="text-xs text-gray-500 font-medium mt-1">With:</div>
      <div className="text-sm text-green-800 font-mono bg-green-50 border border-green-200 rounded px-2 py-1 line-clamp-3">
        {rec.suggestion}
      </div>

      <div className="text-xs text-gray-500 mt-1 italic">{rec.reason}</div>
    </button>
  );
}

// ─── ResumeViewer ─────────────────────────────────────────────────────────────

function ResumeViewer({
  segments,
  activeId,
  onHighlightClick,
}: {
  segments: Segment[];
  activeId: string | null;
  onHighlightClick: (id: string) => void;
}) {
  return (
    <div className="text-gray-800 text-sm leading-7 whitespace-pre-wrap font-mono bg-gray-50 border border-gray-200 rounded-lg p-5 overflow-y-auto max-h-[62vh]">
      {segments.map((seg, i) => {
        if (seg.recId === null) return <React.Fragment key={i}>{seg.text}</React.Fragment>;
        const meta = CATEGORY_META[seg.category!] ?? CATEGORY_META.keywords;
        const isActive = seg.recId === activeId;
        return (
          <mark
            key={i}
            onClick={() => onHighlightClick(seg.recId!)}
            title="Click to see suggestion"
            className={`rounded px-0.5 cursor-pointer transition-colors ${
              isActive ? meta.highlightActive : meta.highlight
            }`}
          >
            {seg.text}
          </mark>
        );
      })}
    </div>
  );
}

// ─── AiOptimizerTab (main export) ────────────────────────────────────────────

export function AiOptimizerTab({
  resumeText,
  feedbackItems,
  jobDescription,
}: {
  resumeText: string;
  feedbackItems: FeedbackItem[];
  jobDescription: string;
}) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ollama/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, feedbackItems, jobDescription }),
      });
      const data = await res.json() as { recommendations?: Recommendation[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setRecommendations(data.recommendations ?? []);
      setGenerated(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  const segments = generated ? buildSegments(resumeText, recommendations) : [];

  // ── Not yet generated ──────────────────────────────────────────────────────
  if (!generated) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-gray-900 m-0 text-base font-semibold">AI Resume Optimizer</h3>
            <p className="text-gray-500 text-sm m-0">
              Ollama will analyze your ATS issues and highlight specific passages to improve.
            </p>
          </div>
          <button
            className="orange_button whitespace-nowrap"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Analyzing…" : "Generate Recommendations"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="text-gray-800 text-sm leading-7 whitespace-pre-wrap font-mono bg-gray-50 border border-gray-200 rounded-lg p-5">
          {resumeText || <span className="text-gray-400 italic">No resume text available.</span>}
        </div>
      </div>
    );
  }

  // ── Generated view ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="text-gray-900 m-0 text-base font-semibold">AI Resume Optimizer</h3>
          <span className="text-xs text-gray-500">{recommendations.length} suggestion{recommendations.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-yellow-200 border border-yellow-300"></span>Suggested change</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm bg-orange-300 border border-orange-400"></span>Selected</span>
          </div>
          <button
            className="text-xs text-gray-500 hover:text-gray-700 underline"
            onClick={() => { setGenerated(false); setRecommendations([]); setActiveId(null); }}
          >
            Reset
          </button>
          <button className="orange_button text-sm" onClick={handleGenerate} disabled={loading}>
            {loading ? "Analyzing…" : "Regenerate"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm flex-shrink-0">
          {error}
        </div>
      )}

      {/* Split panel */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Resume viewer */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Resume</div>
          <ResumeViewer
            segments={segments}
            activeId={activeId}
            onHighlightClick={(id) => setActiveId(id === activeId ? null : id)}
          />
        </div>

        {/* Recommendations panel */}
        <div className="w-80 flex-shrink-0">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Suggestions</div>
          {recommendations.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No recommendations generated.</p>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[62vh] pr-1">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  isActive={activeId === rec.id}
                  onSelect={() => setActiveId(rec.id === activeId ? null : rec.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
