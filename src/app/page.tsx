"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { HeaderNav } from "@/components/ui/HeaderNav";
import { LandingOverlay } from "@/components/ui/LandingOverlay";
import { TimelineScrubber } from "@/components/ui/TimelineScrubber";
import { CommandPalette } from "@/components/discovery/CommandPalette";
import { FilterDrawer } from "@/components/discovery/FilterDrawer";
import { EntityInspector } from "@/components/entity/EntityInspector";
import { CompareDock } from "@/components/compare/CompareDock";
import { CompareModal } from "@/components/compare/CompareModal";
import { MobileFallbackView } from "@/components/mobile/MobileFallbackView";
import { CameraControlsWidget } from "@/components/ui/CameraControlsWidget";
import { useEpochStore } from "@/lib/store/useEpochStore";

// Dynamically import 3D Canvas with SSR disabled to ensure WebGL context initializes safely
const SiliconEpochCanvas = dynamic(
  () =>
    import("@/components/canvas/SiliconEpochCanvas").then(
      (mod) => mod.SiliconEpochCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#030609] text-cyan-400 font-mono text-xs space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING SILICON SUBSTRATE...</span>
      </div>
    ),
  }
);

function SiliconEpochContent() {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const selectEntity = useEpochStore((s) => s.selectEntity);
  const enterEpoch = useEpochStore((s) => s.enterEpoch);

  // Deep Link URL parameter handler
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const entityParam = params.get("entity");
    if (entityParam) {
      enterEpoch();
      selectEntity(entityParam);
    }
  }, [enterEpoch, selectEntity]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030609]">
      {/* 2D Header Navigation Glass Bar */}
      <HeaderNav viewMode={viewMode} setViewMode={setViewMode} />

      {/* Main Experience Viewport */}
      {viewMode === "3d" ? (
        <div className="w-full h-full">
          <SiliconEpochCanvas />
          <CameraControlsWidget />
          <TimelineScrubber />
        </div>
      ) : (
        <MobileFallbackView />
      )}

      {/* Interactive 2D Companion HUDs & Overlays */}
      <LandingOverlay />
      <EntityInspector />
      <CommandPalette />
      <FilterDrawer />
      <CompareDock />
      <CompareModal />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-[#030609] text-cyan-400 font-mono text-xs">
          LOADING SILICON EPOCH...
        </div>
      }
    >
      <SiliconEpochContent />
    </Suspense>
  );
}
