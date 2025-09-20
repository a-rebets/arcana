import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	type UIMessage,
} from "ai";
import { listUserProjectsTool, listUserWorkspacesTool } from "asana-tools";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { env } from "./lib/env";

const openrouter = createOpenRouter({
	apiKey: env.OPENROUTER_API_KEY,
});

export const postMessage = httpAction(async (ctx, request) => {
	const {
		messages,
		model,
		webSearch,
	}: {
		messages: UIMessage[];
		model: string;
		webSearch: boolean;
	} = await request.json();

	const connection = await ctx.runQuery(
		internal.asana.oauth.protected.getConnection,
		{},
	);

	const result = streamText({
		model: openrouter(webSearch ? "perplexity/sonar" : model, {
			reasoning: {
				effort: "low",
			},
		}),
		messages: convertToModelMessages(messages),
		system:
			"You are a helpful assistant that can answer questions and help with tasks. You can use multiple tools in sequence to gather information and provide comprehensive answers about Asana workspaces, projects, and tasks.",
		tools: {
			listUserProjects: listUserProjectsTool,
			listUserWorkspaces: listUserWorkspacesTool,
		},
		stopWhen: stepCountIs(10),
		experimental_context: {
			asanaToken: connection?.accessToken,
		},
	});

	return result.toUIMessageStreamResponse({
		sendSources: true,
		sendReasoning: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
			Vary: "origin",
		},
	});
});
