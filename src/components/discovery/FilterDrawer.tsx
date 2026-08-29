"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Filter, Check, Sparkles } from "lucide-react";
import { useEpochStore } from "@/lib/store/useEpochStore";
import { EPOCHS } from "@/lib/data/dataset";
import { AvailabilityType, EntityType } from "@/types/schema";

const ENTITY_TYPES: { id: EntityType; label: string }[] = [
  { id: "model", label: "Frontier Models" },
  { id: "architecture", label: "Architectures" },
  { id: "algorithm", label: "Algorithms & Training" },
  { id: "hardware", label: "Hardware & Accelerators" },
  { id: "paper", label: "Foundational Papers" },
];

const AVAILABILITY_OPTIONS: { id: AvailabilityType; label: string; tag: string }[] = [
  { id: "open_source", label: "Open Source", tag: "MIT / Apache-2.0" },
  { id: "open_weights", label: "Open Weights", tag: "Downloadable Weights" },
  { id: "closed_api", label: "Closed API", tag: "Cloud Inference Only" },
  { id: "research_preview", label: "Research Preview", tag: "Gated / Experimental" },
];

const MODALITY_OPTIONS = ["text", "image", "video", "audio", "code"];

export function FilterDrawer() {
  const isFilterOpen = useEpochStore((s) => s.isFilterOpen);
  const setFilterOpen = useEpochStore((s) => s.setFilterOpen);
  const filters = useEpochStore((s) => s.filters);
  const setFilter = useEpochStore((s) => s.setFilter);
  const resetFilters = useEpochStore((s) => s.resetFilters);

  const toggleEpoch = (id: string) => {
    const next = filters.epochs.includes(id)
      ? filters.epochs.filter((e) => e !== id)
      : [...filters.epochs, id];
    setFilter("epochs", next);
  };

  const toggleType = (id: EntityType) => {
    const next = filters.entityTypes.includes(id)
      ? filters.entityTypes.filter((t) => t !== id)
      : [...filters.entityTypes, id];
    setFilter("entityTypes", next);
  };

  const toggleAvailability = (id: AvailabilityType) => {
    const next = filters.availability.includes(id)
      ? filters.availability.filter((a) => a !== id)
      : [...filters.availability, id];
    setFilter("availability", next);
  };

  const toggleModality = (id: string) => {
    const next = filters.modalities.includes(id)
      ? filters.modalities.filter((m) => m !== id)
      : [...filters.modalities, id];
    setFilter("modalities", next);
  };

  const activeFilterCount =
    filters.epochs.length +
    filters.entityTypes.length +
    filters.availability.length +
    filters.modalities.length;

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFilterOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs pointer-events-auto"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col pointer-events-auto select-none"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center space-x-2 font-mono">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-slate-100">
                  SCENE FILTERS
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center space-x-1"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setFilterOpen(false)}
                  aria-label="Close filters"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs font-mono">
              {/* 1. Availability & Openness (Strict 4-Tier Taxonomy) */}
              <div>
                <div className="text-slate-400 uppercase tracking-wider mb-2.5 font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Openness & Licensing</span>
                </div>
                <div className="space-y-1.5">
                  {AVAILABILITY_OPTIONS.map((opt) => {
                    const isSelected = filters.availability.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleAvailability(opt.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-slate-900 border-cyan-500/80 text-cyan-300 shadow-sm"
                            : "bg-slate-900/40 hover:bg-slate-900/80 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{opt.tag}</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Epochs */}
              <div>
                <div className="text-slate-400 uppercase tracking-wider mb-2.5 font-semibold">
                  Epochs & Eras
                </div>
                <div className="space-y-1.5">
                  {EPOCHS.map((epoch) => {
                    const isSelected = filters.epochs.includes(epoch.id);
                    return (
                      <button
                        key={epoch.id}
                        onClick={() => toggleEpoch(epoch.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-slate-900 border-cyan-500/80 text-cyan-300"
                            : "bg-slate-900/40 hover:bg-slate-900/80 border-slate-800 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: epoch.theme_color }}
                          />
                          <span className="truncate">{epoch.title}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Entity Types */}
              <div>
                <div className="text-slate-400 uppercase tracking-wider mb-2.5 font-semibold">
                  Entity Category
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {ENTITY_TYPES.map((type) => {
                    const isSelected = filters.entityTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        onClick={() => toggleType(type.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-slate-900 border-cyan-500/80 text-cyan-300"
                            : "bg-slate-900/40 hover:bg-slate-900/80 border-slate-800 text-slate-300"
                        }`}
                      >
                        <span>{type.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Modalities */}
              <div>
                <div className="text-slate-400 uppercase tracking-wider mb-2.5 font-semibold">
                  Modalities
                </div>
                <div className="flex flex-wrap gap-2">
                  {MODALITY_OPTIONS.map((mod) => {
                    const isSelected = filters.modalities.includes(mod);
                    return (
                      <button
                        key={mod}
                        onClick={() => toggleModality(mod)}
                        className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-all ${
                          isSelected
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                            : "bg-slate-900/50 hover:bg-slate-800 border-slate-800 text-slate-400"
                        }`}
                      >
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
