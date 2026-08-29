"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Check, Minus, GitBranch } from "lucide-react";
import { useEpochStore } from "@/lib/store/useEpochStore";

export function CompareModal() {
  const isCompareModalOpen = useEpochStore((s) => s.isCompareModalOpen);
  const setCompareModalOpen = useEpochStore((s) => s.setCompareModalOpen);
  const compareEntityA = useEpochStore((s) => s.compareEntityA);
  const compareEntityB = useEpochStore((s) => s.compareEntityB);
  const clearCompare = useEpochStore((s) => s.clearCompare);

  if (!isCompareModalOpen || !compareEntityA || !compareEntityB) return null;

  // Find overlapping benchmarks
  const benchmarksA = compareEntityA.benchmarks || [];
  const benchmarksB = compareEntityB.benchmarks || [];
  const allBenchmarkIds = Array.from(
    new Set([
      ...benchmarksA.map((b) => b.benchmark_id),
      ...benchmarksB.map((b) => b.benchmark_id),
    ])
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md pointer-events-auto select-none"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden font-mono"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-slate-100">
                VERSUS COMPARISON MATRIX
              </h3>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Side by Side Comparison Grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {/* Entity Names Banner */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-[10px] text-cyan-400 uppercase font-semibold">
                  ENTITY A
                </div>
                <div className="text-lg font-bold text-slate-100">
                  {compareEntityA.name}
                </div>
                <div className="text-slate-400 text-xs">
                  {compareEntityA.creator_name || compareEntityA.creator} •{" "}
                  {compareEntityA.release_date}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-[10px] text-purple-400 uppercase font-semibold">
                  ENTITY B
                </div>
                <div className="text-lg font-bold text-slate-100">
                  {compareEntityB.name}
                </div>
                <div className="text-slate-400 text-xs">
                  {compareEntityB.creator_name || compareEntityB.creator} •{" "}
                  {compareEntityB.release_date}
                </div>
              </div>
            </div>

            {/* Spec Comparison Table */}
            <div className="space-y-4">
              <h4 className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                1. Architectural Specifications
              </h4>
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="text-slate-400">Architecture Type</div>
                <div className="text-slate-200">
                  {compareEntityA.architecture?.type || "Standard Neural"}
                </div>
                <div className="text-slate-200">
                  {compareEntityB.architecture?.type || "Standard Neural"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="text-slate-400">Total Parameters</div>
                <div className="text-slate-100 font-bold">
                  {compareEntityA.parameters?.total_billion !== null &&
                  compareEntityA.parameters?.total_billion !== undefined
                    ? `${compareEntityA.parameters.total_billion}B`
                    : "Not publicly disclosed"}
                </div>
                <div className="text-slate-100 font-bold">
                  {compareEntityB.parameters?.total_billion !== null &&
                  compareEntityB.parameters?.total_billion !== undefined
                    ? `${compareEntityB.parameters.total_billion}B`
                    : "Not publicly disclosed"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="text-slate-400">Active Parameters</div>
                <div className="text-slate-100 font-bold">
                  {compareEntityA.parameters?.active_billion !== null &&
                  compareEntityA.parameters?.active_billion !== undefined
                    ? `${compareEntityA.parameters.active_billion}B`
                    : "Not publicly disclosed"}
                </div>
                <div className="text-slate-100 font-bold">
                  {compareEntityB.parameters?.active_billion !== null &&
                  compareEntityB.parameters?.active_billion !== undefined
                    ? `${compareEntityB.parameters.active_billion}B`
                    : "Not publicly disclosed"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="text-slate-400">Context Window</div>
                <div className="text-cyan-300 font-bold">
                  {compareEntityA.context_window?.value
                    ? `${compareEntityA.context_window.value.toLocaleString()} tokens`
                    : "N/A"}
                </div>
                <div className="text-purple-300 font-bold">
                  {compareEntityB.context_window?.value
                    ? `${compareEntityB.context_window.value.toLocaleString()} tokens`
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Benchmarks Head to Head */}
            {allBenchmarkIds.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                  2. Benchmark Evaluations
                </h4>
                {allBenchmarkIds.map((bmId) => {
                  const bmA = benchmarksA.find((b) => b.benchmark_id === bmId);
                  const bmB = benchmarksB.find((b) => b.benchmark_id === bmId);
                  const title =
                    bmA?.benchmark_name || bmB?.benchmark_name || bmId;

                  return (
                    <div
                      key={bmId}
                      className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-slate-300 font-semibold">
                        <span>{title}</span>
                        <div className="flex space-x-6 text-xs font-mono">
                          <span className="text-cyan-400">
                            A: {bmA ? `${bmA.score}%` : "Not evaluated"}
                          </span>
                          <span className="text-purple-400">
                            B: {bmB ? `${bmB.score}%` : "Not evaluated"}
                          </span>
                        </div>
                      </div>

                      {/* Side-by-side Progress Bars */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-cyan-400 h-full rounded-full"
                            style={{ width: `${bmA ? Math.min(100, bmA.score) : 0}%` }}
                          />
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-400 h-full rounded-full"
                            style={{ width: `${bmB ? Math.min(100, bmB.score) : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Availability & Economics */}
            <div className="space-y-4">
              <h4 className="text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                3. Distribution & Licensing
              </h4>
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="text-slate-400">License</div>
                <div className="text-slate-200">
                  {compareEntityA.license || "Proprietary"}
                </div>
                <div className="text-slate-200">
                  {compareEntityB.license || "Proprietary"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/40 border border-slate-800 items-center">
                <div className="text-slate-400">Availability</div>
                <div className="text-slate-200 uppercase">
                  {compareEntityA.availability?.replace("_", " ") || "API"}
                </div>
                <div className="text-slate-200 uppercase">
                  {compareEntityB.availability?.replace("_", " ") || "API"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
