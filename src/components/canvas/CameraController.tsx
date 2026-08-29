"use client";

import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import * as THREE from "three";
import { useEpochStore } from "@/lib/store/useEpochStore";
import { PlacedEntity } from "@/types/schema";
import { xToTimelineYear } from "@/lib/layout/timelineLayout";
import { EPOCHS } from "@/lib/data/dataset";

interface CameraControllerProps {
  placedEntities: PlacedEntity[];
}

export function CameraController({ placedEntities }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsType>(null);

  const isEntered = useEpochStore((s) => s.isEntered);
  const cameraMode = useEpochStore((s) => s.cameraMode);
  const selectedEntityId = useEpochStore((s) => s.selectedEntityId);
  const timelineProgress = useEpochStore((s) => s.timelineProgress);
  const setTimelineProgress = useEpochStore((s) => s.setTimelineProgress);
  const setActiveEpoch = useEpochStore((s) => s.setActiveEpoch);
  const isReducedMotion = useEpochStore((s) => s.isReducedMotion);

  // Target positions
  const targetCamPos = useRef(new THREE.Vector3(10, 45, 40));
  const targetLookAt = useRef(new THREE.Vector3(10, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(10, 0, 0));

  // Find selected entity position
  const selectedEntity = placedEntities.find((e) => e.id === selectedEntityId);

  // Wheel / Glide Scrubbing Listener
  useEffect(() => {
    if (!isEntered) return;

    const handleWheel = (e: WheelEvent) => {
      // If inspecting a model, let user orbit or scroll inspect instead of gliding timeline
      if (selectedEntityId) return;

      const delta = e.deltaY * 0.0006;
      const newProgress = Math.max(0, Math.min(1, timelineProgress + delta));
      setTimelineProgress(newProgress);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedEntityId) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setTimelineProgress(Math.min(1, timelineProgress + 0.03));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setTimelineProgress(Math.max(0, timelineProgress - 0.03));
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEntered, selectedEntityId, timelineProgress, setTimelineProgress]);

  // Compute camera target based on state
  useEffect(() => {
    if (!isEntered) {
      // Landing Overview
      targetCamPos.current.set(10, 50, 45);
      targetLookAt.current.set(10, 0, 0);
      return;
    }

    if (selectedEntity && (cameraMode === "INSPECT" || cameraMode === "EXPLODED" || cameraMode === "FOCUS")) {
      // Precision CAD Inspection Camera framed for 5-layer exploded separation
      const [x, y, z] = selectedEntity.position;
      const scale = selectedEntity.visualScale || 1.0;
      const camDist = 12.0 * Math.max(0.9, scale * 0.9);
      targetCamPos.current.set(x - camDist * 0.45, y + camDist * 0.7, z + camDist * 0.85);
      targetLookAt.current.set(x + 1.2 * scale, y + 2.5 * scale, z);
    } else {
      // Glide Along Timeline
      // Map timelineProgress (0..1) to X (-130 to +155)
      const currentX = -130 + timelineProgress * 285;
      targetCamPos.current.set(currentX - 5, 23, 30);
      targetLookAt.current.set(currentX + 8, 0, 5);

      // Determine active epoch based on year
      const currentYear = xToTimelineYear(currentX);
      const activeEpoch = EPOCHS.find(
        (ep) => currentYear >= ep.start_year && currentYear <= ep.end_year
      );
      if (activeEpoch) {
        setActiveEpoch(activeEpoch.id);
      }
    }
  }, [isEntered, cameraMode, selectedEntity, timelineProgress, setActiveEpoch]);

  useFrame((_, delta) => {
    const damping = isReducedMotion ? 40 : 5;

    // Smoothly interpolate camera position
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetCamPos.current.x,
      damping,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetCamPos.current.y,
      damping,
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetCamPos.current.z,
      damping,
      delta
    );

    // Smoothly interpolate lookAt
    currentLookAt.current.x = THREE.MathUtils.damp(
      currentLookAt.current.x,
      targetLookAt.current.x,
      damping,
      delta
    );
    currentLookAt.current.y = THREE.MathUtils.damp(
      currentLookAt.current.y,
      targetLookAt.current.y,
      damping,
      delta
    );
    currentLookAt.current.z = THREE.MathUtils.damp(
      currentLookAt.current.z,
      targetLookAt.current.z,
      damping,
      delta
    );

    if (controlsRef.current) {
      controlsRef.current.target.copy(currentLookAt.current);
      controlsRef.current.update();
    } else {
      camera.lookAt(currentLookAt.current);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={Boolean(selectedEntityId)}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below motherboard
      minDistance={2}
      maxDistance={60}
    />
  );
}
