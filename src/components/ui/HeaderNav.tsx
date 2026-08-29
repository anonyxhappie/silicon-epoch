"use client";

import React from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Zap,
  Activity,
  Layers,
  HelpCircle,
} from "lucide-react";
import { useEpochStore } from "@/lib/store/useEpochStore";
import { getEpochById } from "@/lib/data/dataset";

interface HeaderNavProps {
  viewMode: "3d" | "2d";
  setViewMode: (mode: "3d" | "2d") => void;
}

export function HeaderNav({ viewMode, setViewMode }: HeaderNavProps) {
  const activeEpochId = useEpochStore((s) => s.activeEpochId);
  const setSearchOpen = useEpochStore((s) => s.setSearchOpen);
  const isFilterOpen = useEpochStore((s) => s.isFilterOpen);
  const setFilterOpen = useEpochStore((s) => s.setFilterOpen);
  const compareEntityA = useEpochStore((s) => s.compareEntityA);
  const compareEntityB = useEpochStore((s) => s.compareEntityB);
  const setCompareModalOpen = useEpochStore((s) => s.setCompareModalOpen);
  const isReducedMotion = useEpochStore((s) => s.isReducedMotion);
  const toggleReducedMotion = useEpochStore((s) => s.toggleReducedMotion);
  const enterEpoch = useEpochStore((s) => s.enterEpoch);

  const activeEpoch = getEpochById(activeEpochId);
  const compareCount = (compareEntityA ? 1 : 0) + (compareEntityB ? 1 : 0);

  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 pointer-events-none select-none">
      {/* Left: Brand & Active Epoch Indicator */}
      <div className="flex items-center space-x-6 pointer-events-auto">
        <div
          onClick={enterEpoch}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(0,240,255,0.3)] group-hover:border-cyan-400 transition-colors">
            <span className="font-mono text-cyan-400 font-bold text-sm">SE</span>
          </div>
          <div>
            <div className="font-mono font-bold text-sm tracking-widest text-slate-100 group-hover:text-cyan-300 transition-colors">
              SILICON EPOCH
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider">
              KNOWLEDGE GRAPH V2
            </div>
          </div>
        </div>

        {/* Current Active Era Pill */}
        {activeEpoch && (
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono backdrop-blur-md">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: activeEpoch.theme_color }}
            />
            <span className="text-slate-400">ERA:</span>
            <span className="text-slate-200 font-semibold">{activeEpoch.title}</span>
            <span className="text-slate-500">({activeEpoch.subtitle})</span>
          </div>
        )}
      </div>

      {/* Right: Actions & Tools */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        {/* Search Button (Cmd+K) */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-all backdrop-blur-md shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Search Entities</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setFilterOpen(!isFilterOpen)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all backdrop-blur-md ${
            isFilterOpen
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Versus / Compare Button */}
        <button
          onClick={() => setCompareModalOpen(true)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all backdrop-blur-md ${
            compareCount > 0
              ? "bg-amber-500/20 border-amber-400/80 text-amber-300 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Versus</span>
          {compareCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
              {compareCount}
            </span>
          )}
        </button>

        {/* 2D / 3D Switch */}
        <button
          onClick={() => setViewMode(viewMode === "3d" ? "2d" : "3d")}
          className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-all backdrop-blur-md"
          title="Toggle 2D / 3D Mode"
        >
          {viewMode === "3d" ? "2D View" : "3D World"}
        </button>

        {/* Reduced Motion Toggle */}
        <button
          onClick={toggleReducedMotion}
          className={`p-1.5 rounded-lg border text-xs font-mono transition-all backdrop-blur-md ${
            isReducedMotion
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
              : "bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-400 hover:text-white"
          }`}
          title={isReducedMotion ? "Reduced Motion: ON" : "Reduced Motion: OFF"}
        >
          <Activity className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
