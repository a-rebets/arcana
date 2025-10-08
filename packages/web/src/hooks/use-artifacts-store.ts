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
