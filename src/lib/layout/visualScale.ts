import { Entity } from "@/types/schema";

/**
 * Calculates a non-linear visual scale factor for an entity based on its visual tier,
 * parameter count, and structural significance.
 *
 * Tier S: Hero scale (1.55 - 2.20)
 * Tier A: Standard scale (1.20 - 1.50)
 * Tier B: Compact media module scale (0.90 - 1.15)
 * Tier C: Micro SMD component scale (0.70 - 0.85)
 */
export function calculateVisualScale(entity: Entity): number {
  let baseScale = 1.0;

  // 1. Tier-based visual prominence baseline
  const tier = entity.tier || (entity.visual?.importance && entity.visual.importance >= 0.96 ? "tier_s" : "tier_a");
  switch (tier) {
    case "tier_s":
      baseScale = 1.6;
      break;
    case "tier_a":
      baseScale = 1.25;
      break;
    case "tier_b":
      baseScale = 0.95;
      break;
    case "tier_c":
      baseScale = 0.75;
      break;
    default:
      baseScale = 1.0;
  }

  let scale = baseScale;

  // 2. Parameter weight (logarithmic scaling)
  if (entity.parameters?.total_billion) {
    const params = entity.parameters.total_billion;
    const logVal = Math.log10(Math.max(params, 0.0001));
    const normalizedParamScale = (logVal + 4) / 7.0;
    scale += (normalizedParamScale - 0.5) * 0.25;
  }

  // 3. Explicit scale factor override if defined
  if (entity.visual?.scale_factor) {
    scale = (scale + entity.visual.scale_factor) / 2;
  }

  // 4. Entity type baseline adjustments
  if (entity.type === "hardware") {
    scale *= 1.15;
  } else if (entity.type === "architecture") {
    scale *= 1.1;
  }

  // Hard clamp boundaries
  const MIN_SCALE = 0.65;
  const MAX_SCALE = 2.4;
  return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
}
