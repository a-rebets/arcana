import type { UIMessage } from "@convex-dev/agent";
import type {
  ReasoningUIPart,
  SourceUrlUIPart,
  TextUIPart,
  ToolUIPart,
  UIDataTypes,
} from "ai";
import type { AsanaTools } from "asana-tools";
import type { UsePaginatedQueryResult } from "convex/react";
import type { ArtifactsTools } from "../../../convex/artifacts";

export type ChatSyncStatus = UsePaginatedQueryResult<unknown>["status"];

export type ArcanaUIMessage = UIMessage<
  never,
  UIDataTypes,
  AsanaTools & ArtifactsTools
>;

export type ArcanaUIMessagePart = ArcanaUIMessage["parts"][number];

export type ArcanaToolUIPart = Extract<
  ArcanaUIMessagePart,
  { type: ToolUIPart["type"] }
>;

export type ArcanaChartToolResult = ArcanaToolWithCompleteOutput<
  "tool-charts_createOrUpdateChartTool",
  { version: number }
>;

export type ArcanaTextUIPart = Extract<
  ArcanaUIMessagePart,
  { type: TextUIPart["type"] }
>;

export type ArcanaReasoningUIPart = Extract<
  ArcanaUIMessagePart,
  { type: ReasoningUIPart["type"] }
>;

export type ArcanaSourcesUIPart = Extract<
  ArcanaUIMessagePart,
  { type: SourceUrlUIPart["type"] }
>;

// Helper Utilities
type FilterToolByOutput<ToolPart, OutputShape> = ToolPart extends {
  output: infer O;
}
  ? O extends OutputShape
    ? { [K in keyof ToolPart]: K extends "output" ? O : ToolPart[K] }
    : never
  : never;

type ArcanaToolWithCompleteOutput<
  K extends ArcanaToolUIPart["type"],
  T extends Record<string, unknown>,
> = FilterToolByOutput<
  Extract<ArcanaToolUIPart, { type: K; state: "output-available" }>,
  T & { message: string }
>;
