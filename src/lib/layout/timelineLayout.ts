import { Entity, EntityType, Epoch, PlacedEntity } from "@/types/schema";
import { calculateVisualScale } from "./visualScale";

// Piecewise linear interpolation for temporal mapping with density-aware expansion
interface TimelineKnot {
  year: number;
  x: number;
}

const TIMELINE_KNOTS: TimelineKnot[] = [
  { year: 1940, x: -140 },
  { year: 1960, x: -105 },
  { year: 1980, x: -75 },
  { year: 2000, x: -45 },
  { year: 2012, x: -15 },
  { year: 2017, x: 20 },
  { year: 2020, x: 50 },
  { year: 2022, x: 80 },
  { year: 2024, x: 110 },
  { year: 2025, x: 135 },
  { year: 2026.0, x: 145 },
  { year: 2026.5, x: 162 },
  { year: 2026.75, x: 180 },
];

/**
 * Converts an ISO date or Year string into a 3D X coordinate.
 */
export function dateToTimelineX(dateStr: string): number {
  let decimalYear = 2020;
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parts[1] ? parseInt(parts[1], 10) - 1 : 0;
    const day = parts[2] ? parseInt(parts[2], 10) : 1;
    decimalYear = year + month / 12 + day / 365;
  } else {
    decimalYear = parseFloat(dateStr) || 2020;
  }

  // Find surrounding knots
  if (decimalYear <= TIMELINE_KNOTS[0].year) {
    return TIMELINE_KNOTS[0].x;
  }
  if (decimalYear >= TIMELINE_KNOTS[TIMELINE_KNOTS.length - 1].year) {
    return TIMELINE_KNOTS[TIMELINE_KNOTS.length - 1].x;
  }

  for (let i = 0; i < TIMELINE_KNOTS.length - 1; i++) {
    const k1 = TIMELINE_KNOTS[i];
    const k2 = TIMELINE_KNOTS[i + 1];
    if (decimalYear >= k1.year && decimalYear <= k2.year) {
      const alpha = (decimalYear - k1.year) / (k2.year - k1.year);
      return k1.x + alpha * (k2.x - k1.x);
    }
  }

  return 0;
}

/**
 * Converts timeline X coordinate back to year.
 */
export function xToTimelineYear(x: number): number {
  if (x <= TIMELINE_KNOTS[0].x) return TIMELINE_KNOTS[0].year;
  if (x >= TIMELINE_KNOTS[TIMELINE_KNOTS.length - 1].x) {
    return TIMELINE_KNOTS[TIMELINE_KNOTS.length - 1].year;
  }

  for (let i = 0; i < TIMELINE_KNOTS.length - 1; i++) {
    const k1 = TIMELINE_KNOTS[i];
    const k2 = TIMELINE_KNOTS[i + 1];
    if (x >= k1.x && x <= k2.x) {
      const alpha = (x - k1.x) / (k2.x - k1.x);
      return k1.year + alpha * (k2.year - k1.year);
    }
  }
  return 2026;
}

export const LANE_CONFIG = {
  foundations: { z: -17, lane: -2, laneName: "Foundations & Papers" },
  architectures: { z: -8, lane: -1, laneName: "Architectures & Efficient LLMs" },
  models: { z: 8, lane: 1, laneName: "Frontier Flagships & Agents" },
  hardware: { z: 17, lane: 2, laneName: "Hardware & Compute Systems" },
  multimodal_media: { z: 23, lane: 3, laneName: "Vision, Audio & Realtime" },
};

/**
 * Maps entity category, type, and modalities to a balanced secondary Z lane.
 */
export function getEntityLane(
  type: EntityType,
  category: string,
  modalities: string[] = []
): { z: number; lane: number; laneName: string } {
  if (type === "hardware" || category.includes("Hardware") || category.includes("Compute")) {
    return LANE_CONFIG.hardware;
  }
  if (type === "paper" || category.includes("Theoretical")) {
    return LANE_CONFIG.foundations;
  }
  if (
    category.includes("Speed") ||
    category.includes("Edge") ||
    category.includes("Efficient") ||
    type === "algorithm" ||
    type === "architecture"
  ) {
    return LANE_CONFIG.architectures;
  }
  if (
    category.includes("Image") ||
    category.includes("Video") ||
    category.includes("Audio") ||
    category.includes("Speech") ||
    category.includes("Realtime") ||
    category.includes("Synthesis") ||
    modalities.includes("audio") ||
    modalities.includes("video")
  ) {
    return LANE_CONFIG.multimodal_media;
  }
  return LANE_CONFIG.models;
}

/**
 * Computes deterministic 3D positions for all entities,
 * applying collision avoidance offsets for crowded clusters.
 */
export function getPlacedEntities(entities: Entity[]): PlacedEntity[] {
  const placed: PlacedEntity[] = [];
  const spatialOccupancy: Array<{ x: number; z: number; radius: number }> = [];

  for (const entity of entities) {
    const baseX = dateToTimelineX(entity.release_date);
    const lane = getEntityLane(entity.type, entity.category, entity.modalities);
    const scale = calculateVisualScale(entity);
    const radius = scale * 2.8;

    let posX = baseX;
    let posZ = lane.z;

    // Collision avoidance loop
    let attempts = 0;
    while (attempts < 30) {
      // Ensure posZ never enters the central timeline spine corridor [-4.5, 4.5]
      if (Math.abs(posZ) < 4.5) {
        posZ = posZ >= 0 ? 6.5 : -6.5;
      }

      const collision = spatialOccupancy.find((occ) => {
        const dx = occ.x - posX;
        const dz = occ.z - posZ;
        const dist = Math.sqrt(dx * dx + dz * dz);
        return dist < occ.radius + radius;
      });

      if (!collision) {
        break;
      }

      // Nudge cleanly in Z or X alternatively
      if (attempts % 2 === 0) {
        posZ += (attempts % 4 === 0 ? 1 : -1) * 3.8;
      } else {
        posX += (attempts % 4 === 1 ? 1 : -1) * 4.2;
      }
      attempts++;
    }

    // Final guard against central spine overlap
    if (Math.abs(posZ) < 4.5) {
      posZ = posZ >= 0 ? 6.5 : -6.5;
    }

    spatialOccupancy.push({ x: posX, z: posZ, radius });

    const posY = 0.25 + (entity.visual.elevation || 0);

    placed.push({
      ...entity,
      position: [posX, posY, posZ],
      visualScale: scale,
      visualLane: lane.lane,
      laneName: lane.laneName,
    });
  }

  return placed;
}

export interface EpochBounds extends Epoch {
  startX: number;
  endX: number;
  centerX: number;
  width: number;
}

export function getEpochBounds(epochs: Epoch[]): EpochBounds[] {
  return epochs.map((epoch) => {
    const startX = dateToTimelineX(`${epoch.start_year}-01-01`);
    const endX = dateToTimelineX(`${epoch.end_year}-12-31`);
    return {
      ...epoch,
      startX,
      endX,
      centerX: (startX + endX) / 2,
      width: Math.abs(endX - startX),
    };
  });
}
