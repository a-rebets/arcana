import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import type { ArcanaReasoningUIPart } from "@/lib/convex-agent";

export function MessageReasoning({
  part,
  isLast,
}: {
  part: ArcanaReasoningUIPart;
  isLast: boolean;
}) {
  return (
    <Reasoning
      className="w-full"
      isStreaming={part.state === "streaming" && isLast}
      defaultOpen={false}
    >
      <ReasoningTrigger />
      <ReasoningContent>{part.text}</ReasoningContent>
    </Reasoning>
  );
}
