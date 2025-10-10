import { XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Carousel,
  CarouselIndicator,
  CarouselNavigation,
} from "@/components/ui/carousel";
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
  useArtifactsPanelActions,
  useArtifactsPanelState,
  useArtifactsVersionActions,
  useVersionState,
} from "@/hooks/use-artifacts-store";
import { cn } from "@/lib/utils";
import { ArtifactsContent } from "./content";

export function Artifacts({ className }: { className?: string }) {
  const isOpen = useArtifactsPanelState();

  return (
    <motion.aside
      initial={{ opacity: 0, maxWidth: 0 }}
      animate={{ opacity: isOpen ? 1 : 0, maxWidth: isOpen ? "50%" : 0 }}
      exit={{ opacity: 0, maxWidth: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "bg-sidebar grid-rows-[auto_1fr] hidden md:grid overflow-hidden border-l",
        className,
      )}
    >
      <ArtifactHeader />
      <div className="flex flex-col justify-center min-w-[50vw] relative">
        <Carousel>
          <ArtifactsContent />
          <CarouselNavigation className="absolute bottom-6 left-auto top-auto justify-start w-full gap-2" />
          <CarouselIndicator className="bottom-24" />
        </Carousel>
      </div>
    </motion.aside>
  );
}

function ArtifactHeader() {
  const { close } = useArtifactsPanelActions();

  return (
    <header className="px-4 py-2 border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl shadow-none"
          onClick={close}
          type="button"
        >
          <XIcon weight="bold" />
        </Button>
        <h2 className="text-lg font-medium">Artifacts</h2>
      </div>
      <ArtifactVersionPicker />
    </header>
  );
}

function ArtifactVersionPicker() {
  const activeChart = useActiveChart();
  const versionState = useVersionState(activeChart ?? "");
  const { setSelectedIndex } = useArtifactsVersionActions();

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
              setSelectedIndex(activeChart, Number(value));
            }
          : undefined
      }
      disabled={totalCount <= 1}
    >
      <SelectTrigger className="w-48 rounded-xl">
        <SelectValue placeholder="Version" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="rounded-lg"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
