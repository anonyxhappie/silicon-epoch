"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { PlacedEntity, Relationship } from "@/types/schema";
import { useEpochStore } from "@/lib/store/useEpochStore";

interface RelationshipTracesProps {
  relationships: Relationship[];
  placedEntities: PlacedEntity[];
}

export function RelationshipTraces({
  relationships,
  placedEntities,
}: RelationshipTracesProps) {
  const selectedEntityId = useEpochStore((s) => s.selectedEntityId);
  const hoveredEntityId = useEpochStore((s) => s.hoveredEntityId);

  // Map for fast position lookups
  const posMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const ent of placedEntities) {
      map.set(ent.id, ent.position);
    }
    return map;
  }, [placedEntities]);

  // Compute curve points for all relationships
  const traceCurves = useMemo(() => {
    return relationships
      .map((rel) => {
        const p1 = posMap.get(rel.source);
        const p2 = posMap.get(rel.target);
        if (!p1 || !p2) return null;

        const v1 = new THREE.Vector3(p1[0], 0.1, p1[2]);
        const v2 = new THREE.Vector3(p2[0], 0.1, p2[2]);
        const dist = v1.distanceTo(v2);

        // Control point arched slightly upwards
        const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
        mid.y = Math.min(0.3 + dist * 0.06, 3.0);

        const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
        const points = curve
          .getPoints(24)
          .map((pt) => [pt.x, pt.y, pt.z] as [number, number, number]);

        return {
          rel,
          points,
          curve,
        };
      })
      .filter(Boolean);
  }, [relationships, posMap]);

  return (
    <group>
      {traceCurves.map((traceItem, idx) => {
        if (!traceItem) return null;
        const { rel, points } = traceItem;

        const isConnectedToSelected =
          selectedEntityId &&
          (rel.source === selectedEntityId || rel.target === selectedEntityId);
        const isConnectedToHovered =
          hoveredEntityId &&
          (rel.source === hoveredEntityId || rel.target === hoveredEntityId);

        const isHighlighted = isConnectedToSelected || isConnectedToHovered;
        const hasSelection = Boolean(selectedEntityId);

        // If a model is selected, hide unrelated traces completely
        if (hasSelection && !isConnectedToSelected) {
          return null;
        }

        let color = "#1E2A3C"; // Default dim trace
        if (isHighlighted) {
          if (rel.type === "accelerated_by") color = "#10B981"; // Hardware
          else if (rel.type === "influenced") color = "#F59E0B"; // Influence
          else if (rel.type === "trained_on" || rel.type === "used_in")
            color = "#8B5CF6";
          else color = "#00F0FF"; // Successor / Derived
        } else {
          color = "#334155";
        }

        const opacity = isHighlighted ? 1.0 : 0.45;
        const lineWidth = isHighlighted ? 3.5 : 1.2;

        return (
          <group key={rel.id || idx}>
            <Line
              points={points}
              color={color}
              lineWidth={lineWidth}
              transparent
              opacity={opacity}
            />
          </group>
        );
      })}
    </group>
  );
}
