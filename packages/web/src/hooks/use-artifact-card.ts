import { createContext, useContext } from "react";
import type { ArtifactVersion, RootArtifactData } from "@/lib/types/artifacts";

type ArtifactCardContextValue = Omit<ArtifactVersion, "id"> &
  RootArtifactData & { isRoot: boolean };

export const ArtifactCardContext =
  createContext<ArtifactCardContextValue | null>(null);

export function useArtifactCard() {
  const context = useContext(ArtifactCardContext);
  if (!context) {
    throw new Error("useArtifactCard must be used within a ArtifactCardLayout");
  }
  return context;
}
