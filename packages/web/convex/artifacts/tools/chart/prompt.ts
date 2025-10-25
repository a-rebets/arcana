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

export function buildChartRetryPrompt(
  task: string,
  dataset: Doc<"datasets">,
  failedSpec: string,
  validationError: string,
): string {
  const datasetInfo = `Dataset Title: "${dataset.name}"

Dataset Schema:
\`\`\`
${dataset.schema ?? ""}
\`\`\``;

  return `${task}

Your previous spec (which has errors):
\`\`\`json
${failedSpec}
\`\`\`

Validation error:
${validationError}

Fix the spec to address these errors.

${datasetInfo}`;
}
