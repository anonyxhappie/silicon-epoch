import { Entity } from "@/types/schema";

/**
 * Calculates a non-linear visual scale factor for an entity.
 * Prevents modern trillion-parameter models from dwarfing historical breakthroughs,
 * while still communicating scale and significance.
 *
 * Bounds: [0.85, 2.20]
 */
export function calculateVisualScale(entity: Entity): number {
  let scale = 1.0;

  // 1. Parameter weight (logarithmic scaling)
  if (entity.parameters?.total_billion) {
    const params = entity.parameters.total_billion;
    // Log scale: 0.001B (1M) -> log = -3; 175B -> log = 2.24; 671B -> log = 2.82
    const logVal = Math.log10(Math.max(params, 0.0001));
    const normalizedParamScale = (logVal + 4) / 7.0; // roughly maps 0.0001B..1000B to 0..1
    scale += (normalizedParamScale - 0.5) * 0.4;
  }

  // 2. Base importance factor (from curated metadata: 0.8..1.0)
  if (entity.visual?.importance) {
    scale += (entity.visual.importance - 0.9) * 0.6;
  }

  // 3. Explicit scale factor override if defined
  if (entity.visual?.scale_factor) {
    scale *= entity.visual.scale_factor;
  }

  // 4. Entity type baseline adjustments
  switch (entity.type) {
    case "architecture":
      scale *= 1.15; // Architectures have layered importance
      break;
    case "hardware":
      scale *= 1.25; // Accelerators represent compute clusters
      break;
    case "algorithm":
      scale *= 1.05;
      break;
    case "paper":
      scale *= 0.95;
      break;
    default:
      break;
  }

  // Hard clamp boundaries
  const MIN_SCALE = 0.85;
  const MAX_SCALE = 2.2;
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
}
