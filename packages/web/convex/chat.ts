import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { httpAction } from "./_generated/server";
import { env } from "./lib/env";

const openrouter = createOpenRouter({
	apiKey: env.OPENROUTER_API_KEY,
});

export const postMessage = httpAction(async (_, request) => {
	const {
		messages,
		model,
		webSearch,
	}: {
		messages: UIMessage[];
		model: string;
		webSearch: boolean;
	} = await request.json();

	const result = streamText({
		model: openrouter(webSearch ? "perplexity/sonar" : model, {
			reasoning: {
				effort: "low",
			},
		}),
		messages: convertToModelMessages(messages),
		system:
			"You are a helpful assistant that can answer questions and help with tasks",
	});

	return result.toUIMessageStreamResponse({
		sendSources: true,
		sendReasoning: true,
		headers: {
			"Access-Control-Allow-Origin": "*", // Allow all origins for development
			Vary: "origin",
		},
	});
});
