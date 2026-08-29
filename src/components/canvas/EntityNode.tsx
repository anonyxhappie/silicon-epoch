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
  const isAnotherSelected = Boolean(selectedEntityId && selectedEntityId !== entity.id);
  const isGhosted = isAnotherSelected;

  const tier = entity.tier || (entity.visual?.importance >= 0.95 ? "tier_s" : "tier_a");

  // Smooth hover elevation lift
  const currentYOffset = useRef(0);
  useFrame((_, delta) => {
    const targetY = isHovered && !isGhosted ? 0.45 : isSelected ? 0.2 : 0;
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

  // Theme & Openness accent colors
  const tierColor = useMemo(() => {
    if (tier === "tier_s") return "#F59E0B"; // Gold for Tier S Frontier
    if (entity.availability === "open_source" || entity.availability === "open_weights") return "#10B981"; // Emerald for Open Weights
    if (entity.epoch_id === "epoch-agentic-frontier") return "#8B5CF6"; // Purple for Agentic Frontier
    if (entity.epoch_id === "epoch-foundation-models") return "#EC4899";
    return "#00F0FF";
  }, [tier, entity.availability, entity.epoch_id]);

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
    if (!isGhosted) {
      hoverEntity(entity.id);
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = () => {
    hoverEntity(null);
    document.body.style.cursor = "auto";
  };

  // Whether floating billboard badge should show:
  // When an entity is selected, NEVER show badges on other nodes to avoid clutter!
  const showBadge = !selectedEntityId && (tier === "tier_s" || tier === "tier_a" || isHovered);

  return (
    <group
      ref={groupRef}
      position={[entity.position[0], entity.position[1], entity.position[2]]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Orthogonal PCB Bus Trace (Hidden if another node is selected) */}
      {!isGhosted && (
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
            color={isHovered || isSelected ? tierColor : tier === "tier_s" ? "#94621A" : "#1E2A3C"}
            transparent
            opacity={isHovered || isSelected ? 0.95 : tier === "tier_s" ? 0.65 : 0.25}
          />
        </line>
      )}

      {/* Tier S Beacon Ring (Visible in overview) */}
      {tier === "tier_s" && !isSelected && !isGhosted && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[entity.visualScale * 1.5, entity.visualScale * 1.55, 32]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={isDimmed ? 0.2 : 0.65} />
        </mesh>
      )}

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
          isGhosted={isGhosted}
        />
      ) : entity.type === "paper" || entity.visual.entity_shape === "paper_wafer" ? (
        <PaperWafer
          entity={entity}
          visualScale={entity.visualScale}
          isHovered={isHovered}
          isSelected={isSelected}
          isDimmed={isDimmed}
          isGhosted={isGhosted}
        />
      ) : (
        <ModelChip
          entity={entity}
          visualScale={entity.visualScale}
          isHovered={isHovered}
          isSelected={isSelected}
          isDimmed={isDimmed}
          isGhosted={isGhosted}
        />
      )}

      {/* Floating 3D HUD Badge (High-Legibility Billboard) */}
      {showBadge && (
        <Billboard
          position={[
            0,
            entity.visualScale * 1.6 + (isHovered ? 1.6 : 1.2),
            0,
          ]}
        >
          <group>
            {/* Background Dark Glass Pill */}
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry
                args={[
                  Math.max(entity.name.length * 0.19 + 0.9, 2.2),
                  isHovered ? 0.85 : tier === "tier_s" ? 0.65 : 0.52,
                ]}
              />
              <meshBasicMaterial
                color="#060A12"
                transparent
                opacity={isHovered ? 0.95 : isDimmed ? 0.35 : tier === "tier_s" ? 0.9 : 0.75}
              />
            </mesh>

            {/* Glowing Accent Indicator Dot */}
            <mesh
              position={[
                -(Math.max(entity.name.length * 0.19 + 0.9, 2.2) / 2) + 0.25,
                isHovered ? 0.15 : 0,
                0,
              ]}
            >
              <circleGeometry args={[tier === "tier_s" ? 0.1 : 0.07, 16]} />
              <meshBasicMaterial color={tierColor} />
            </mesh>

            {/* Entity Name */}
            <Text
              position={[0.1, isHovered ? 0.15 : 0, 0]}
              fontSize={tier === "tier_s" ? 0.3 : 0.25}
              color={isDimmed ? "#64748B" : isHovered ? "#FFFFFF" : tier === "tier_s" ? "#F8FAFC" : "#CBD5E1"}
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
                color={tierColor}
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
