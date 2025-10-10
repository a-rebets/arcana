import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { motion, type Transition, useMotionValue } from "motion/react";
import {
  Children,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { Button } from "../animate-ui/components/buttons/button";

export type CarouselContextType = {
  index: number;
  setIndex: (newIndex: number) => void;
  itemsCount: number;
  setItemsCount: (newItemsCount: number) => void;
  disableDrag: boolean;
};

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined,
);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within an CarouselProvider");
  }
  return context;
}

export type CarouselProviderProps = {
  children: ReactNode;
  initialIndex?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
};

function CarouselProvider({
  children,
  initialIndex = 0,
  onIndexChange,
  disableDrag = false,
}: CarouselProviderProps) {
  const [index, setIndex] = useState<number>(initialIndex);
  const [itemsCount, setItemsCount] = useState<number>(0);

  const handleSetIndex = (newIndex: number) => {
    setIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  return (
    <CarouselContext.Provider
      value={{
        index,
        setIndex: handleSetIndex,
        itemsCount,
        setItemsCount,
        disableDrag,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

export type CarouselProps = {
  children: ReactNode;
  className?: string;
  initialIndex?: number;
  index?: number;
  onIndexChange?: (newIndex: number) => void;
  disableDrag?: boolean;
};

function Carousel({
  children,
  className,
  initialIndex = 0,
  index: externalIndex,
  onIndexChange,
  disableDrag = false,
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState<number>(initialIndex);
  const isControlled = externalIndex !== undefined;
  const currentIndex = isControlled ? externalIndex : internalIndex;

  const handleIndexChange = (newIndex: number) => {
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    onIndexChange?.(newIndex);
  };

  return (
    <CarouselProvider
      initialIndex={currentIndex}
      onIndexChange={handleIndexChange}
      disableDrag={disableDrag}
    >
      <div className={cn("group/hover", className)}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </CarouselProvider>
  );
}

export type CarouselNavigationProps = {
  className?: string;
  classNameButton?: string;
};

function CarouselNavigation({
  className,
  classNameButton,
}: CarouselNavigationProps) {
  const isMobile = useIsMobile();
  const { index, setIndex, itemsCount } = useCarousel();

  return (
    <div
      className={cn(
        "pointer-events-none absolute flex justify-between px-4",
        className,
      )}
    >
      <Button
        type="button"
        aria-label="Previous slide"
        size={isMobile ? "lg" : "sm"}
        variant="outline"
        className={cn(
          "rounded-full pointer-events-auto md:has-[>svg]:pr-4 select-none",
          classNameButton,
        )}
        disabled={index === 0}
        onClick={() => {
          if (index > 0) {
            setIndex(index - 1);
          }
        }}
      >
        <CaretLeftIcon weight="bold" />
        {!isMobile && "Previous"}
      </Button>
      <Button
        type="button"
        aria-label="Next slide"
        size={isMobile ? "lg" : "sm"}
        variant="outline"
        className={cn(
          "rounded-full pointer-events-auto md:has-[>svg]:pl-4 select-none",
          classNameButton,
        )}
        disabled={index + 1 === itemsCount || itemsCount === 0}
        onClick={() => {
          if (index < itemsCount - 1) {
            setIndex(index + 1);
          }
        }}
      >
        {!isMobile && "Next"}
        <CaretRightIcon weight="bold" />
      </Button>
    </div>
  );
}

export type CarouselIndicatorProps = {
  className?: string;
  classNameButton?: string;
};

function CarouselIndicator({
  className,
  classNameButton,
}: CarouselIndicatorProps) {
  const { index, itemsCount, setIndex } = useCarousel();

  return (
    <div
      className={cn(
        "absolute bottom-0 z-10 flex w-full items-center justify-center",
        className,
      )}
    >
      <div className="flex space-x-2">
        {itemsCount > 1 &&
          Array.from({ length: itemsCount }, (_, i) => (
            <button
              key={i.toString()}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-opacity duration-300",
                index === i
                  ? "bg-zinc-950 dark:bg-zinc-50"
                  : "bg-zinc-900/50 dark:bg-zinc-100/50",
                classNameButton,
              )}
            />
          ))}
      </div>
    </div>
  );
}

export type CarouselContentProps = {
  children: ReactNode;
  className?: string;
  transition?: Transition;
};

function CarouselContent({
  children,
  className,
  transition,
}: CarouselContentProps) {
  const { index, setIndex, setItemsCount, disableDrag } = useCarousel();
  const dragX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsLength = Children.count(children);

  // Initialize visibleItemsCount to itemsLength to avoid division by zero
  // IntersectionObserver will update it to the actual visible count
  const [visibleItemsCount, setVisibleItemsCount] = useState(itemsLength || 1);

  useEffect(() => {
    setVisibleItemsCount(itemsLength || 1);
  }, [itemsLength]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ui
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const options = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleCount = entries.filter(
        (entry) => entry.isIntersecting,
      ).length;
      if (visibleCount > 0) {
        setVisibleItemsCount(visibleCount);
      }
    }, options);

    const childNodes = containerRef.current.children;
    for (let i = 0; i < childNodes.length; i++) {
      observer.observe(childNodes[i]);
    }

    return () => observer.disconnect();
  }, [itemsLength]);

  useEffect(() => {
    setItemsCount(itemsLength || 0);
  }, [itemsLength, setItemsCount]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -10 && index < itemsLength - 1) {
      setIndex(index + 1);
    } else if (x >= 10 && index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <motion.div
      drag={disableDrag ? false : "x"}
      dragConstraints={
        disableDrag
          ? undefined
          : {
              left: 0,
              right: 0,
            }
      }
      dragMomentum={disableDrag ? undefined : false}
      style={{
        x: disableDrag ? undefined : dragX,
      }}
      animate={{
        translateX: `-${index * (100 / visibleItemsCount)}%`,
      }}
      onDragEnd={disableDrag ? undefined : onDragEnd}
      transition={
        transition || {
          damping: 18,
          stiffness: 90,
          type: "spring",
          duration: 0.2,
        }
      }
      className={cn(
        "flex items-center",
        !disableDrag && "cursor-grab active:cursor-grabbing",
        className,
      )}
      ref={containerRef}
    >
      {children}
    </motion.div>
  );
}

export type CarouselItemProps = {
  children: ReactNode;
  className?: string;
};

function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <motion.div
      className={cn(
        "w-full min-w-0 shrink-0 grow-0 overflow-hidden",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
  useCarousel,
};
