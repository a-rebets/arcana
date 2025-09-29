import { Agent, stepCountIs } from "@convex-dev/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { asanaTools } from "asana-tools";
import { components } from "../_generated/api";
import { SYSTEM_PROMPT } from "../lib/aiDefaults";
import { env } from "../lib/env";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

export const arcanaAgent = new Agent(components.agent, {
  name: "Asana Copilot",
  languageModel: openrouter("x-ai/grok-code-fast-1", {
    reasoning: { enabled: true, effort: "low" },
  }),
  tools: asanaTools,
  instructions: SYSTEM_PROMPT,
  stopWhen: stepCountIs(20),
});
