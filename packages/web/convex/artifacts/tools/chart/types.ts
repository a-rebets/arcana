import type { Doc, Id } from "../../../_generated/dataModel";

export type ResolvedChartData = {
  dataset: Doc<"datasets">;
  existingArtifact: Doc<"artifacts"> | null;
  rootArtifactId: Id<"artifacts"> | undefined;
  version: number;
};
