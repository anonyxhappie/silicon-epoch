"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ENTITIES, RELATIONSHIPS } from "@/lib/data/dataset";
import { getPlacedEntities } from "@/lib/layout/timelineLayout";
import { Motherboard } from "./Motherboard";
import { TimelineSpine } from "./TimelineSpine";
import { EpochZones } from "./EpochZones";
import { EntityNode } from "./EntityNode";
import { RelationshipTraces } from "./RelationshipTraces";
import { CameraController } from "./CameraController";
import { useEpochStore } from "@/lib/store/useEpochStore";

export function SiliconEpochCanvas() {
  const selectEntity = useEpochStore((s) => s.selectEntity);

  const placedEntities = useMemo(() => {
    return getPlacedEntities(ENTITIES);
  }, []);

  return (
    <div
      className="w-full h-full relative"
      onPointerDown={(e) => {
        // Deselect when clicking on empty background
        if (e.target === e.currentTarget) {
          selectEntity(null);
        }
      }}
    >
      <Canvas
        shadows
        camera={{ position: [130, 42, 35], fov: 45, near: 0.5, far: 2500 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full bg-[#030609]"
      >
        {/* Atmospheric Museum Hardware Lab Illumination */}
        <color attach="background" args={["#030609"]} />
        <fog attach="fog" args={["#030609", 350, 1400]} />

        {/* Natural Sky/Ground Ambient Balance */}
        <hemisphereLight
          args={["#C5E0F8", "#0B111A", 1.1]}
        />
        <ambientLight intensity={0.75} color="#A8C8E6" />

        {/* Distributed 4-Zone Key Lights Spanning the Entire 360-unit Motherboard (1940 - 2026) */}
        {/* 1. Foundations & Symbolic Era Light (1940 - 1980) */}
        <directionalLight
          position={[-110, 65, 35]}
          intensity={1.2}
          color="#F1F5F9"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* 2. Connectionist & Boom Light (1980 - 2016) */}
        <directionalLight
          position={[-20, 65, 35]}
          intensity={1.25}
          color="#F8FAFC"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* 3. The Transformer Era Light (2017 - 2021) */}
        <directionalLight
          position={[50, 65, 35]}
          intensity={1.3}
          color="#F8FAFC"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* 4. Foundation Models & Agentic Frontier (2022 - 2026) */}
        <directionalLight
          position={[140, 65, 35]}
          intensity={1.35}
          color="#F8FAFC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Subtle Cyan Backlight / Rim */}
        <directionalLight
          position={[10, 30, -35]}
          intensity={0.6}
          color="#00F0FF"
        />

        {/* Camera Orchestrator */}
        <CameraController placedEntities={placedEntities} />

        {/* 3D World Scene */}
        <React.Suspense fallback={null}>
          <group>
            <Motherboard />
            <TimelineSpine />
            <EpochZones />
            <RelationshipTraces
              relationships={RELATIONSHIPS}
              placedEntities={placedEntities}
            />
            {placedEntities.map((entity) => (
              <EntityNode key={entity.id} entity={entity} />
            ))}
          </group>
        </React.Suspense>
      </Canvas>
    </div>
  );
}
