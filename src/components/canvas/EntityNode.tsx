"use client";

import React, { useMemo, useRef } from "react";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlacedEntity } from "@/types/schema";
import { useEpochStore } from "@/lib/store/useEpochStore";
import { ModelChip } from "./ModelChip";
import { PaperWafer } from "./PaperWafer";
import { HardwareModule } from "./HardwareModule";
import { ExplodedChip3D } from "./ExplodedChip3D";

interface EntityNodeProps {
  entity: PlacedEntity;
}

export function EntityNode({ entity }: EntityNodeProps) {
  const selectedEntityId = useEpochStore((s) => s.selectedEntityId);
  const hoveredEntityId = useEpochStore((s) => s.hoveredEntityId);
  const selectEntity = useEpochStore((s) => s.selectEntity);
  const hoverEntity = useEpochStore((s) => s.hoverEntity);
  const filters = useEpochStore((s) => s.filters);
  const explodedProgress = useEpochStore((s) => s.explodedProgress);

  const groupRef = useRef<THREE.Group>(null);
  const isSelected = selectedEntityId === entity.id;
  const isHovered = hoveredEntityId === entity.id;

  // Smooth hover elevation lift
  const currentYOffset = useRef(0);
  useFrame((_, delta) => {
    const targetY = isHovered ? 0.35 : 0;
    currentYOffset.current = THREE.MathUtils.damp(
      currentYOffset.current,
      targetY,
      12,
      delta
    );
    if (groupRef.current) {
      groupRef.current.position.y = entity.position[1] + currentYOffset.current;
    }
  });

  // Epoch theme color for badge
  const epochColor = useMemo(() => {
    if (entity.epoch_id === "epoch-agentic-frontier") return "#8B5CF6";
    if (entity.epoch_id === "epoch-foundation-models") return "#EC4899";
    if (entity.epoch_id === "epoch-transformer-era") return "#F59E0B";
    if (entity.epoch_id === "epoch-deep-learning-boom") return "#10B981";
    return "#00F0FF";
  }, [entity.epoch_id]);

  // Filter Match Calculation
  const isDimmed = useMemo(() => {
    if (
      filters.epochs.length > 0 &&
      !filters.epochs.includes(entity.epoch_id)
    ) {
      return true;
    }
    if (
      filters.entityTypes.length > 0 &&
      !filters.entityTypes.includes(entity.type)
    ) {
      return true;
    }
    if (
      filters.availability.length > 0 &&
      entity.availability &&
      !filters.availability.includes(entity.availability)
    ) {
      return true;
    }
    if (filters.modalities.length > 0) {
      const entityMods = entity.modalities || [];
      const hasMod = filters.modalities.some((m) => entityMods.includes(m));
      if (!hasMod) return true;
    }
    if (filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = entity.name.toLowerCase().includes(q);
      const matchCreator = (entity.creator_name || entity.creator)
        .toLowerCase()
        .includes(q);
      const matchCategory = entity.category.toLowerCase().includes(q);
      if (!matchName && !matchCreator && !matchCategory) {
        return true;
      }
    }
    return false;
  }, [filters, entity]);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectEntity(isSelected ? null : entity.id);
  };

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    hoverEntity(entity.id);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    hoverEntity(null);
    document.body.style.cursor = "auto";
  };

  return (
    <group
      ref={groupRef}
      position={[entity.position[0], entity.position[1], entity.position[2]]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Orthogonal PCB Bus Trace Connecting Node to Central Timeline Spine */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={
              new Float32Array([
                0,
                0.04 - entity.position[1],
                0,
                0,
                0.04 - entity.position[1],
                -entity.position[2],
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isHovered || isSelected ? epochColor : "#1E2A3C"}
          transparent
          opacity={isHovered || isSelected ? 0.95 : 0.3}
        />
      </line>

      {/* If this specific entity is selected and in inspection mode, render exploded view */}
      {isSelected ? (
        <ExplodedChip3D
          entity={entity}
          visualScale={entity.visualScale}
          explodedProgress={explodedProgress}
        />
      ) : entity.type === "hardware" ? (
        <HardwareModule
          entity={entity}
          visualScale={entity.visualScale}
          isHovered={isHovered}
          isSelected={isSelected}
          isDimmed={isDimmed}
        />
      ) : entity.type === "paper" || entity.visual.entity_shape === "paper_wafer" ? (
        <PaperWafer
          entity={entity}
          visualScale={entity.visualScale}
          isHovered={isHovered}
          isSelected={isSelected}
          isDimmed={isDimmed}
        />
      ) : (
        <ModelChip
          entity={entity}
          visualScale={entity.visualScale}
          isHovered={isHovered}
          isSelected={isSelected}
          isDimmed={isDimmed}
        />
      )}

      {/* Persistent Floating 3D HUD Badge (High-Legibility Billboard) */}
      {!isSelected && (
        <Billboard
          position={[
            0,
            entity.visualScale * 1.5 + (isHovered ? 1.6 : 1.2),
            0,
          ]}
        >
          <group>
            {/* Background Dark Glass Pill */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry
                args={[
                  Math.max(entity.name.length * 0.18 + 0.8, 2.2),
                  isHovered ? 0.85 : 0.55,
                ]}
              />
              <meshBasicMaterial
                color="#060A12"
                transparent
                opacity={isHovered ? 0.95 : isDimmed ? 0.4 : 0.8}
              />
            </mesh>

            {/* Glowing Accent Indicator Dot */}
            <mesh
              position={[
                -(Math.max(entity.name.length * 0.18 + 0.8, 2.2) / 2) + 0.25,
                isHovered ? 0.15 : 0,
                0,
              ]}
            >
              <circleGeometry args={[0.08, 16]} />
              <meshBasicMaterial color={epochColor} />
            </mesh>

            {/* Entity Name */}
            <Text
              position={[0.1, isHovered ? 0.15 : 0, 0]}
              fontSize={0.28}
              color={isDimmed ? "#64748B" : isHovered ? "#FFFFFF" : "#E2E8F0"}
              anchorX="center"
              anchorY="middle"
            >
              {entity.name}
            </Text>

            {/* Sub-label when Hovered */}
            {isHovered && (
              <Text
                position={[0, -0.2, 0]}
                fontSize={0.17}
                color={epochColor}
                anchorX="center"
                anchorY="middle"
              >
                {entity.release_date.split("-")[0]} • {entity.category}
              </Text>
            )}
          </group>
        </Billboard>
      )}
    </group>
  );
}
