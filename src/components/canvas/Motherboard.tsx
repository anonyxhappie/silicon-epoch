"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export function Motherboard() {
  // Generate instanced via matrix positions for authentic PCB via drill grids
  const viaMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const count = 400;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = -150 + Math.random() * 320;
      const z = -25 + Math.random() * 50;
      dummy.position.set(x, 0.05, z);
      dummy.scale.set(0.12, 0.04, 0.12);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }
    return matrices;
  }, []);

  return (
    <group>
      {/* 1. Main Matte Dark PCB Substrate */}
      <mesh position={[10, -0.2, 0]} receiveShadow>
        <boxGeometry args={[360, 0.4, 60]} />
        <meshStandardMaterial
          color="#06090E"
          roughness={0.88}
          metalness={0.15}
        />
      </mesh>

      {/* 2. Secondary Translucent Glass / Interposer Underlayer */}
      <mesh position={[10, 0.02, 0]}>
        <planeGeometry args={[350, 50]} />
        <meshStandardMaterial
          color="#0A101D"
          roughness={0.6}
          metalness={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 3. Outer Machined Aluminum Chamfer Frame */}
      <mesh position={[10, -0.15, -28]}>
        <boxGeometry args={[364, 0.5, 0.8]} />
        <meshStandardMaterial color="#162032" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[10, -0.15, 28]}>
        <boxGeometry args={[364, 0.5, 0.8]} />
        <meshStandardMaterial color="#162032" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-171, -0.15, 0]}>
        <boxGeometry args={[0.8, 0.5, 56.8]} />
        <meshStandardMaterial color="#162032" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[191, -0.15, 0]}>
        <boxGeometry args={[0.8, 0.5, 56.8]} />
        <meshStandardMaterial color="#162032" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 4. Fine Grid / Technical Silkscreen Lines */}
      <gridHelper
        args={[360, 180, "#152238", "#0B1320"]}
        position={[10, 0.03, 0]}
      />

      {/* 5. Gold / Copper Edge Bus Guard Traces */}
      <mesh position={[10, 0.04, -23]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[340, 0.15]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.9}
          emissive="#D4AF37"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[10, 0.04, 23]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[340, 0.15]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.9}
          emissive="#D4AF37"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* 6. Precision Gold Via Clusters */}
      <instancedMesh
        args={[undefined, undefined, viaMatrices.length]}
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial
          color="#C8963E"
          metalness={0.85}
          roughness={0.3}
          emissive="#FFB020"
          emissiveIntensity={0.1}
        />
        {viaMatrices.map((mat, idx) => (
          <primitive key={idx} object={{}} />
        ))}
      </instancedMesh>
    </group>
  );
}
