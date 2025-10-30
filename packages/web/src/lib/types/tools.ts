import type { ArcanaToolUIPart } from "@/lib/convex-agent";

type ExtractToolName<T extends string> = T extends `tool-${infer U}`
  ? U
  : never;

type ExtractPackageName<T extends string> =
  T extends `tool-${infer Package}_${string}` ? Package : never;

export type RawArcanaUIToolType = ExtractToolName<ArcanaToolUIPart["type"]>;

export type RawArcanaUIToolPackage = ExtractPackageName<
  ArcanaToolUIPart["type"]
>;

export type DynamicToolOutput = Extract<
  ArcanaToolUIPart["output"],
  { message: string }
>;
