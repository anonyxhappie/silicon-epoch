"use client";

import React from "react";
import { Text } from "@react-three/drei";
import { EPOCHS } from "@/lib/data/dataset";
import { getEpochBounds } from "@/lib/layout/timelineLayout";
import { useEpochStore } from "@/lib/store/useEpochStore";

export function EpochZones() {
  const epochBounds = getEpochBounds(EPOCHS);
  const activeEpochId = useEpochStore((s) => s.activeEpochId);
  const selectedEntityId = useEpochStore((s) => s.selectedEntityId);

  const hasSelection = Boolean(selectedEntityId);

  return (
    <group position={[0, 0.04, 0]}>
      {epochBounds.map((epoch) => {
        const isActive = activeEpochId === epoch.id;

        return (
          <group key={epoch.id}>
            {/* 1. Boundary Demarcation Line at Epoch Start */}
            <mesh position={[epoch.startX, 0.02, 0]}>
              <boxGeometry args={[0.2, 0.05, 48]} />
              <meshStandardMaterial
                color={epoch.theme_color}
                emissive={epoch.theme_color}
                emissiveIntensity={hasSelection ? 0.08 : isActive ? 0.8 : 0.25}
                roughness={0.3}
                transparent
                opacity={hasSelection ? 0.2 : 1.0}
              />
            </mesh>

            {/* 2. Top Silkscreen Epoch Title */}
            <Text
              position={[epoch.centerX, 0.06, -23]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.7}
              color={hasSelection ? "#1E293B" : isActive ? "#FFFFFF" : "#4E6B8C"}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.15}
            >
              {epoch.title.toUpperCase()}
            </Text>

            {/* 3. Subtitle / Year Range */}
            <Text
              position={[epoch.centerX, 0.06, -20.5]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.85}
              color={hasSelection ? "#0F172A" : epoch.theme_color}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
            >
              {epoch.subtitle}
            </Text>

            {/* 4. Bottom Zone Bracket Marking */}
            <mesh position={[epoch.centerX, 0.01, 20]}>
              <boxGeometry args={[epoch.width * 0.8, 0.02, 0.08]} />
              <meshStandardMaterial
                color={epoch.theme_color}
                transparent
                opacity={hasSelection ? 0.05 : 0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
