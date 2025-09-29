import type { UIMessage } from "@convex-dev/agent";
import type { ReasoningUIPart, TextUIPart, ToolUIPart, UIDataTypes } from "ai";
import type { AsanaTools } from "asana-tools";
import type { UsePaginatedQueryResult } from "convex/react";

export type ChatSyncStatus = UsePaginatedQueryResult<unknown>["status"];

export type ArcanaUIMessage = UIMessage<never, UIDataTypes, AsanaTools>;

export type ArcanaUIMessagePart = ArcanaUIMessage["parts"][number];

export type ArcanaToolUIPart = Extract<
  ArcanaUIMessagePart,
  { type: ToolUIPart["type"] }
>;

export type ArcanaTextUIPart = Extract<
  ArcanaUIMessagePart,
  { type: TextUIPart["type"] }
>;

export type ArcanaReasoningUIPart = Extract<
  ArcanaUIMessagePart,
  { type: ReasoningUIPart["type"] }
>;
