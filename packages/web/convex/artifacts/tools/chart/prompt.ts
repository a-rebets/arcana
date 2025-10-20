import type { Doc } from "../../../_generated/dataModel";

export function buildChartPrompt(
  task: string,
  dataset: Doc<"datasets">,
  existingArtifact: Doc<"artifacts"> | null,
): string {
  const datasetInfo = `Dataset Title: "${dataset.name}"
  
Dataset Schema:
\`\`\`
${dataset.schema ?? ""}
\`\`\``;

  if (!existingArtifact) {
    return `${task}
  
${datasetInfo}`;
  }

  const vlSpec = JSON.parse(existingArtifact.vlSpec);
  return `${task}
  
Current Vega-Lite Spec:
\`\`\`json
${JSON.stringify(vlSpec, null, 2)}
\`\`\`
  
${datasetInfo}`;
}
