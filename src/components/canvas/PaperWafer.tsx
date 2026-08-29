"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import { Entity } from "@/types/schema";

interface PaperWaferProps {
  entity: Entity;
  visualScale: number;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  isGhosted?: boolean;
}

export function PaperWafer({
  entity,
  visualScale,
  isHovered,
  isSelected,
  isDimmed,
  isGhosted = false,
}: PaperWaferProps) {
  const glowColor = useMemo(() => {
    if (entity.epoch_id === "epoch-foundations") return "#00F0FF";
    if (entity.epoch_id === "epoch-transformer-era") return "#F59E0B";
    return "#38BDF8";
  }, [entity.epoch_id]);

  const radius = 1.5 * visualScale;

  if (isGhosted) {
    return (
      <group>
        <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 8, 0]}>
          <cylinderGeometry args={[radius, radius * 1.04, 0.18 * visualScale, 8]} />
          <meshStandardMaterial
            color="#05080E"
            transparent
            opacity={0.15}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* 1. Silicon Wafer Hexagonal Base Die */}
      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
        <cylinderGeometry args={[radius, radius * 1.04, 0.18 * visualScale, 8]} />
        <meshStandardMaterial
          color={isDimmed ? "#0B111A" : "#1B2433"}
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* 2. Top Crystalline Reflective Layer */}
      <mesh
        position={[0, 0.22 * visualScale, 0]}
        rotation={[0, Math.PI / 8, 0]}
      >
        <cylinderGeometry
          args={[radius * 0.88, radius * 0.88, 0.04 * visualScale, 8]}
        />
        <meshStandardMaterial
          color={isDimmed ? "#0F172A" : "#223046"}
          roughness={0.12}
          metalness={0.92}
        />
      </mesh>

      {/* 3. Gold Trim Ring */}
      <mesh
        position={[0, 0.24 * visualScale, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius * 0.84, radius * 0.89, 32]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* 4. Etched Research Title & Author */}
      <group position={[0, 0.27 * visualScale, 0]}>
        <Text
          position={[0, 0.01, -radius * 0.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22 * visualScale}
          color={isDimmed ? "#64748B" : "#FFFFFF"}
          anchorX="center"
          anchorY="middle"
          maxWidth={radius * 1.5}
        >
          {entity.name}
        </Text>
        <Text
          position={[0, 0.01, radius * 0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.14 * visualScale}
          color={isDimmed ? "#475569" : glowColor}
          anchorX="center"
          anchorY="middle"
        >
          {entity.creator_name || entity.creator} ({entity.release_date.split("-")[0]})
        </Text>
      </group>

      {/* 5. Glowing Selection Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.1, radius * 1.18, 32]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={isSelected ? 0.8 : 0.4}
          />
        </mesh>
      )}
    </group>
  );
}
