import { create } from "zustand";

interface ArtifactsStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;

  // [selectedIndex, totalCount]
  versionState: Record<string, [number, number]>;
  activeChart: string | null;

  syncVersionStates: (counts: Record<string, number>) => void;
  setSelectedIndex: (rootId: string, index: number) => void;
  setActiveChart: (rootId: string | null) => void;
  reset: () => void;
}

export const useArtifactsStore = create<ArtifactsStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  versionState: {},
  activeChart: null,

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
  setSelectedIndex: (rootId, index) =>
    set((prevState) => {
      const current = prevState.versionState[rootId];
      if (!current) return prevState;
      return {
        versionState: {
          ...prevState.versionState,
          [rootId]: [index, current[1]],
        },
      };
    }),
  setActiveChart: (rootId) => set({ activeChart: rootId }),
  reset: () => set({ versionState: {}, activeChart: null }),
}));
