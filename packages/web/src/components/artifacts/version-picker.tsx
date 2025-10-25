import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useActiveChart,
  useArtifactsVersionActions,
  useVersionState,
} from "@/hooks/use-artifacts-store";
import { cn } from "@/lib/utils";

export function ArtifactVersionPicker({
  className,
  side,
  sideOffset,
}: {
  className?: string;
  side?: "top" | "bottom";
  sideOffset?: number;
}) {
  const activeChart = useActiveChart();
  const versionState = useVersionState(activeChart?.rootId ?? "");
  const { setSelectedVersion } = useArtifactsVersionActions();

  const [selectedIndex, totalCount] = versionState || [0, 0];

  const options = Array.from({ length: totalCount }, (_, i) => ({
    value: String(i),
    label: `Version ${i + 1}`,
  }));

  return (
    <Select
      value={totalCount > 1 ? String(selectedIndex) : ""}
      onValueChange={
        activeChart
          ? (value) => {
              setSelectedVersion(activeChart.rootId, Number(value));
            }
          : undefined
      }
      disabled={totalCount <= 1}
    >
      <SelectTrigger className={cn("w-48 rounded-xl", className)}>
        <SelectValue placeholder="Version" />
      </SelectTrigger>
      <SelectContent className="rounded-xl" side={side} sideOffset={sideOffset}>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg not-first:mt-2 md:not-first:mt-1.5"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
