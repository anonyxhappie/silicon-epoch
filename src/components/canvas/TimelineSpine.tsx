"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { dateToTimelineX } from "@/lib/layout/timelineLayout";

const MILESTONE_YEARS = [
  1950, 1960, 1970, 1980, 1990, 1998, 2006, 2012, 2017, 2020, 2022, 2024, 2026,
];

export function TimelineSpine() {
  const pulseRef1 = useRef<THREE.Mesh>(null);
  const pulseRef2 = useRef<THREE.Mesh>(null);
  const pulseRef3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseRef1.current) {
      const x = -130 + ((t * 22) % 290);
      pulseRef1.current.position.x = x;
    }
    if (pulseRef2.current) {
      const x = -130 + (((t + 4) * 22) % 290);
      pulseRef2.current.position.x = x;
    }
    if (pulseRef3.current) {
      const x = -130 + (((t + 8) * 22) % 290);
      pulseRef3.current.position.x = x;
    }
  });

  return (
    <group position={[0, 0.05, 0]}>
      {/* 1. Main Gold/Copper Central Bus Lines */}
      <mesh position={[10, 0, -0.35]}>
        <boxGeometry args={[340, 0.06, 0.2]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[10, 0, 0.35]}>
        <boxGeometry args={[340, 0.06, 0.2]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Center Channel Glow */}
      <mesh position={[10, -0.01, 0]}>
        <planeGeometry args={[340, 0.6]} />
        <meshBasicMaterial color="#006688" transparent opacity={0.4} />
      </mesh>

      {/* 3. Traveling Energy Pulses */}
      <mesh ref={pulseRef1} position={[-130, 0.06, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh ref={pulseRef2} position={[-130, 0.06, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      <mesh ref={pulseRef3} position={[-130, 0.06, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* 4. Year Milestone Ticks & 3D Silkscreen Numbers */}
      {MILESTONE_YEARS.map((year) => {
        const posX = dateToTimelineX(`${year}-01-01`);
        return (
          <group key={year} position={[posX, 0.04, 0]}>
            {/* Cross tick bar */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.15, 0.06, 2.4]} />
              <meshStandardMaterial
                color="#00F0FF"
                emissive="#00F0FF"
                emissiveIntensity={0.4}
                metalness={0.8}
              />
            </mesh>

            {/* Year Label */}
            <Text
              position={[0, 0.05, -1.8]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.9}
              color="#5486B8"
              anchorX="center"
              anchorY="middle"
            >
              {year.toString()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
