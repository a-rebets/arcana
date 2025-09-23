import type {
  ReasoningUIPart,
  TextUIPart,
  ToolUIPart,
  UIDataTypes,
  UIMessage,
} from "ai";
import type { AsanaTools } from "asana-tools";

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
