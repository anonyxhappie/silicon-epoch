"use client";

import React from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Compass,
  Globe,
  Home,
} from "lucide-react";
import { useEpochStore } from "@/lib/store/useEpochStore";

export function CameraControlsWidget() {
  const isEntered = useEpochStore((s) => s.isEntered);
  const triggerCameraAction = useEpochStore((s) => s.triggerCameraAction);

  if (!isEntered) return null;

  return (
    <div className="absolute right-6 bottom-24 z-30 flex flex-col items-center space-y-1.5 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-md select-none pointer-events-auto">
      {/* Zoom In */}
      <button
        onClick={() => triggerCameraAction("zoom_in")}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Zoom In (+)"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={() => triggerCameraAction("zoom_out")}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Zoom Out (-)"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <div className="w-4 h-px bg-slate-800 my-0.5" />

      {/* Full Timeline Panoramic Overview (1940 - 2026) */}
      <button
        onClick={() => triggerCameraAction("macro_overview")}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Full Timeline Overview (1940 – 2026)"
      >
        <Globe className="w-4 h-4" />
      </button>

      {/* Top-down View */}
      <button
        onClick={() => triggerCameraAction("top_down")}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Top-Down View"
      >
        <Compass className="w-4 h-4" />
      </button>

      <div className="w-4 h-px bg-slate-800 my-0.5" />

      {/* Rotate Orbit Left */}
      <button
        onClick={() => triggerCameraAction("rotate_left")}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Rotate Left (30°)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Rotate Orbit Right */}
      <button
        onClick={() => triggerCameraAction("rotate_right")}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Rotate Right (30°)"
      >
        <RotateCw className="w-4 h-4" />
      </button>

      <div className="w-4 h-px bg-slate-800 my-0.5" />

      {/* Reset / Recenter View */}
      <button
        onClick={() => triggerCameraAction("reset")}
        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
        title="Recenter Perspective"
      >
        <Home className="w-4 h-4" />
      </button>
    </div>
  );
}
