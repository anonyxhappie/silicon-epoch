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
        camera={{ position: [10, 45, 40], fov: 45, near: 0.5, far: 600 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full bg-[#030609]"
      >
        {/* Atmospheric Museum Hardware Lab Illumination */}
        <color attach="background" args={["#030609"]} />
        <fog attach="fog" args={["#030609", 90, 260]} />

        {/* Natural Sky/Ground Ambient Balance */}
        <hemisphereLight
          args={["#C5E0F8", "#0B111A", 0.95]}
        />
        <ambientLight intensity={0.65} color="#A8C8E6" />

        {/* Distributed 3-Zone Key Lights Spanning the 300-unit Motherboard */}
        {/* 1. Foundations & Symbolic Era Light (1950 - 1995) */}
        <directionalLight
          position={[-65, 55, 30]}
          intensity={1.2}
          color="#F1F5F9"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* 2. Deep Learning & Transformer Era Light (1996 - 2021) */}
        <directionalLight
          position={[25, 55, 30]}
          intensity={1.3}
          color="#F8FAFC"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* 3. Foundation Models & Frontier Era Light (2022 - 2026) */}
        <directionalLight
          position={[115, 55, 30]}
          intensity={1.3}
          color="#F8FAFC"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Subtle Cyan Backlight / Rim */}
        <directionalLight
          position={[10, 30, -35]}
          intensity={0.5}
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
