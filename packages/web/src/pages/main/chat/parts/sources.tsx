import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import type { ArcanaSourcesUIPart } from "@/lib/convex-agent";

export function MessageSources({
  sources,
  id,
}: {
  sources: ArcanaSourcesUIPart[];
  id: string;
}) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <Sources>
      <SourcesTrigger count={sources.length} />
      {sources.map((part, i) => (
        <SourcesContent key={`${id}-${i.toString()}`}>
          <Source href={part.url} title={part.url} />
        </SourcesContent>
      ))}
    </Sources>
  );
}
