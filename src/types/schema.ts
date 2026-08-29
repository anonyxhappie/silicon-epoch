export type EntityType =
  | "concept"
  | "paper"
  | "algorithm"
  | "architecture"
  | "model"
  | "model_family"
  | "dataset"
  | "benchmark"
  | "hardware"
  | "software"
  | "organization"
  | "product"
  | "event"
  | "person";

export type RelationshipType =
  | "influenced"
  | "introduced"
  | "derived_from"
  | "successor_to"
  | "predecessor_of"
  | "variant_of"
  | "trained_on"
  | "evaluated_on"
  | "implemented_by"
  | "developed_by"
  | "released_by"
  | "requires"
  | "accelerated_by"
  | "used_in"
  | "commercialized_as"
  | "related_to";

export type AvailabilityType =
  | "open_source"
  | "open_weights"
  | "closed_api"
  | "research_preview"
  | "hardware_device";

export type VisualTier = "tier_s" | "tier_a" | "tier_b" | "tier_c";

export interface BenchmarkScore {
  benchmark_id: string;
  benchmark_name: string;
  score: number;
  unit: string;
  setting?: string;
  source?: string;
}

export interface PricingModel {
  currency: string;
  unit: string;
  input: number;
  output: number;
  effective_date: string;
  source?: string;
}

export interface ArchitectureSpec {
  type: string;
  subtype?: string;
  publicly_disclosed: boolean;
  notes?: string;
}

export interface ParametersSpec {
  total_billion: number | null;
  active_billion: number | null;
  notes?: string;
}

export interface ContextWindowSpec {
  value: number | null;
  unit: string;
}

export interface VisualSpec {
  entity_shape?:
    | "model_chip"
    | "paper_wafer"
    | "hardware_module"
    | "algorithm_package"
    | "dataset_memory"
    | "abstract_die";
  importance: number; // 0.1 to 1.0
  tier?: VisualTier;
  scale_factor?: number;
  elevation?: number;
  custom_color?: string;
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  aliases?: string[];
  creator: string;
  creator_name?: string;
  release_date: string; // ISO format: YYYY-MM-DD or YYYY
  epoch_id: string;
  category: string;
  model_family?: string;
  tier?: VisualTier;
  architecture?: ArchitectureSpec;
  parameters?: ParametersSpec;
  context_window?: ContextWindowSpec;
  benchmarks?: BenchmarkScore[];
  pricing?: PricingModel[];
  modalities?: string[];
  license?: string | null;
  availability?: AvailabilityType;
  summary: string;
  description?: string;
  key_innovations?: string[];
  known_limitations?: string[];
  visual: VisualSpec;
  sources: string[];
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  directional: boolean;
  confidence: "high" | "medium" | "low";
  sources: string[];
  description?: string;
}

export interface Epoch {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  start_year: number;
  end_year: number;
  description: string;
  theme_color: string;
  order: number;
  focus_milestone?: string;
}

export type SourceAuthority = "primary" | "secondary" | "official";
export type SourceType =
  | "research_paper"
  | "technical_report"
  | "official_announcement"
  | "model_card"
  | "benchmark_paper"
  | "academic_publication"
  | "repository"
  | "documentation"
  | "article";

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  url?: string;
  publisher?: string;
  published_date?: string;
  retrieved_at?: string;
  authority: SourceAuthority;
  notes?: string;
}

export interface DatasetPayload {
  epochs: Epoch[];
  entities: Entity[];
  relationships: Relationship[];
  sources: Source[];
  visual_config?: Record<string, unknown>;
}

export interface PlacedEntity extends Entity {
  position: [number, number, number];
  visualScale: number;
  visualLane: number;
  laneName: string;
}

export type CameraMode =
  | "OVERVIEW"
  | "TRAVEL"
  | "FOCUS"
  | "INSPECT"
  | "EXPLODED"
  | "COMPARE"
  | "RETURN";

export interface FilterState {
  epochs: string[];
  entityTypes: EntityType[];
  modalities: string[];
  availability: AvailabilityType[];
  organizations: string[];
  searchQuery: string;
}

export interface ComparePair {
  entityA: Entity | null;
  entityB: Entity | null;
}
