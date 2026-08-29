import { getFullDataset, getEntityLineage } from "./dataset";
import { getPlacedEntities } from "../layout/timelineLayout";

export function validateDataset() {
  const { epochs, entities, relationships, sources } = getFullDataset();

  const errors: string[] = [];
  const warnings: string[] = [];

  const entityIds = new Set(entities.map((e) => e.id));
  const sourceIds = new Set(sources.map((s) => s.id));
  const epochIds = new Set(epochs.map((ep) => ep.id));

  // 1. Verify Entities
  entities.forEach((entity) => {
    if (!epochIds.has(entity.epoch_id)) {
      errors.push(`Entity "${entity.id}" references unknown epoch "${entity.epoch_id}"`);
    }
    entity.sources.forEach((sId) => {
      if (!sourceIds.has(sId)) {
        errors.push(`Entity "${entity.id}" references unknown source "${sId}"`);
      }
    });
  });

  // 2. Verify Relationships
  relationships.forEach((rel) => {
    if (!entityIds.has(rel.source)) {
      errors.push(`Relationship "${rel.id}" references missing source entity "${rel.source}"`);
    }
    if (!entityIds.has(rel.target)) {
      errors.push(`Relationship "${rel.id}" references missing target entity "${rel.target}"`);
    }
    rel.sources.forEach((sId) => {
      if (!sourceIds.has(sId)) {
        warnings.push(`Relationship "${rel.id}" references source "${sId}" not in sources.json`);
      }
    });
  });

  // 3. Verify Spatial Placements
  const placed = getPlacedEntities(entities);
  if (placed.length !== entities.length) {
    errors.push(`Placed entities count (${placed.length}) does not match entities count (${entities.length})`);
  }

  placed.forEach((p) => {
    const [x, y, z] = p.position;
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      errors.push(`Entity "${p.id}" has invalid NaN coordinates: [${x}, ${y}, ${z}]`);
    }
    if (p.visualScale < 0.5 || p.visualScale > 3.0) {
      warnings.push(`Entity "${p.id}" visualScale ${p.visualScale} is outside typical range [0.5, 3.0]`);
    }
  });

  console.log(`[DATASET VALIDATION SUMMARY]`);
  console.log(`Epochs: ${epochs.length}`);
  console.log(`Entities: ${entities.length}`);
  console.log(`Relationships: ${relationships.length}`);
  console.log(`Sources: ${sources.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.error(`Errors found:`, errors);
    throw new Error(`Dataset validation failed with ${errors.length} errors.`);
  } else {
    console.log(`✅ All dataset validation integrity checks passed!`);
  }

  return { success: true, entitiesCount: entities.length, relationshipsCount: relationships.length };
}

// Run if executed directly
if (typeof window === "undefined") {
  validateDataset();
}
