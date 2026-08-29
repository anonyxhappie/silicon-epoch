"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Layers,
  Cpu,
  BarChart2,
  Server,
  GitBranch,
  FileCheck,
  ExternalLink,
  Plus,
  Info,
  Maximize2,
} from "lucide-react";
import { useEpochStore } from "@/lib/store/useEpochStore";
import {
  getEntityById,
  getEntityLineage,
  getSourceById,
} from "@/lib/data/dataset";

type TabId =
  | "overview"
  | "architecture"
  | "benchmarks"
  | "infrastructure"
  | "lineage"
  | "sources";

export function EntityInspector() {
  const selectedEntityId = useEpochStore((s) => s.selectedEntityId);
  const selectEntity = useEpochStore((s) => s.selectEntity);
  const explodedProgress = useEpochStore((s) => s.explodedProgress);
  const setExplodedProgress = useEpochStore((s) => s.setExplodedProgress);
  const stageForCompare = useEpochStore((s) => s.stageForCompare);
  const setEvidenceOpen = useEpochStore((s) => s.setEvidenceOpen);

  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (!selectedEntityId) return null;
  const entity = getEntityById(selectedEntityId);
  if (!entity) return null;

  const lineage = getEntityLineage(entity.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-20 right-6 bottom-24 z-40 w-full max-w-md bg-slate-950/95 border border-slate-800 shadow-2xl rounded-2xl backdrop-blur-xl flex flex-col pointer-events-auto select-none overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                {entity.tier && (
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold tracking-wider border ${
                      entity.tier === "tier_s"
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                        : entity.tier === "tier_a"
                        ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300"
                        : "bg-purple-500/15 border-purple-500/50 text-purple-300"
                    }`}
                  >
                    {entity.tier.replace("_", " ").toUpperCase()}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase font-semibold">
                  {entity.availability ? entity.availability.replace("_", " ") : entity.type}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {entity.release_date}
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-slate-100 mt-1">
                {entity.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {entity.creator_name || entity.creator} • {entity.category}
              </p>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => stageForCompare(entity)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-white transition-colors"
                title="Stage in Versus comparison"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => selectEntity(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D CAD Exploded View Slider */}
          <div className="mt-4 pt-3 border-t border-slate-900">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <div className="flex items-center space-x-1 text-cyan-400">
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="font-semibold">CAD EXPLODED TEARDOWN</span>
              </div>
              <span>{Math.round(explodedProgress * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedProgress}
              onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 border-b border-slate-800/80 bg-slate-900/30 overflow-x-auto scrollbar-none text-xs font-mono">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2.5 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === "overview"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3 py-2.5 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === "architecture"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveTab("benchmarks")}
            className={`px-3 py-2.5 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === "benchmarks"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Benchmarks
          </button>
          <button
            onClick={() => setActiveTab("infrastructure")}
            className={`px-3 py-2.5 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === "infrastructure"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Economics
          </button>
          <button
            onClick={() => setActiveTab("lineage")}
            className={`px-3 py-2.5 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === "lineage"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Lineage ({lineage.ancestors.length + lineage.descendants.length})
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`px-3 py-2.5 border-b-2 font-medium transition-colors shrink-0 ${
              activeTab === "sources"
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Sources ({entity.sources.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 text-xs font-sans space-y-4">
          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">
                  Executive Summary
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {entity.summary}
                </p>
              </div>

              {entity.key_innovations && entity.key_innovations.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2">
                    Key Innovations
                  </h4>
                  <ul className="space-y-1.5">
                    {entity.key_innovations.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entity.known_limitations && entity.known_limitations.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2">
                    Known Limitations
                  </h4>
                  <ul className="space-y-1.5">
                    {entity.known_limitations.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-amber-300/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 2. ARCHITECTURE */}
          {activeTab === "architecture" && (
            <div className="space-y-4 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Architecture Core</div>
                  <div className="text-slate-100 font-semibold mt-0.5">
                    {entity.architecture?.type || "Standard Neural Package"}
                  </div>
                  {entity.architecture?.subtype && (
                    <div className="text-cyan-400 text-[11px] mt-0.5">
                      Subtype: {entity.architecture.subtype}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Total Parameters</div>
                    <div className="text-slate-100 font-bold mt-0.5">
                      {entity.parameters?.total_billion !== null &&
                      entity.parameters?.total_billion !== undefined
                        ? `${entity.parameters.total_billion} Billion`
                        : "Not publicly disclosed"}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Active / Token</div>
                    <div className="text-slate-100 font-bold mt-0.5">
                      {entity.parameters?.active_billion !== null &&
                      entity.parameters?.active_billion !== undefined
                        ? `${entity.parameters.active_billion} Billion`
                        : "Not publicly disclosed"}
                    </div>
                  </div>
                </div>

                {entity.context_window && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Context Window</div>
                    <div className="text-cyan-300 font-bold mt-0.5">
                      {entity.context_window.value?.toLocaleString()}{" "}
                      {entity.context_window.unit}
                    </div>
                  </div>
                )}

                {entity.parameters?.notes && (
                  <div className="text-[11px] text-slate-400 font-sans italic pt-1">
                    Note: {entity.parameters.notes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. BENCHMARKS */}
          {activeTab === "benchmarks" && (
            <div className="space-y-3 font-mono">
              {!entity.benchmarks || entity.benchmarks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No standardized benchmark scores cataloged for this entity.
                </div>
              ) : (
                entity.benchmarks.map((bm, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-semibold">
                        {bm.benchmark_name}
                      </span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {bm.score}{" "}
                        {bm.unit === "percent" || bm.unit === "percent_error"
                          ? "%"
                          : ""}
                      </span>
                    </div>

                    {bm.unit === "percent" && (
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, bm.score)}%` }}
                        />
                      </div>
                    )}

                    {bm.setting && (
                      <div className="text-[10px] text-slate-400">
                        Setting: {bm.setting}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. INFRASTRUCTURE & ECONOMICS */}
          {activeTab === "infrastructure" && (
            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="text-[10px] text-slate-400 uppercase">Availability & License</div>
                <div className="text-slate-100 font-bold">
                  {entity.availability?.toUpperCase().replace("_", " ") || "API"}
                </div>
                <div className="text-slate-400 text-[11px]">
                  License: {entity.license || "Proprietary Commercial"}
                </div>
              </div>

              {entity.pricing && entity.pricing.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase">API Pricing (per 1M Tokens)</div>
                  {entity.pricing.map((p, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 text-slate-200">
                      <div>
                        Input: <span className="text-cyan-400 font-bold">${p.input}</span>
                      </div>
                      <div>
                        Output: <span className="text-cyan-400 font-bold">${p.output}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. LINEAGE */}
          {activeTab === "lineage" && (
            <div className="space-y-4">
              {/* Ancestors */}
              <div>
                <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center space-x-1">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ancestors & Predecessors ({lineage.ancestors.length})</span>
                </h4>
                {lineage.ancestors.length === 0 ? (
                  <p className="text-slate-400 font-mono text-[11px]">
                    No direct predecessors recorded.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {lineage.ancestors.map(({ entity: anc, relationship }) => (
                      <div
                        key={anc.id}
                        onClick={() => selectEntity(anc.id)}
                        className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between font-mono"
                      >
                        <div>
                          <div className="text-slate-200 font-semibold text-xs">
                            {anc.name}
                          </div>
                          <div className="text-[10px] text-cyan-400">
                            {relationship.type.replace("_", " ")}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {anc.release_date.split("-")[0]} →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Descendants */}
              <div>
                <h4 className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center space-x-1">
                  <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                  <span>Influenced & Successors ({lineage.descendants.length})</span>
                </h4>
                {lineage.descendants.length === 0 ? (
                  <p className="text-slate-400 font-mono text-[11px]">
                    Frontier node with no tracked descendants yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {lineage.descendants.map(({ entity: desc, relationship }) => (
                      <div
                        key={desc.id}
                        onClick={() => selectEntity(desc.id)}
                        className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all flex items-center justify-between font-mono"
                      >
                        <div>
                          <div className="text-slate-200 font-semibold text-xs">
                            {desc.name}
                          </div>
                          <div className="text-[10px] text-purple-400">
                            {relationship.type.replace("_", " ")}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {desc.release_date.split("-")[0]} →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. SOURCES */}
          {activeTab === "sources" && (
            <div className="space-y-3 font-mono">
              {entity.sources.map((srcId) => {
                const src = getSourceById(srcId);
                if (!src) return null;

                return (
                  <div
                    key={srcId}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 uppercase">
                        {src.authority} SOURCE
                      </span>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1 text-xs"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="text-slate-100 font-semibold text-xs font-sans">
                      {src.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {src.publisher} ({src.published_date})
                    </div>
                    {src.notes && (
                      <div className="text-[11px] text-slate-400 font-sans italic">
                        {src.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
