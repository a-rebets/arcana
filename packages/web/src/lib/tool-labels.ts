import { asanaToolLabels } from "asana-tools";
import type { ArcanaToolUIPart } from "@/lib/convex-agent/types";

export const toolLabels = {
  ...asanaToolLabels,
};

export type ExtractToolName<T extends string> = T extends `tool-${infer U}`
  ? U
  : never;

export type RawArcanaUIToolType = ExtractToolName<ArcanaToolUIPart["type"]>;
