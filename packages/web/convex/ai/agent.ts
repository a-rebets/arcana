import { Agent, stepCountIs } from "@convex-dev/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { components } from "../_generated/api";
import {
  CHART_PROMPT,
  SYSTEM_PROMPT,
  THREAD_TITLES_PROMPT,
} from "../lib/aiDefaults";
import { env } from "../lib/env";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

export const arcanaAgent = new Agent<{ asanaToken?: string }>(
  components.agent,
  {
    name: "Asana Copilot",
    languageModel: openrouter("openai/gpt-5-mini", {
      reasoning: { effort: "low" },
    }),
    instructions: SYSTEM_PROMPT,
    stopWhen: stepCountIs(20),
  },
);

export const chartsAgent = new Agent(components.agent, {
  name: "Vega Lite Agent",
  languageModel: openrouter("openai/gpt-5"),
  instructions: CHART_PROMPT,
  storageOptions: {
    saveMessages: "none",
  },
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
