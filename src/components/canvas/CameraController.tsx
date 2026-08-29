"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PlacedEntity } from "@/types/schema";
import { useEpochStore } from "@/lib/store/useEpochStore";
import { xToTimelineYear } from "@/lib/layout/timelineLayout";
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
  const isReducedMotion = useEpochStore((s) => s.isReducedMotion);
  const cameraAction = useEpochStore((s) => s.cameraAction);
  const setTimelineProgress = useEpochStore((s) => s.setTimelineProgress);
  const setActiveEpoch = useEpochStore((s) => s.setActiveEpoch);

  const selectedEntity = placedEntities.find((e) => e.id === selectedEntityId);

  // Target positions for smooth lerp
  const targetCamPos = useRef(new THREE.Vector3(10, 45, 40));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const isUserInteracting = useRef(false);
  const lastActionTimestamp = useRef(0);

  // Handle keyboard timeline gliding
  useEffect(() => {
    if (!isEntered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "KeyD") {
        setTimelineProgress(timelineProgress + 0.02);
      } else if (e.key === "ArrowLeft" || e.key === "KeyA") {
        setTimelineProgress(timelineProgress - 0.02);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEntered, timelineProgress, setTimelineProgress]);

  // Compute camera target based on state
  useEffect(() => {
    if (!isEntered) {
      // Landing Overview framed over latest frontier models
      targetCamPos.current.set(130, 42, 35);
      targetLookAt.current.set(135, 0, 5);
      return;
    }

    if (
      selectedEntity &&
      (cameraMode === "INSPECT" ||
        cameraMode === "EXPLODED" ||
        cameraMode === "FOCUS")
    ) {
      // Precision CAD Inspection Camera framed for 5-layer exploded separation
      const [x, y, z] = selectedEntity.position;
      const scale = selectedEntity.visualScale || 1.0;
      const camDist = 12.0 * Math.max(0.9, scale * 0.9);
      targetCamPos.current.set(
        x - camDist * 0.45,
        y + camDist * 0.7,
        z + camDist * 0.85
      );
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

  // Handle explicit Camera UI Actions (Zoom, Rotate, Top-down, Reset)
  useEffect(() => {
    if (!cameraAction || cameraAction.timestamp === lastActionTimestamp.current) {
      return;
    }
    lastActionTimestamp.current = cameraAction.timestamp;

    const { type } = cameraAction;
    const controls = controlsRef.current;
    if (!controls) return;

    const lookTarget = controls.target;
    const camOffset = new THREE.Vector3().subVectors(camera.position, lookTarget);

    if (type === "zoom_in") {
      // Zoom closer by 25%
      camOffset.multiplyScalar(0.75);
      if (camOffset.length() < 3) camOffset.setLength(3);
      targetCamPos.current.copy(lookTarget).add(camOffset);
    } else if (type === "zoom_out") {
      // Zoom out by 35%
      camOffset.multiplyScalar(1.35);
      if (camOffset.length() > 80) camOffset.setLength(80);
      targetCamPos.current.copy(lookTarget).add(camOffset);
    } else if (type === "rotate_left") {
      // Rotate 30 degrees counter-clockwise around target
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6);
      targetCamPos.current.copy(lookTarget).add(camOffset);
    } else if (type === "rotate_right") {
      // Rotate 30 degrees clockwise around target
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 6);
      targetCamPos.current.copy(lookTarget).add(camOffset);
    } else if (type === "top_down") {
      // Overhead top-down view
      targetCamPos.current.set(lookTarget.x, 48, lookTarget.z + 0.1);
    } else if (type === "reset") {
      // Reset to default 40-degree isometric view
      if (selectedEntity) {
        const [x, y, z] = selectedEntity.position;
        const scale = selectedEntity.visualScale || 1.0;
        const camDist = 12.0 * Math.max(0.9, scale * 0.9);
        targetCamPos.current.set(
          x - camDist * 0.45,
          y + camDist * 0.7,
          z + camDist * 0.85
        );
        targetLookAt.current.set(x + 1.2 * scale, y + 2.5 * scale, z);
      } else {
        const currentX = -130 + timelineProgress * 285;
        targetCamPos.current.set(currentX - 5, 23, 30);
        targetLookAt.current.set(currentX + 8, 0, 5);
      }
    }
  }, [cameraAction, camera, selectedEntity, timelineProgress]);

  useFrame((_, delta) => {
    const damping = isReducedMotion ? 40 : 6;

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
      enabled={isEntered}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going below motherboard
      minDistance={2}
      maxDistance={85}
      onStart={() => {
        isUserInteracting.current = true;
      }}
      onEnd={() => {
        isUserInteracting.current = false;
        // Sync targetCamPos with current camera position after user orbit
        targetCamPos.current.copy(camera.position);
      }}
    />
  );
}
