"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import { Entity } from "@/types/schema";

interface ModelChipProps {
  entity: Entity;
  visualScale: number;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  isGhosted?: boolean;
}

export function ModelChip({
  entity,
  visualScale,
  isHovered,
  isSelected,
  isDimmed,
  isGhosted = false,
}: ModelChipProps) {
  // Generate BGA ball pin positions for the underside
  const pinPositions = useMemo(() => {
    if (isGhosted) return [];
    const positions: [number, number, number][] = [];
    const count = 4;
    const spacing = (visualScale * 1.6) / count;
    const offset = (spacing * (count - 1)) / 2;

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if ((r === 1 || r === 2) && (c === 1 || c === 2)) continue;
        positions.push([r * spacing - offset, -0.12, c * spacing - offset]);
      }
    }
    return positions;
  }, [visualScale, isGhosted]);

  const glowColor = useMemo(() => {
    if (entity.epoch_id === "epoch-agentic-frontier") return "#8B5CF6";
    if (entity.epoch_id === "epoch-foundation-models") return "#EC4899";
    if (entity.epoch_id === "epoch-transformer-era") return "#F59E0B";
    if (entity.epoch_id === "epoch-deep-learning-boom") return "#10B981";
    return "#00F0FF";
  }, [entity.epoch_id]);

  const baseSize = 2.4 * visualScale;
  const height = 0.35 * visualScale;

  if (isGhosted) {
    // Highly dimmed, non-distracting minimalist silhouette when another entity is inspected
    return (
      <group>
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[baseSize, height, baseSize]} />
          <meshStandardMaterial
            color="#060A10"
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
      {/* 1. Dark Substrate / Organic BGA Carrier */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseSize, height, baseSize]} />
        <meshStandardMaterial
          color={isDimmed ? "#0A0E17" : "#111A29"}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* 2. Copper Thermal Spreader Shim */}
      <mesh position={[0, height + 0.02 * visualScale, 0]}>
        <boxGeometry
          args={[baseSize * 0.9, 0.04 * visualScale, baseSize * 0.9]}
        />
        <meshStandardMaterial
          color="#C87D55"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* 3. Anodized Gunmetal Heat Spreader (IHS) */}
      <mesh position={[0, height + 0.14 * visualScale, 0]} castShadow>
        <boxGeometry
          args={[baseSize * 0.85, 0.22 * visualScale, baseSize * 0.85]}
        />
        <meshStandardMaterial
          color={
            isSelected
              ? "#2563EB"
              : isHovered
              ? "#1E40AF"
              : isDimmed
              ? "#131C2A"
              : "#202C3F"
          }
          metalness={0.92}
          roughness={0.22}
        />
      </mesh>

      {/* 4. Recessed Silicon Die Core Inset */}
      <mesh position={[0, height + 0.26 * visualScale, 0]}>
        <boxGeometry
          args={[baseSize * 0.52, 0.03 * visualScale, baseSize * 0.52]}
        />
        <meshStandardMaterial
          color={isDimmed ? "#0C101A" : "#121A26"}
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      {/* 5. Laser Etched Silkscreen Chip Text */}
      <group position={[0, height + 0.29 * visualScale, 0]}>
        <Text
          position={[0, 0.01, -baseSize * 0.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.24 * visualScale}
          color={isDimmed ? "#64748B" : "#FFFFFF"}
          anchorX="center"
          anchorY="middle"
          maxWidth={baseSize * 0.8}
        >
          {entity.name}
        </Text>
        <Text
          position={[0, 0.01, baseSize * 0.18]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.15 * visualScale}
          color={isDimmed ? "#475569" : glowColor}
          anchorX="center"
          anchorY="middle"
        >
          {entity.creator_name || entity.creator.replace("org-", "").toUpperCase()} • {entity.release_date.split("-")[0]}
        </Text>
      </group>

      {/* 6. Gold Corner Pin 1 Triangle */}
      <mesh
        position={[
          -baseSize * 0.36,
          height + 0.26 * visualScale,
          -baseSize * 0.36,
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.09 * visualScale, 3]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* 7. Status Indicator LED */}
      <mesh
        position={[
          baseSize * 0.36,
          height + 0.26 * visualScale,
          baseSize * 0.36,
        ]}
      >
        <sphereGeometry args={[0.07 * visualScale, 8, 8]} />
        <meshBasicMaterial color={isDimmed ? "#334155" : glowColor} />
      </mesh>

      {/* 8. Gold BGA Solder Balls Underneath */}
      {pinPositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.08 * visualScale, 8, 8]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.95}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* 9. Glowing Selection Rim when active or hovered */}
      {(isSelected || isHovered) && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[baseSize * 0.65, baseSize * 0.72, 32]}
          />
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
