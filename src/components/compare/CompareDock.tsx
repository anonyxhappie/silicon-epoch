"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, ArrowRight, Plus } from "lucide-react";
import { useEpochStore } from "@/lib/store/useEpochStore";

export function CompareDock() {
  const compareEntityA = useEpochStore((s) => s.compareEntityA);
  const compareEntityB = useEpochStore((s) => s.compareEntityB);
  const removeFromCompare = useEpochStore((s) => s.removeFromCompare);
  const setCompareModalOpen = useEpochStore((s) => s.setCompareModalOpen);
  const setSearchOpen = useEpochStore((s) => s.setSearchOpen);

  if (!compareEntityA && !compareEntityB) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-6 z-40 p-3 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex items-center space-x-3 pointer-events-auto select-none font-mono text-xs"
      >
        <div className="flex items-center space-x-1.5 text-amber-400 font-semibold px-2">
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">VERSUS DOCK</span>
        </div>

        {/* Slot A */}
        {compareEntityA ? (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
            <span className="font-bold truncate max-w-[120px]">
              {compareEntityA.name}
            </span>
            <button
              onClick={() => removeFromCompare("A")}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Entity A</span>
          </button>
        )}

        <span className="text-slate-500 font-bold">VS</span>

        {/* Slot B */}
        {compareEntityB ? (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
            <span className="font-bold truncate max-w-[120px]">
              {compareEntityB.name}
            </span>
            <button
              onClick={() => removeFromCompare("B")}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Entity B</span>
          </button>
        )}

        {/* Launch Compare Action */}
        <button
          onClick={() => setCompareModalOpen(true)}
          disabled={!compareEntityA || !compareEntityB}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl font-bold transition-all ${
            compareEntityA && compareEntityB
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)] cursor-pointer"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>Compare</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
