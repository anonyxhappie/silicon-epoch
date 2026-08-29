"use client";

import { useEffect, useRef, useCallback } from "react";
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
      // Deselected: return to timeline glide position without forcing angle
      prevSelectedId.current = null;
      const currentX = -130 + timelineProgress * 285;
      if (controlsRef.current) {
        const currentTarget = controlsRef.current.target;
        const currentCam = camera.position;
        const deltaX = currentX - currentTarget.x;

        const newCam = new THREE.Vector3(
          currentCam.x + deltaX,
          Math.max(currentCam.y, 18),
          currentCam.z
        );
        const newLook = new THREE.Vector3(currentX, 0, 0);
        triggerTransition(newCam, newLook);
      }
    }
  }, [selectedEntityId, selectedEntity, isEntered, timelineProgress, triggerTransition, camera]);

  // 3. Timeline scrubbing (glides smoothly along X while preserving user's custom zoom/angle)
  useEffect(() => {
    if (!isEntered || selectedEntityId) return;

    if (Math.abs(timelineProgress - prevTimelineProgress.current) > 0.001) {
      const prevX = -130 + prevTimelineProgress.current * 285;
      const nextX = -130 + timelineProgress * 285;
      const deltaX = nextX - prevX;
      prevTimelineProgress.current = timelineProgress;

      // Translate camera and target by deltaX
      if (controlsRef.current) {
        const currentTarget = controlsRef.current.target;
        targetLookAt.current.set(currentTarget.x + deltaX, currentTarget.y, currentTarget.z);
        targetCamPos.current.set(
          camera.position.x + deltaX,
          camera.position.y,
          camera.position.z
        );
        isTransitioning.current = true;
      }

      // Update active epoch
      const currentYear = xToTimelineYear(nextX);
      const activeEpoch = EPOCHS.find(
        (ep) => currentYear >= ep.start_year && currentYear <= ep.end_year
      );
      if (activeEpoch) {
        setActiveEpoch(activeEpoch.id);
      }
    }
  }, [timelineProgress, isEntered, selectedEntityId, setActiveEpoch, camera]);

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
        setTimelineProgress(Math.min(1.0, timelineProgress + 0.025));
      } else if (e.key === "ArrowLeft" || e.key === "KeyA") {
        setTimelineProgress(Math.max(0.0, timelineProgress - 0.025));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEntered, timelineProgress, setTimelineProgress]);

  // 5. Camera Control Widget Actions (Zoom, Rotate, Top-down, Reset)
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
      if (camOffset.length() < 3) camOffset.setLength(3);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "zoom_out") {
      camOffset.multiplyScalar(1.4);
      if (camOffset.length() > 90) camOffset.setLength(90);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "rotate_left") {
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "rotate_right") {
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 6);
      triggerTransition(lookTarget.clone().add(camOffset), lookTarget);
    } else if (type === "top_down") {
      const topPos = new THREE.Vector3(lookTarget.x, 50, lookTarget.z + 0.01);
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
        const currentX = -130 + timelineProgress * 285;
        const defaultCam = new THREE.Vector3(currentX - 5, 25, 32);
        const defaultLook = new THREE.Vector3(currentX + 8, 0, 5);
        triggerTransition(defaultCam, defaultLook);
      }
    }
  }, [cameraAction, camera, selectedEntity, timelineProgress, triggerTransition]);

  // 6. Smooth Frame Interpolation ONLY when transitioning programmatically
  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    const damping = isReducedMotion ? 40 : 8;
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
      minDistance={1.5}
      maxDistance={95}
      onStart={() => {
        // User interacted! Immediately cease any automatic animation so user has 100% control
        isTransitioning.current = false;
      }}
    />
  );
}
