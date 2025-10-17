import { PresentationChartIcon, XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/animate-ui/components/radix/sheet";
import { ArtifactVersionPicker } from "@/components/artifacts/version-picker";
import {
  Carousel,
  CarouselIndicator,
  CarouselNavigation,
} from "@/components/ui/carousel";
import {
  useArtifactsPanelActions,
  useArtifactsPanelState,
} from "@/hooks/use-artifacts-store";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { ArtifactsContent } from "./content";

export function ArtifactsToggleButton({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const isArtifactsPanelOpen = useArtifactsPanelState();
  const { toggle: toggleArtifactsPanel } = useArtifactsPanelActions();

  const button = (
    <PromptInputButton
      variant={isArtifactsPanelOpen ? "default" : "ghost"}
      onClick={isMobile ? undefined : toggleArtifactsPanel}
      hoverScale={1}
      className={className}
    >
      <PresentationChartIcon weight="bold" />
      <span>Artifacts</span>
    </PromptInputButton>
  );

  if (!isMobile) return button;

  return <ArtifactsMobileLayout>{button}</ArtifactsMobileLayout>;
}

export function ArtifactsDesktopLayout({ className }: { className?: string }) {
  const { close } = useArtifactsPanelActions();
  const isOpen = useArtifactsPanelState();
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <motion.aside
      initial={{ opacity: isOpen ? 1 : 0, maxWidth: isOpen ? "50%" : 0 }}
      animate={{ opacity: isOpen ? 1 : 0, maxWidth: isOpen ? "50%" : 0 }}
      exit={{ opacity: 0, maxWidth: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "bg-sidebar grid-rows-[auto_1fr] hidden md:grid overflow-hidden border-l",
        className,
      )}
    >
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

function ArtifactsMobileLayout({ children }: { children: React.ReactNode }) {
  const isArtifactsPanelOpen = useArtifactsPanelState();
  const { toggle: toggleArtifactsPanel } = useArtifactsPanelActions();

  return (
    <Sheet open={isArtifactsPanelOpen} onOpenChange={toggleArtifactsPanel}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[70svh] rounded-t-2xl pb-4 px-2"
        showCloseButton={false}
      >
        <SheetHeader>
          <SheetTitle className="text-lg">Artifacts</SheetTitle>
          <SheetDescription className="sr-only">
            View and manage your artifacts.
          </SheetDescription>
        </SheetHeader>
        <div className="relative flex flex-col justify-center h-full">
          <Carousel>
            <ArtifactsContent />
            <CarouselNavigation
              className="absolute bottom-3 left-auto top-auto justify-end w-full gap-2"
              classNameButton="min-w-16 rounded-xl"
            />
            <CarouselIndicator className="bottom-20" />
          </Carousel>
          <ArtifactVersionPicker
            side="top"
            sideOffset={6}
            className="absolute bottom-3 left-4 data-[size=default]:h-10"
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant="outline"
              className="rounded-xl"
              hoverScale={1}
              tapScale={0.98}
            >
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
