"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from "lucide-react";
import { EPOCHS } from "@/lib/data/dataset";
import { useEpochStore } from "@/lib/store/useEpochStore";
import { xToTimelineYear } from "@/lib/layout/timelineLayout";

export function TimelineScrubber() {
  const timelineProgress = useEpochStore((s) => s.timelineProgress);
  const setTimelineProgress = useEpochStore((s) => s.setTimelineProgress);
  const activeEpochId = useEpochStore((s) => s.activeEpochId);
  const setActiveEpoch = useEpochStore((s) => s.setActiveEpoch);
  const selectedEntityId = useEpochStore((s) => s.selectedEntityId);

  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-tour progression
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimelineProgress(timelineProgress >= 1 ? 0 : timelineProgress + 0.005);
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, timelineProgress, setTimelineProgress]);

  // If user selected an entity, pause auto tour
  useEffect(() => {
    if (selectedEntityId) {
      setIsPlaying(false);
    }
  }, [selectedEntityId]);

  // Current year calculation
  const currentX = -130 + timelineProgress * 285;
  const currentYear = Math.round(xToTimelineYear(currentX));

  const handleEpochClick = (epochId: string, idx: number) => {
    setActiveEpoch(epochId);
    const progress = idx / (EPOCHS.length - 1);
    setTimelineProgress(progress);
  };

  const handlePrevEpoch = () => {
    const currentIdx = EPOCHS.findIndex((e) => e.id === activeEpochId);
    if (currentIdx > 0) {
      handleEpochClick(EPOCHS[currentIdx - 1].id, currentIdx - 1);
    }
  };

  const handleNextEpoch = () => {
    const currentIdx = EPOCHS.findIndex((e) => e.id === activeEpochId);
    if (currentIdx < EPOCHS.length - 1) {
      handleEpochClick(EPOCHS[currentIdx + 1].id, currentIdx + 1);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl pointer-events-none select-none">
      <div className="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800/90 shadow-2xl backdrop-blur-lg flex flex-col space-y-3 pointer-events-auto">
        {/* Top Controls & Current Year Readout */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevEpoch}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
              title="Previous Era"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
              title={isPlaying ? "Pause Tour" : "Play Timeline Tour"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Play className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>
            <button
              onClick={handleNextEpoch}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
              title="Next Era"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current Year Large Readout */}
          <div className="flex items-baseline space-x-2">
            <span className="text-[10px] text-slate-400">TIMELINE:</span>
            <span className="text-base font-bold text-cyan-400 tracking-wider">
              {currentYear}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            Scroll or drag track to glide
          </div>
        </div>

        {/* Interactive Scrub Track */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={timelineProgress}
            onChange={(e) => setTimelineProgress(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 z-10"
          />
        </div>

        {/* Epoch Markers */}
        <div className="grid grid-cols-6 gap-1 pt-1">
          {EPOCHS.map((epoch, idx) => {
            const isActive = activeEpochId === epoch.id;
            return (
              <button
                key={epoch.id}
                onClick={() => handleEpochClick(epoch.id, idx)}
                className={`text-left p-1 rounded border transition-all text-[10px] font-mono truncate ${
                  isActive
                    ? "bg-slate-800/90 border-cyan-500/80 text-cyan-300"
                    : "bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/60 text-slate-400"
                }`}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mb-0.5 inline-block mr-1"
                  style={{ backgroundColor: epoch.theme_color }}
                />
                <span className="font-semibold">{epoch.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
