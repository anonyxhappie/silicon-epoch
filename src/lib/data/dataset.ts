import epochsData from "@/data/epochs.json";
import sourcesData from "@/data/sources.json";
import entitiesData from "@/data/entities.json";
import relationshipsData from "@/data/relationships.json";
import {
  DatasetPayload,
  Entity,
  Epoch,
  Relationship,
  Source,
} from "@/types/schema";

// Type-cast imported JSON data to Schema Types
export const EPOCHS: Epoch[] = epochsData as Epoch[];
export const SOURCES: Source[] = sourcesData as Source[];
export const ENTITIES: Entity[] = entitiesData as unknown as Entity[];
export const RELATIONSHIPS: Relationship[] = relationshipsData as Relationship[];

// Hash map indexes for O(1) retrieval
const entityMap = new Map<string, Entity>(
  ENTITIES.map((entity) => [entity.id, entity])
);

const epochMap = new Map<string, Epoch>(
  EPOCHS.map((epoch) => [epoch.id, epoch])
);

const sourceMap = new Map<string, Source>(
  SOURCES.map((source) => [source.id, source])
);

export function getFullDataset(): DatasetPayload {
  return {
    epochs: EPOCHS,
    entities: ENTITIES,
    relationships: RELATIONSHIPS,
    sources: SOURCES,
  };
}

export function getEntityById(id: string): Entity | undefined {
  return entityMap.get(id);
}

export function getEpochById(id: string): Epoch | undefined {
  return epochMap.get(id);
}

export function getSourceById(id: string): Source | undefined {
  return sourceMap.get(id);
}

export function getEntitiesByEpoch(epochId: string): Entity[] {
  return ENTITIES.filter((e) => e.epoch_id === epochId);
}

export interface LineageInfo {
  ancestors: Array<{ entity: Entity; relationship: Relationship }>;
  descendants: Array<{ entity: Entity; relationship: Relationship }>;
  related: Array<{ entity: Entity; relationship: Relationship }>;
}

export function getEntityLineage(entityId: string): LineageInfo {
  const ancestors: Array<{ entity: Entity; relationship: Relationship }> = [];
  const descendants: Array<{ entity: Entity; relationship: Relationship }> = [];
  const related: Array<{ entity: Entity; relationship: Relationship }> = [];

  for (const rel of RELATIONSHIPS) {
    if (rel.target === entityId) {
      const srcEntity = entityMap.get(rel.source);
      if (srcEntity) {
        ancestors.push({ entity: srcEntity, relationship: rel });
      }
    } else if (rel.source === entityId) {
      const tgtEntity = entityMap.get(rel.target);
      if (tgtEntity) {
        descendants.push({ entity: tgtEntity, relationship: rel });
      }
    }
  }

  return { ancestors, descendants, related };
}
