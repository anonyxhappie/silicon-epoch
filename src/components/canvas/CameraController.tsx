"use client";

import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PlacedEntity } from "@/types/schema";
import { useEpochStore } from "@/lib/store/useEpochStore";
import {
  progressToTimelineX,
  xToTimelineYear,
} from "@/lib/layout/timelineLayout";
import { EPOCHS } from "@/lib/data/dataset";

interface CameraControllerProps {
  placedEntities: PlacedEntity[];
}

export function CameraController({ placedEntities }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const isEntered = useEpochStore((s) => s.isEntered);
  const cameraMode = useEpochStore((s) => s.cameraMode);
  const selectedEntityId = useEpochStore((s) => s.selectedEntityId);
  const timelineProgress = useEpochStore((s) => s.timelineProgress);
  const activeEpochId = useEpochStore((s) => s.activeEpochId);
  const isReducedMotion = useEpochStore((s) => s.isReducedMotion);
  const cameraAction = useEpochStore((s) => s.cameraAction);
  const setTimelineProgress = useEpochStore((s) => s.setTimelineProgress);
  const setActiveEpoch = useEpochStore((s) => s.setActiveEpoch);

  const selectedEntity = placedEntities.find((e) => e.id === selectedEntityId);

  // Target vectors for programmatic animations
  const targetCamPos = useRef(new THREE.Vector3(130, 42, 35));
  const targetLookAt = useRef(new THREE.Vector3(135, 0, 5));

  // Flag indicating whether camera is currently programmatically transitioning
  const isTransitioning = useRef(false);
  const prevSelectedId = useRef<string | null>(null);
  const prevTimelineProgress = useRef<number>(timelineProgress);
  const lastActionTimestamp = useRef<number>(0);

  // Helper to trigger a smooth transition
  const triggerTransition = useCallback(
    (camPos: THREE.Vector3, lookAtPos: THREE.Vector3) => {
      targetCamPos.current.copy(camPos);
      targetLookAt.current.copy(lookAtPos);
      isTransitioning.current = true;
    },
    []
  );

  // 1. Initial Entry / Landing Overview
  useEffect(() => {
    if (!isEntered) {
      targetCamPos.current.set(130, 42, 35);
      targetLookAt.current.set(135, 0, 5);
      isTransitioning.current = true;
    }
  }, [isEntered]);

  // 2. Focus on Selected Entity (CAD Teardown View)
  useEffect(() => {
    if (!isEntered) return;

    if (selectedEntityId && selectedEntityId !== prevSelectedId.current) {
      prevSelectedId.current = selectedEntityId;
      if (selectedEntity) {
        const [x, y, z] = selectedEntity.position;
        const scale = selectedEntity.visualScale || 1.0;
        const camDist = 14.0 * Math.max(0.9, scale * 0.9);

        // Frame from clean angled perspective with elevated view to see exploded layers
        const newCam = new THREE.Vector3(
          x - camDist * 0.4,
          y + camDist * 0.75,
          z + camDist * 0.75
        );
        const newLook = new THREE.Vector3(x, y + 2.0 * scale, z);

        triggerTransition(newCam, newLook);
      }
    } else if (!selectedEntityId && prevSelectedId.current !== null) {
      // Deselected: return to timeline glide position
      prevSelectedId.current = null;
      const targetX = progressToTimelineX(timelineProgress);
      if (controlsRef.current) {
        const currentTarget = controlsRef.current.target;
        const currentCam = camera.position;
        const deltaX = targetX - currentTarget.x;

        const newCam = new THREE.Vector3(
          currentCam.x + deltaX,
          Math.max(currentCam.y, 22),
          currentCam.z
        );
        const newLook = new THREE.Vector3(targetX, 0, 0);
        triggerTransition(newCam, newLook);
      }
    }
  }, [selectedEntityId, selectedEntity, isEntered, timelineProgress, triggerTransition, camera]);

  // 3. Timeline scrubbing (glides directly and smoothly along X)
  useEffect(() => {
    if (!isEntered || selectedEntityId) return;

    if (Math.abs(timelineProgress - prevTimelineProgress.current) > 0.0005) {
      prevTimelineProgress.current = timelineProgress;
      const targetX = progressToTimelineX(timelineProgress);

      if (controlsRef.current) {
        const currentTarget = controlsRef.current.target;
        const currentCam = camera.position;
        const camOffsetX = currentCam.x - currentTarget.x;

        targetLookAt.current.set(targetX, 0, 0);
        targetCamPos.current.set(
          targetX + (camOffsetX || -5),
          Math.max(currentCam.y, 22),
          currentCam.z || 30
        );
        isTransitioning.current = true;
      }

      // Update active epoch
      const currentYear = xToTimelineYear(targetX);
      const activeEpoch = EPOCHS.find(
        (ep) => currentYear >= ep.start_year && currentYear <= ep.end_year
      );
      if (activeEpoch && activeEpoch.id !== activeEpochId) {
        setActiveEpoch(activeEpoch.id);
      }
    }
  }, [timelineProgress, isEntered, selectedEntityId, setActiveEpoch, activeEpochId, camera]);

  // 4. Keyboard timeline glide
  useEffect(() => {
    if (!isEntered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "KeyD") {
        setTimelineProgress(Math.min(1.0, timelineProgress + 0.02));
      } else if (e.key === "ArrowLeft" || e.key === "KeyA") {
        setTimelineProgress(Math.max(0.0, timelineProgress - 0.02));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEntered, timelineProgress, setTimelineProgress]);

  // 5. Camera Control Widget Actions (Zoom, Rotate, Top-down, Macro Panoramic, Reset)
  useEffect(() => {
    if (!cameraAction || cameraAction.timestamp === lastActionTimestamp.current) {
      return;
    }
    lastActionTimestamp.current = cameraAction.timestamp;

    const { type } = cameraAction;
    const controls = controlsRef.current;
    if (!controls) return;

    const lookTarget = controls.target.clone();
    const camOffset = new THREE.Vector3().subVectors(camera.position, lookTarget);

    if (type === "zoom_in") {
      camOffset.multiplyScalar(0.7);
      if (camOffset.length() < 2) camOffset.setLength(2);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "zoom_out") {
      camOffset.multiplyScalar(1.45);
      if (camOffset.length() > 550) camOffset.setLength(550);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "macro_overview") {
      // Complete panoramic overview of entire 1940 to 2026 motherboard
      const macroCam = new THREE.Vector3(20, 195, 135);
      const macroLook = new THREE.Vector3(20, 0, 0);
      triggerTransition(macroCam, macroLook);
    } else if (type === "rotate_left") {
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "rotate_right") {
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 6);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "top_down") {
      const topPos = new THREE.Vector3(lookTarget.x, Math.max(camera.position.y, 65), lookTarget.z + 0.01);
      triggerTransition(topPos, lookTarget);
    } else if (type === "reset") {
      if (selectedEntity) {
        const [x, y, z] = selectedEntity.position;
        const scale = selectedEntity.visualScale || 1.0;
        const camDist = 14.0 * Math.max(0.9, scale * 0.9);
        const newCam = new THREE.Vector3(
          x - camDist * 0.4,
          y + camDist * 0.75,
          z + camDist * 0.75
        );
        const newLook = new THREE.Vector3(x, y + 2.0 * scale, z);
        triggerTransition(newCam, newLook);
      } else {
        const targetX = progressToTimelineX(timelineProgress);
        const defaultCam = new THREE.Vector3(targetX - 5, 25, 32);
        const defaultLook = new THREE.Vector3(targetX + 8, 0, 5);
        triggerTransition(defaultCam, defaultLook);
      }
    }
  }, [cameraAction, camera, selectedEntity, timelineProgress, triggerTransition]);

  // 6. Smooth Frame Interpolation ONLY when transitioning programmatically
  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    const damping = isReducedMotion ? 40 : 10;
    const controls = controlsRef.current;

    // Smooth damp camera position
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

    // Smooth damp controls target lookAt
    if (controls) {
      controls.target.x = THREE.MathUtils.damp(
        controls.target.x,
        targetLookAt.current.x,
        damping,
        delta
      );
      controls.target.y = THREE.MathUtils.damp(
        controls.target.y,
        targetLookAt.current.y,
        damping,
        delta
      );
      controls.target.z = THREE.MathUtils.damp(
        controls.target.z,
        targetLookAt.current.z,
        damping,
        delta
      );
      controls.update();

      // Check if transition has arrived close enough to hand over 100% control to OrbitControls
      const posDist = camera.position.distanceTo(targetCamPos.current);
      const targetDist = controls.target.distanceTo(targetLookAt.current);
      if (posDist < 0.08 && targetDist < 0.08) {
        camera.position.copy(targetCamPos.current);
        controls.target.copy(targetLookAt.current);
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={isEntered}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2 - 0.02} // Prevent going below motherboard
      minDistance={1.2}
      maxDistance={600} // Expanded to allow zooming all the way out to full 1940-2026 timeline
      onStart={() => {
        // User interacted! Immediately cease any automatic animation so user has 100% control
        isTransitioning.current = false;
      }}
    />
  );
}
