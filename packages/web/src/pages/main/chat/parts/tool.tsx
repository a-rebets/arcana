import { FilesIcon, PresentationChartIcon } from "@phosphor-icons/react";
import AsanaIcon from "@/assets/asana-icon.svg?react";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { ArtifactChatButton } from "@/components/artifacts/chat-button";
import type {
  ArcanaChartToolResult,
  ArcanaToolUIPart,
  ArcanaUIMessagePart,
} from "@/lib/convex-agent";
import {
  type DynamicToolOutput,
  type RawArcanaUIToolPackage,
  type RawArcanaUIToolType,
  toolLabels,
} from "@/lib/tool-labels";

const ToolIcons = {
  asana: <AsanaIcon className="size-4 text-asana" />,
  datasets: <FilesIcon className="size-4 text-muted-foreground" />,
  charts: <PresentationChartIcon className="size-4 text-muted-foreground" />,
};

function ToolCall({ part }: { part: ArcanaToolUIPart }) {
  const toolInfo = parseToolType(part.type);
  const labels = getToolLabels(part);

  if (isChartToolResultPart(part)) {
    return <ArtifactChatButton data={part.output} className="mb-4" />;
  }

  const isPreliminary =
    part.state === "output-available" && part.preliminary === true;

  return (
    <Tool>
      <ToolHeader
        id={part.toolCallId}
        labels={labels}
        state={part.state}
        className="-ml-0.5"
        isPreliminary={isPreliminary}
      >
        {toolInfo ? ToolIcons[toolInfo.package] : null}
      </ToolHeader>
      <ToolContent>
        {hasInput(part.input) && (
          <ToolInput input={part.input} className="md:max-w-[80%]" />
        )}
        <ToolOutput
          output={part.output}
          errorText={part.errorText}
          className="md:max-w-[80%]"
        />
      </ToolContent>
    </Tool>
  );
}

function getToolLabels(part: ArcanaToolUIPart) {
  const output = part.output;
  const toolInfo = parseToolType(part.type);
  const defaultLabels = getDefaultToolLabels(part.type);

  if (!toolInfo) {
    return defaultLabels;
  }
  const { "output-available": outputLabel, ...rest } =
    toolLabels[toolInfo.fullName];

  if (typeof outputLabel === "string") {
    return { ...rest, "output-available": outputLabel };
  }

  return {
    ...rest,
    "output-available": output
      ? (output as DynamicToolOutput)[outputLabel.field]
      : defaultLabels["output-available"],
  };
}

function getDefaultToolLabels(toolType: ArcanaToolUIPart["type"]) {
  const name = toolType.split("-")[1].split("_")[1];
  return {
    "input-streaming": `Using the "${name}" tool...`,
    "output-available": `Used the "${name}" tool`,
    "output-error": `Error using the "${name}" tool`,
  };
}

function parseToolType(toolType: ArcanaToolUIPart["type"]) {
  const match = toolType.match(/^tool-([^_]+)_(.+)$/);
  if (!match) {
    return null;
  }
  return {
    package: match[1] as RawArcanaUIToolPackage,
    fullName: `${match[1]}_${match[2]}` as RawArcanaUIToolType,
  };
}

function isToolPart(part: ArcanaUIMessagePart): part is ArcanaToolUIPart {
  return part.type.startsWith("tool-");
}

function isChartToolResultPart(
  part: ArcanaToolUIPart,
): part is ArcanaChartToolResult {
  return (
    part.type === "tool-charts_createOrUpdateChartTool" &&
    part.state === "output-available" &&
    typeof part.output === "object" &&
    part.output !== null &&
    "version" in part.output
  );
}

function hasInput(input: ArcanaToolUIPart["input"]) {
  return (
    input !== undefined &&
    input !== null &&
    !(typeof input === "object" && Object.keys(input).length === 0)
  );
}

export { ToolCall, isToolPart };
