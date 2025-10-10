import { useShallow } from "zustand/shallow";
import { useArtifactsStore } from "@/lib/artifacts-store";

export const useArtifactsPanelState = () =>
  useArtifactsStore((state) => state.isOpen);

export const useArtifactsPanelActions = () =>
  useArtifactsStore(
    useShallow((state) => ({
      open: state.open,
      close: state.close,
      toggle: state.toggle,
    })),
  );

export const useActiveChart = () =>
  useArtifactsStore((state) => state.activeChart);

export const useVersionState = (rootId: string) =>
  useArtifactsStore((state) => state.versionState[rootId]);

export const useArtifactsVersionActions = () =>
  useArtifactsStore(
    useShallow((state) => ({
      syncVersionStates: state.syncVersionStates,
      setSelectedIndex: state.setSelectedIndex,
      setActiveChart: state.setActiveChart,
      reset: state.reset,
    })),
  );
