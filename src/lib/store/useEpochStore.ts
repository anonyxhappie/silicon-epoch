import { create } from "zustand";
import {
  CameraMode,
  Entity,
  EntityType,
  FilterState,
  AvailabilityType,
} from "@/types/schema";
import { getEntityById } from "@/lib/data/dataset";

export type CameraActionType =
  | "zoom_in"
  | "zoom_out"
  | "rotate_left"
  | "rotate_right"
  | "top_down"
  | "macro_overview"
  | "reset";

interface EpochStoreState {
  // Navigation & Landing
  isEntered: boolean;
  activeEpochId: string;
  timelineProgress: number; // 0.0 to 1.0

  // Selection & Camera
  selectedEntityId: string | null;
  hoveredEntityId: string | null;
  cameraMode: CameraMode;
  explodedProgress: number; // 0.0 to 1.0
  targetCameraPos: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
  cameraAction: { type: CameraActionType; timestamp: number } | null;

  // Modals & Panels
  isSearchOpen: boolean;
  isFilterOpen: boolean;
  isEvidenceOpen: boolean;
  activeEvidenceSourceId: string | null;
  isCompareModalOpen: boolean;

  // Comparison Dock
  compareEntityA: Entity | null;
  compareEntityB: Entity | null;

  // Filters
  filters: FilterState;

  // Preferences & System
  isReducedMotion: boolean;
  isAudioEnabled: boolean;

  // Actions
  enterEpoch: () => void;
  setTimelineProgress: (progress: number) => void;
  setActiveEpoch: (epochId: string) => void;
  selectEntity: (id: string | null) => void;
  hoverEntity: (id: string | null) => void;
  setCameraMode: (mode: CameraMode) => void;
  setExplodedProgress: (progress: number) => void;
  setCameraTarget: (
    pos: [number, number, number],
    lookAt: [number, number, number]
  ) => void;
  triggerCameraAction: (type: CameraActionType) => void;

  // Search & Filters
  setSearchOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setEvidenceOpen: (open: boolean, sourceId?: string | null) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;

  // Comparison
  stageForCompare: (entity: Entity) => void;
  removeFromCompare: (slot: "A" | "B") => void;
  clearCompare: () => void;
  setCompareModalOpen: (open: boolean) => void;

  // Preferences
  toggleReducedMotion: () => void;
  toggleAudio: () => void;
}

const initialFilters: FilterState = {
  epochs: [],
  entityTypes: [],
  modalities: [],
  availability: [],
  organizations: [],
  searchQuery: "",
};

export const useEpochStore = create<EpochStoreState>((set, get) => ({
  isEntered: false,
  activeEpochId: "epoch-agentic-frontier",
  timelineProgress: 1.0,

  selectedEntityId: null,
  hoveredEntityId: null,
  cameraMode: "OVERVIEW",
  explodedProgress: 0.0,
  targetCameraPos: null,
  targetLookAt: null,
  cameraAction: null,

  isSearchOpen: false,
  isFilterOpen: false,
  isEvidenceOpen: false,
  activeEvidenceSourceId: null,
  isCompareModalOpen: false,

  compareEntityA: null,
  compareEntityB: null,

  filters: initialFilters,

  isReducedMotion: false,
  isAudioEnabled: false,

  enterEpoch: () => {
    set({ isEntered: true, cameraMode: "TRAVEL" });
  },

  setTimelineProgress: (progress: number) => {
    set({ timelineProgress: Math.max(0, Math.min(1, progress)) });
  },

  setActiveEpoch: (epochId: string) => {
    set({ activeEpochId: epochId });
  },

  selectEntity: (id: string | null) => {
    if (id === null) {
      set({
        selectedEntityId: null,
        cameraMode: "TRAVEL",
        explodedProgress: 0.0,
      });
    } else {
      set({
        selectedEntityId: id,
        cameraMode: "INSPECT",
        explodedProgress: 0.25, // Start with subtle CAD reveal
      });
    }
  },

  hoverEntity: (id: string | null) => {
    set({ hoveredEntityId: id });
  },

  setCameraMode: (mode: CameraMode) => {
    set({ cameraMode: mode });
  },

  setExplodedProgress: (progress: number) => {
    set({
      explodedProgress: Math.max(0, Math.min(1, progress)),
      cameraMode: progress > 0.05 ? "EXPLODED" : "INSPECT",
    });
  },

  setCameraTarget: (
    pos: [number, number, number],
    lookAt: [number, number, number]
  ) => {
    set({ targetCameraPos: pos, targetLookAt: lookAt });
  },

  triggerCameraAction: (type: CameraActionType) => {
    set({ cameraAction: { type, timestamp: Date.now() } });
  },

  setSearchOpen: (open: boolean) => {
    set({ isSearchOpen: open });
  },

  setFilterOpen: (open: boolean) => {
    set({ isFilterOpen: open });
  },

  setEvidenceOpen: (open: boolean, sourceId: string | null = null) => {
    set({ isEvidenceOpen: open, activeEvidenceSourceId: sourceId });
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  stageForCompare: (entity: Entity) => {
    const { compareEntityA, compareEntityB } = get();
    if (!compareEntityA) {
      set({ compareEntityA: entity });
    } else if (!compareEntityB && compareEntityA.id !== entity.id) {
      set({ compareEntityB: entity, isCompareModalOpen: true });
    } else if (compareEntityA.id !== entity.id && compareEntityB?.id !== entity.id) {
      // Replace slot B
      set({ compareEntityB: entity, isCompareModalOpen: true });
    }
  },

  removeFromCompare: (slot: "A" | "B") => {
    if (slot === "A") {
      set((state) => ({
        compareEntityA: state.compareEntityB,
        compareEntityB: null,
      }));
    } else {
      set({ compareEntityB: null });
    }
  },

  clearCompare: () => {
    set({
      compareEntityA: null,
      compareEntityB: null,
      isCompareModalOpen: false,
    });
  },

  setCompareModalOpen: (open: boolean) => {
    set({ isCompareModalOpen: open });
  },

  toggleReducedMotion: () => {
    set((state) => ({ isReducedMotion: !state.isReducedMotion }));
  },

  toggleAudio: () => {
    set((state) => ({ isAudioEnabled: !state.isAudioEnabled }));
  },
}));
