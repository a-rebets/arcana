import { useChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import {
	ArrowsClockwiseIcon,
	CopyIcon,
	GlobeSimpleIcon,
} from "@phosphor-icons/react";
import { DefaultChatTransport, type ToolUIPart } from "ai";
import { Fragment, useState } from "react";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
	PromptInput,
	PromptInputAttachment,
	PromptInputAttachments,
	PromptInputBody,
	PromptInputButton,
	type PromptInputMessage,
	PromptInputModelSelect,
	PromptInputModelSelectContent,
	PromptInputModelSelectItem,
	PromptInputModelSelectTrigger,
	PromptInputModelSelectValue,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputToolbar,
	PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
	Tool,
	ToolContent,
	ToolHeader,
	ToolInput,
	ToolOutput,
} from "@/components/ai-elements/tool";
import { EyeLoader } from "@/components/ui/loaders";
import { useAsanaRefresh } from "@/hooks/useAsanaRefresh";
import NavigationHeader from "./navigation";

const models = [
	{
		name: "GPT 5",
		value: "openai/gpt-5",
	},
	{
		name: "Gemini 2.5 Flash",
		value: "google/gemini-2.5-flash",
	},
] as const;

// biome-ignore lint/suspicious/noExplicitAny: ai sdk
function isToolUIPart(part: any): part is ToolUIPart {
	return part && typeof part.type === "string" && part.type.startsWith("tool-");
}

function Page() {
	const { ready: asanaReady } = useAsanaRefresh();
	const token = useAuthToken();

	const [input, setInput] = useState("");
	const [model, setModel] = useState<string>(models[0].value);
	const [webSearch, setWebSearch] = useState(false);
	const { messages, sendMessage, status, regenerate } = useChat({
		transport: new DefaultChatTransport({
			api: `${import.meta.env.VITE_CONVEX_API_URL}/api/chat`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			credentials: "omit",
		}),
	});

	const handleSubmit = (message: PromptInputMessage) => {
		const hasText = Boolean(message.text);
		const hasAttachments = Boolean(message.files?.length);

		if (!(hasText || hasAttachments)) {
			return;
		}

		sendMessage(
			{
				text: message.text || "Sent with attachments",
				files: message.files,
			},
			{
				body: {
					model: model,
					webSearch: webSearch,
				},
			},
		);
		setInput("");
	};

	return (
		<main className="h-screen grid grid-rows-[auto_1fr] grid-cols-1">
			<NavigationHeader className="sticky top-0 left-0 right-0 z-50" />
			<div className="max-w-4xl mx-auto px-6 pb-6 relative min-h-0 flex flex-col w-full">
				<Conversation className="flex-1 min-h-0">
					<ConversationContent>
						{messages.map((message) => (
							<div key={message.id}>
								{message.role === "assistant" &&
									message.parts.filter((part) => part.type === "source-url")
										.length > 0 && (
										<Sources>
											<SourcesTrigger
												count={
													message.parts.filter(
														(part) => part.type === "source-url",
													).length
												}
											/>
											{message.parts
												.filter((part) => part.type === "source-url")
												.map((part, i) => (
													<SourcesContent key={`${message.id}-${i}`}>
														<Source
															key={`${message.id}-${i}`}
															href={part.url}
															title={part.url}
														/>
													</SourcesContent>
												))}
										</Sources>
									)}
								{message.parts.map((part, i) => {
									switch (part.type) {
										case "text":
											return (
												<Fragment key={`${message.id}-${i}`}>
													<Message from={message.role}>
														<MessageContent>
															<Response>{part.text}</Response>
														</MessageContent>
													</Message>
													{message.role === "assistant" &&
														i === messages.length - 1 && (
															<Actions className="mt-2">
																<Action
																	onClick={() => regenerate()}
																	label="Retry"
																>
																	<ArrowsClockwiseIcon className="size-3" />
																</Action>
																<Action
																	onClick={() =>
																		navigator.clipboard.writeText(part.text)
																	}
																	label="Copy"
																>
																	<CopyIcon className="size-3" />
																</Action>
															</Actions>
														)}
												</Fragment>
											);
										case "reasoning":
											return (
												<Reasoning
													key={`${message.id}-${i}`}
													className="w-full"
													isStreaming={
														status === "streaming" &&
														i === message.parts.length - 1 &&
														message.id === messages.at(-1)?.id
													}
													defaultOpen={false}
												>
													<ReasoningTrigger />
													<ReasoningContent>{part.text}</ReasoningContent>
												</Reasoning>
											);
										default:
											// Handle tool calls
											if (isToolUIPart(part)) {
												return (
													<Tool key={`${message.id}-${i}`}>
														<ToolHeader type={part.type} state={part.state} />
														<ToolContent>
															<ToolInput input={part.input} />
															<ToolOutput
																output={part.output}
																errorText={part.errorText}
															/>
														</ToolContent>
													</Tool>
												);
											}
											return null;
									}
								})}
							</div>
						))}
						{status === "submitted" && <EyeLoader />}
					</ConversationContent>
					<ConversationScrollButton />
				</Conversation>

				<PromptInput onSubmit={handleSubmit} globalDrop multiple>
					<PromptInputBody>
						<PromptInputAttachments>
							{(attachment) => <PromptInputAttachment data={attachment} />}
						</PromptInputAttachments>
						<PromptInputTextarea
							onChange={(e) => setInput(e.target.value)}
							value={input}
						/>
					</PromptInputBody>
					<PromptInputToolbar>
						<PromptInputTools>
							<PromptInputButton
								variant={webSearch ? "default" : "ghost"}
								onClick={() => setWebSearch(!webSearch)}
							>
								<GlobeSimpleIcon size={16} />
								<span>Search</span>
							</PromptInputButton>
							<PromptInputModelSelect
								onValueChange={(value) => {
									setModel(value);
								}}
								value={model}
							>
								<PromptInputModelSelectTrigger>
									<PromptInputModelSelectValue />
								</PromptInputModelSelectTrigger>
								<PromptInputModelSelectContent>
									{models.map((model) => (
										<PromptInputModelSelectItem
											key={model.value}
											value={model.value}
										>
											{model.name}
										</PromptInputModelSelectItem>
									))}
								</PromptInputModelSelectContent>
							</PromptInputModelSelect>
						</PromptInputTools>
						<PromptInputSubmit
							disabled={(!input && !status) || !asanaReady}
							status={status}
						/>
					</PromptInputToolbar>
				</PromptInput>
			</div>
		</main>
	);
}

export default Page;
