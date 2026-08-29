"use client";

import React, { useRef, useMemo } from "react";
import { Text, Line, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Entity } from "@/types/schema";

interface ExplodedChip3DProps {
  entity: Entity;
  visualScale: number;
  explodedProgress: number; // 0.0 (assembled) to 1.0 (fully exploded)
}

export function ExplodedChip3D({
  entity,
  visualScale,
  explodedProgress,
}: ExplodedChip3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Smooth lerp animated progress
  const currentProgress = useRef(explodedProgress);
  useFrame((_, delta) => {
    currentProgress.current = THREE.MathUtils.damp(
      currentProgress.current,
      explodedProgress,
      8,
      delta
    );
  });

  const p = currentProgress.current;
  const size = 3.2 * visualScale;

  // Epoch theme accent color for technical markings
  const accentColor = useMemo(() => {
    if (entity.epoch_id === "epoch-agentic-frontier") return "#8B5CF6";
    if (entity.epoch_id === "epoch-foundation-models") return "#EC4899";
    if (entity.epoch_id === "epoch-transformer-era") return "#F59E0B";
    if (entity.epoch_id === "epoch-deep-learning-boom") return "#10B981";
    return "#00F0FF";
  }, [entity.epoch_id]);

  // Generate BGA solder balls array for Layer 1
  const bgaBalls = useMemo(() => {
    const balls: [number, number, number][] = [];
    const count = 6;
    const spacing = (size * 0.8) / (count - 1);
    const offset = (size * 0.8) / 2;

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        // Leave center cavity open for authentic BGA package
        if ((r === 2 || r === 3) && (c === 2 || c === 3)) continue;
        balls.push([r * spacing - offset, -0.15, c * spacing - offset]);
      }
    }
    return balls;
  }, [size]);

  // Wire bonds for Layer 4 silicon die
  const wireBonds = useMemo(() => {
    const bonds: [number, number, number][] = [];
    const dieW = size * 0.65;
    const padCount = 8;
    const spacing = dieW / (padCount - 1);
    const offset = dieW / 2;

    for (let i = 0; i < padCount; i++) {
      bonds.push([-offset + i * spacing, 0.08, -offset]);
      bonds.push([-offset + i * spacing, 0.08, offset]);
      bonds.push([-offset, 0.08, -offset + i * spacing]);
      bonds.push([offset, 0.08, -offset + i * spacing]);
    }
    return bonds;
  }, [size]);

  // Layer vertical separations
  const l1Y = 0.2;
  const l2Y = 0.5 + p * 1.5;
  const l3Y = 0.8 + p * 3.0;
  const l4Y = 1.1 + p * 4.6;
  const l5Y = 1.4 + p * 6.2;

  return (
    <group ref={groupRef}>
      {/* ─────────────────────────────────────────────────────────────
          LAYER 1: Base Organic BGA Carrier Substrate
          (Licensing, Openness, Distribution Interface)
      ───────────────────────────────────────────────────────────── */}
      <group position={[0, l1Y, 0]}>
        {/* Dark Matte PCB Carrier */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[size, 0.22, size]} />
          <meshStandardMaterial
            color="#0A1017"
            roughness={0.75}
            metalness={0.4}
          />
        </mesh>

        {/* Gold Ground Plane Perimeter Border */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size * 0.95, size * 0.95]} />
          <meshStandardMaterial
            color="#141E2D"
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>

        {/* Pin 1 Gold Index Triangle */}
        <mesh
          position={[-size * 0.42, 0.13, -size * 0.42]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.14, 3]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* 3D Golden BGA Solder Balls */}
        {bgaBalls.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
        ))}

        {/* CAD Callout Pin */}
        {p > 0.15 && (
          <group position={[size * 0.6, 0, 0]}>
            <Line
              points={[
                [0, 0, 0],
                [0.8, 0.15, 0],
                [2.2, 0.15, 0],
              ]}
              color="#D4AF37"
              lineWidth={1.5}
            />
            <Billboard position={[2.3, 0.15, 0]}>
              <group>
                <mesh position={[1.4, 0, -0.02]}>
                  <planeGeometry args={[3.2, 0.65]} />
                  <meshBasicMaterial color="#0A0E17" transparent opacity={0.85} />
                </mesh>
                <Text
                  position={[0.1, 0.12, 0]}
                  fontSize={0.22}
                  color="#D4AF37"
                  anchorX="left"
                  anchorY="middle"
                >
                  {`L1: BGA CARRIER`}
                </Text>
                <Text
                  position={[0.1, -0.12, 0]}
                  fontSize={0.16}
                  color="#94A3B8"
                  anchorX="left"
                  anchorY="middle"
                >
                  {`Status: ${entity.availability?.toUpperCase() || "API"} (${entity.license || "Proprietary"})`}
                </Text>
              </group>
            </Billboard>
          </group>
        )}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 2: Silicon Interposer & Power Delivery Grid
          (Compute Infrastructure & Power Rails)
      ───────────────────────────────────────────────────────────── */}
      <group position={[0, l2Y, 0]}>
        {/* Silicon Interposer Die */}
        <mesh castShadow>
          <boxGeometry args={[size * 0.9, 0.14, size * 0.9]} />
          <meshStandardMaterial
            color="#131B26"
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>

        {/* Copper Power Bus Traces */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size * 0.82, size * 0.82]} />
          <meshStandardMaterial
            color="#223048"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>

        {/* Micro SMD Capacitors Array */}
        {[-1, 1].map((cx) =>
          [-1, 1].map((cz) => (
            <mesh
              key={`cap-${cx}-${cz}`}
              position={[cx * (size * 0.38), 0.1, cz * (size * 0.38)]}
            >
              <boxGeometry args={[0.2, 0.08, 0.12]} />
              <meshStandardMaterial
                color="#C87D55"
                metalness={0.9}
                roughness={0.3}
              />
            </mesh>
          ))
        )}

        {p > 0.15 && (
          <group position={[-size * 0.6, 0, 0]}>
            <Line
              points={[
                [0, 0, 0],
                [-0.8, 0.15, 0],
                [-2.2, 0.15, 0],
              ]}
              color="#10B981"
              lineWidth={1.5}
            />
            <Billboard position={[-2.3, 0.15, 0]}>
              <group>
                <mesh position={[-1.4, 0, -0.02]}>
                  <planeGeometry args={[3.2, 0.65]} />
                  <meshBasicMaterial color="#0A0E17" transparent opacity={0.85} />
                </mesh>
                <Text
                  position={[-0.1, 0.12, 0]}
                  fontSize={0.22}
                  color="#10B981"
                  anchorX="right"
                  anchorY="middle"
                >
                  {`L2: SILICON INTERPOSER`}
                </Text>
                <Text
                  position={[-0.1, -0.12, 0]}
                  fontSize={0.16}
                  color="#94A3B8"
                  anchorX="right"
                  anchorY="middle"
                >
                  {`Hardware Infrastructure`}
                </Text>
              </group>
            </Billboard>
          </group>
        )}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 3: Modality & HBM3e Memory Subsystem
          (High-Bandwidth Memory Stacks & KV Cache Bus)
      ───────────────────────────────────────────────────────────── */}
      <group position={[0, l3Y, 0]}>
        {/* Interposer Bridge Plate */}
        <mesh castShadow>
          <boxGeometry args={[size * 0.8, 0.1, size * 0.8]} />
          <meshStandardMaterial
            color="#0D141F"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>

        {/* 4 Physical 3D HBM Memory Chiplet Dies */}
        {[-1, 1].map((rx) =>
          [-1, 1].map((rz) => (
            <group
              key={`hbm-${rx}-${rz}`}
              position={[rx * (size * 0.26), 0.12, rz * (size * 0.26)]}
            >
              {/* Stacked HBM Die */}
              <mesh castShadow>
                <boxGeometry args={[size * 0.22, 0.16, size * 0.22]} />
                <meshStandardMaterial
                  color="#1E2838"
                  roughness={0.2}
                  metalness={0.92}
                />
              </mesh>
              {/* Metallic Micro-Cap */}
              <mesh position={[0, 0.09, 0]}>
                <boxGeometry args={[size * 0.19, 0.02, size * 0.19]} />
                <meshStandardMaterial
                  color="#38BDF8"
                  metalness={0.95}
                  roughness={0.15}
                />
              </mesh>
            </group>
          ))
        )}

        {p > 0.15 && (
          <group position={[size * 0.6, 0, 0]}>
            <Line
              points={[
                [0, 0, 0],
                [0.8, 0.15, 0],
                [2.2, 0.15, 0],
              ]}
              color="#00F0FF"
              lineWidth={1.5}
            />
            <Billboard position={[2.3, 0.15, 0]}>
              <group>
                <mesh position={[1.4, 0, -0.02]}>
                  <planeGeometry args={[3.2, 0.65]} />
                  <meshBasicMaterial color="#0A0E17" transparent opacity={0.85} />
                </mesh>
                <Text
                  position={[0.1, 0.12, 0]}
                  fontSize={0.22}
                  color="#00F0FF"
                  anchorX="left"
                  anchorY="middle"
                >
                  {`L3: MODALITY & HBM`}
                </Text>
                <Text
                  position={[0.1, -0.12, 0]}
                  fontSize={0.16}
                  color="#94A3B8"
                  anchorX="left"
                  anchorY="middle"
                >
                  {`[${(entity.modalities || ["TEXT"]).join(", ").toUpperCase()}]`}
                </Text>
              </group>
            </Billboard>
          </group>
        )}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 4: Neural Architecture & Silicon Core Die
          (Transformer Engine, Attention Matrix, Parameters)
      ───────────────────────────────────────────────────────────── */}
      <group position={[0, l4Y, 0]}>
        {/* High-Gloss Silicon Substrate Die */}
        <mesh castShadow>
          <boxGeometry args={[size * 0.68, 0.16, size * 0.68]} />
          <meshStandardMaterial
            color="#0C101A"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        {/* Center Logic Core Inset */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[size * 0.46, 0.02, size * 0.46]} />
          <meshStandardMaterial
            color="#1C2436"
            roughness={0.18}
            metalness={0.92}
          />
        </mesh>

        {/* Gold Wire Bond Pads Array */}
        {wireBonds.map((pos, i) => (
          <mesh key={`wire-${i}`} position={pos}>
            <boxGeometry args={[0.06, 0.02, 0.06]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.98}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* Die Laser Engraving */}
        <Text
          position={[0, 0.11, -size * 0.05]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.18 * visualScale}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          maxWidth={size * 0.42}
        >
          {entity.architecture?.type || "NEURAL ARCHITECTURE"}
        </Text>
        <Text
          position={[0, 0.11, size * 0.12]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.13 * visualScale}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
        >
          {entity.parameters?.total_billion !== null &&
          entity.parameters?.total_billion !== undefined
            ? `${entity.parameters.total_billion}B Parameters`
            : "Proprietary Parameter Scale"}
        </Text>

        {p > 0.15 && (
          <group position={[-size * 0.6, 0, 0]}>
            <Line
              points={[
                [0, 0, 0],
                [-0.8, 0.15, 0],
                [-2.2, 0.15, 0],
              ]}
              color={accentColor}
              lineWidth={1.5}
            />
            <Billboard position={[-2.3, 0.15, 0]}>
              <group>
                <mesh position={[-1.4, 0, -0.02]}>
                  <planeGeometry args={[3.2, 0.65]} />
                  <meshBasicMaterial color="#0A0E17" transparent opacity={0.85} />
                </mesh>
                <Text
                  position={[-0.1, 0.12, 0]}
                  fontSize={0.22}
                  color={accentColor}
                  anchorX="right"
                  anchorY="middle"
                >
                  {`L4: NEURAL CORE DIE`}
                </Text>
                <Text
                  position={[-0.1, -0.12, 0]}
                  fontSize={0.16}
                  color="#94A3B8"
                  anchorX="right"
                  anchorY="middle"
                >
                  {entity.parameters?.total_billion
                    ? `${entity.parameters.total_billion}B Active Params`
                    : "Architecture Core"}
                </Text>
              </group>
            </Billboard>
          </group>
        )}
      </group>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 5: Top Brushed Anodized Heat Spreader (IHS)
          (Identity, Organization, Release Year, Laser Etch)
      ───────────────────────────────────────────────────────────── */}
      <group position={[0, l5Y, 0]}>
        {/* Dark Brushed Nickel / Gunmetal Lid */}
        <mesh castShadow>
          <boxGeometry args={[size * 0.82, 0.18, size * 0.82]} />
          <meshStandardMaterial
            color="#1B2332"
            metalness={0.92}
            roughness={0.25}
          />
        </mesh>

        {/* Recessed Top Center Badge */}
        <mesh position={[0, 0.095, 0]}>
          <boxGeometry args={[size * 0.74, 0.01, size * 0.74]} />
          <meshStandardMaterial
            color="#222D3E"
            metalness={0.88}
            roughness={0.22}
          />
        </mesh>

        {/* Copper Bevel Edge Trim */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[size * 0.83, 0.03, size * 0.83]} />
          <meshStandardMaterial
            color="#C87D55"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>

        {/* High-Contrast Laser Etched Identity */}
        <group position={[0, 0.11, 0]}>
          <Text
            position={[0, 0, -size * 0.16]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.24 * visualScale}
            color="#F8FAFC"
            anchorX="center"
            anchorY="middle"
            maxWidth={size * 0.7}
          >
            {entity.name}
          </Text>
          <Text
            position={[0, 0, size * 0.12]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.14 * visualScale}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
          >
            {entity.creator_name || entity.creator} • {entity.release_date}
          </Text>
          <Text
            position={[0, 0, size * 0.25]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.11 * visualScale}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {entity.category.toUpperCase()}
          </Text>
        </group>

        {/* Corner Alignment Crosshair Marks */}
        {[-1, 1].map((cx) =>
          [-1, 1].map((cz) => (
            <mesh
              key={`cross-${cx}-${cz}`}
              position={[cx * (size * 0.34), 0.105, cz * (size * 0.34)]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.03, 0.05, 16]} />
              <meshBasicMaterial color="#64748B" />
            </mesh>
          ))
        )}

        {p > 0.15 && (
          <group position={[size * 0.6, 0, 0]}>
            <Line
              points={[
                [0, 0, 0],
                [0.8, 0.15, 0],
                [2.2, 0.15, 0],
              ]}
              color="#F8FAFC"
              lineWidth={1.5}
            />
            <Billboard position={[2.3, 0.15, 0]}>
              <group>
                <mesh position={[1.4, 0, -0.02]}>
                  <planeGeometry args={[3.2, 0.65]} />
                  <meshBasicMaterial color="#0A0E17" transparent opacity={0.85} />
                </mesh>
                <Text
                  position={[0.1, 0.12, 0]}
                  fontSize={0.22}
                  color="#F8FAFC"
                  anchorX="left"
                  anchorY="middle"
                >
                  {`L5: INTEGRATED HEAT SPREADER`}
                </Text>
                <Text
                  position={[0.1, -0.12, 0]}
                  fontSize={0.16}
                  color="#94A3B8"
                  anchorX="left"
                  anchorY="middle"
                >
                  {`Identity & Thermal Package`}
                </Text>
              </group>
            </Billboard>
          </group>
        )}
      </group>
    </group>
  );
}
