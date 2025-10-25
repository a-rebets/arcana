import { create } from "zustand";
import type { RootArtifactData } from "./types/artifacts";

interface ArtifactsStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;

  // [selectedIndex, totalCount]
  versionState: Record<string, [number, number]>;
  activeChart: RootArtifactData | null;
  downloadTriggered: boolean;

  syncVersionStates: (counts: Record<string, number>) => void;
  setSelectedVersion: (rootId: string, version: number) => void;
  setActiveChart: (data: RootArtifactData | null) => void;
  toggleDownload: () => void;
  reset: () => void;
}

export const useArtifactsStore = create<ArtifactsStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  versionState: {},
  activeChart: null,
  downloadTriggered: false,

  syncVersionStates: (counts) =>
    set((prevState) => {
      const newVersionState = { ...prevState.versionState };
      for (const [rootId, totalCount] of Object.entries(counts)) {
        const current = prevState.versionState[rootId];
        // Only update if new chain or new version added
        if (!current || current[1] !== totalCount) {
          newVersionState[rootId] = [totalCount - 1, totalCount];
        }
      }
      return { versionState: newVersionState };
    }),
  setSelectedVersion: (rootId, version) =>
    set((prevState) => {
      const current = prevState.versionState[rootId];
      if (!current) return prevState;

      // Handle negative indices (e.g., -1 for last item)
      const totalCount = current[1];
      const normalizedIndex = version < 0 ? totalCount + version : version;

      return {
        versionState: {
          ...prevState.versionState,
          [rootId]: [normalizedIndex, totalCount],
        },
      };
    }),
  setActiveChart: (data: RootArtifactData | null) => set({ activeChart: data }),
  toggleDownload: () =>
    set((state) => ({ downloadTriggered: !state.downloadTriggered })),
  reset: () =>
    set({ versionState: {}, activeChart: null, downloadTriggered: false }),
}));
