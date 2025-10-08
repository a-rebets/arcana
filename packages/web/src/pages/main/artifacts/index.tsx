import { XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Carousel,
  CarouselIndicator,
  CarouselNavigation,
} from "@/components/ui/carousel";
import {
  useArtifactsPanelActions,
  useArtifactsPanelState,
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
    <header className="px-4 py-2 border-b flex items-center gap-4">
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
    </header>
  );
}
