import { Agent, stepCountIs } from "@convex-dev/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { asanaTools } from "asana-tools";
import { components } from "../_generated/api";
import { SYSTEM_PROMPT, THREAD_TITLES_PROMPT } from "../lib/aiDefaults";
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

export const threadTitlesAgent = new Agent(components.agent, {
  name: "Thread Titles Agent",
  languageModel: openrouter("google/gemini-2.5-flash-lite", {
    reasoning: { enabled: false, effort: "low" },
  }),
  instructions: THREAD_TITLES_PROMPT,
  storageOptions: {
    saveMessages: "none",
  },
});
