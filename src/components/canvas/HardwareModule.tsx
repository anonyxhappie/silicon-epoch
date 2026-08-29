"use client";

import React, { useMemo } from "react";
import { Text } from "@react-three/drei";
import { Entity } from "@/types/schema";

interface HardwareModuleProps {
  entity: Entity;
  visualScale: number;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
}

export function HardwareModule({
  entity,
  visualScale,
  isHovered,
  isSelected,
  isDimmed,
}: HardwareModuleProps) {
  const finCount = 6;
  const width = 3.2 * visualScale;
  const depth = 2.4 * visualScale;

  const glowColor = useMemo(() => {
    return "#10B981"; // Hardware emerald / teal
  }, []);

  return (
    <group>
      {/* 1. Base Accelerator Substrate */}
      <mesh position={[0, 0.15 * visualScale, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.3 * visualScale, depth]} />
        <meshStandardMaterial
          color={isDimmed ? "#070B0E" : "#0D1820"}
          roughness={0.65}
          metalness={0.4}
        />
      </mesh>

      {/* 2. Copper Heat Pipe / Base Plate */}
      <mesh position={[0, 0.32 * visualScale, 0]}>
        <boxGeometry args={[width * 0.85, 0.08 * visualScale, depth * 0.85]} />
        <meshStandardMaterial
          color="#C87D55"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* 3. Heatsink Cooling Fins Array */}
      {Array.from({ length: finCount }).map((_, i) => {
        const offsetZ = (i - (finCount - 1) / 2) * (0.32 * visualScale);
        return (
          <mesh
            key={i}
            position={[0, 0.48 * visualScale, offsetZ]}
            castShadow
          >
            <boxGeometry
              args={[width * 0.75, 0.25 * visualScale, 0.06 * visualScale]}
            />
            <meshStandardMaterial
              color={isDimmed ? "#161D26" : "#242D3C"}
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>
        );
      })}

      {/* 4. Top Nameplate Badge */}
      <group position={[0, 0.65 * visualScale, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[width * 0.7, 0.04 * visualScale, 0.6 * visualScale]} />
          <meshStandardMaterial
            color="#0F172A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <Text
          position={[0, 0.03 * visualScale, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2 * visualScale}
          color={isDimmed ? "#4B5563" : isSelected ? "#FFFFFF" : "#F3F4F6"}
          anchorX="center"
          anchorY="middle"
          maxWidth={width * 0.65}
        >
          {entity.name}
        </Text>
      </group>

      {/* 5. Golden PCIe / SXM Edge Connector Fingers */}
      <mesh
        position={[0, 0.05 * visualScale, depth / 2 + 0.1 * visualScale]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[width * 0.7, 0.06 * visualScale, 0.2 * visualScale]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* 6. Selection Highlight */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[width * 0.55, width * 0.62, 32]}
          />
          <meshBasicMaterial color={glowColor} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
