"use client";

import React, { useState } from "react";
import { Search, Filter, Cpu, ArrowRight, Layers, ExternalLink } from "lucide-react";
import { EPOCHS, ENTITIES, getEntityById } from "@/lib/data/dataset";
import { Entity } from "@/types/schema";
import { useEpochStore } from "@/lib/store/useEpochStore";

export function MobileFallbackView() {
  const [selectedEpoch, setSelectedEpoch] = useState<string>("epoch-foundation-models");
  const selectEntity = useEpochStore((s) => s.selectEntity);
  const setSearchOpen = useEpochStore((s) => s.setSearchOpen);
  const setFilterOpen = useEpochStore((s) => s.setFilterOpen);
  const stageForCompare = useEpochStore((s) => s.stageForCompare);

  const filteredEntities = ENTITIES.filter(
    (e) => !selectedEpoch || e.epoch_id === selectedEpoch
  );

  return (
    <div className="w-full h-full min-h-screen bg-[#030609] text-slate-100 p-4 pb-24 overflow-y-auto font-sans">
      {/* Top Header */}
      <div className="pt-16 pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-cyan-400">
            SILICON EPOCH
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            2D Timeline Knowledge Graph
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Epoch Pills Horizontal Selector */}
      <div className="py-4 flex space-x-2 overflow-x-auto scrollbar-none font-mono text-xs">
        {EPOCHS.map((epoch) => {
          const isActive = selectedEpoch === epoch.id;
          return (
            <button
              key={epoch.id}
              onClick={() => setSelectedEpoch(epoch.id)}
              className={`px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                isActive
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                  : "bg-slate-900/60 border-slate-800 text-slate-400"
              }`}
            >
              {epoch.title}
            </button>
          );
        })}
      </div>

      {/* Entity Cards Grid */}
      <div className="space-y-3 pt-2">
        {filteredEntities.map((entity) => (
          <div
            key={entity.id}
            onClick={() => selectEntity(entity.id)}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all shadow-md space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-[10px] uppercase">
                    {entity.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {entity.release_date}
                  </span>
                </div>
                <h3 className="text-base font-bold font-mono text-slate-100 mt-1">
                  {entity.name}
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  stageForCompare(entity);
                }}
                className="p-1.5 rounded bg-slate-900 border border-slate-700 text-amber-400"
                title="Stage in comparison"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {entity.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs font-mono text-slate-400">
              <span>{entity.creator_name || entity.creator}</span>
              <span className="text-cyan-400 flex items-center space-x-1">
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
