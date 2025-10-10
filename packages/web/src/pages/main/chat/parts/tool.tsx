import { FilesIcon, PresentationChartIcon } from "@phosphor-icons/react";
import AsanaIcon from "@/assets/asana-icon.svg?react";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import type { ArcanaToolUIPart, ArcanaUIMessagePart } from "@/lib/convex-agent";
import {
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
  const defaultLabels = getDefaultToolLabels(part.type);
  const labels = toolInfo ? toolLabels[toolInfo.fullName] : defaultLabels;

  return (
    <Tool>
      <ToolHeader labels={labels ?? defaultLabels} state={part.state}>
        {toolInfo ? ToolIcons[toolInfo.package] : null}
      </ToolHeader>
      <ToolContent>
        <ToolInput input={part.input} />
        <ToolOutput output={part.output} errorText={part.errorText} />
      </ToolContent>
    </Tool>
  );
}

function getDefaultToolLabels(toolType: ArcanaToolUIPart["type"]) {
  const name = toolType.split("-")[1];
  return {
    "input-streaming": `Using the "${name}" tool...`,
    "output-available": `Used the "${name}" tool`,
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

export { ToolCall, isToolPart };
