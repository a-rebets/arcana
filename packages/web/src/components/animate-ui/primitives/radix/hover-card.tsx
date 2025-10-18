import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
import { useControlledState } from "@/hooks/use-controlled-state";
import { getStrictContext } from "@/lib/get-strict-context";

type HoverCardContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const [HoverCardProvider, useHoverCard] =
  getStrictContext<HoverCardContextType>("HoverCardContext");

type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive.Root>;

function HoverCard(props: HoverCardProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });

  return (
    <HoverCardProvider value={{ isOpen, setIsOpen }}>
      <HoverCardPrimitive.Root
        data-slot="hover-card"
        {...props}
        onOpenChange={setIsOpen}
      />
    </HoverCardProvider>
  );
}

type HoverCardTriggerProps = React.ComponentProps<
  typeof HoverCardPrimitive.Trigger
>;

function HoverCardTrigger(props: HoverCardTriggerProps) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

type HoverCardPortalProps = Omit<
  React.ComponentProps<typeof HoverCardPrimitive.Portal>,
  "forceMount"
>;

function HoverCardPortal(props: HoverCardPortalProps) {
  const { isOpen } = useHoverCard();

  return (
    <AnimatePresence>
      {isOpen && (
        <HoverCardPrimitive.Portal
          forceMount
          data-slot="hover-card-portal"
          {...props}
        />
      )}
    </AnimatePresence>
  );
}

type HoverCardContentProps = React.ComponentProps<
  typeof HoverCardPrimitive.Content
> &
  HTMLMotionProps<"div">;

function HoverCardContent({
  align,
  alignOffset,
  side,
  sideOffset,
  avoidCollisions,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  hideWhenDetached,
  transition = { type: "spring", stiffness: 300, damping: 25 },
  ...props
}: HoverCardContentProps) {
  return (
    <HoverCardPrimitive.Content
      asChild
      forceMount
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      avoidCollisions={avoidCollisions}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding}
      arrowPadding={arrowPadding}
      sticky={sticky}
      hideWhenDetached={hideWhenDetached}
    >
      <motion.div
        key="hover-card-content"
        data-slot="hover-card-content"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={transition}
        {...props}
      />
    </HoverCardPrimitive.Content>
  );
}

type HoverCardArrowProps = React.ComponentProps<
  typeof HoverCardPrimitive.Arrow
>;

function HoverCardArrow(props: HoverCardArrowProps) {
  return <HoverCardPrimitive.Arrow data-slot="hover-card-arrow" {...props} />;
}

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
  HoverCardArrow,
  useHoverCard,
  type HoverCardProps,
  type HoverCardTriggerProps,
  type HoverCardPortalProps,
  type HoverCardContentProps,
  type HoverCardArrowProps,
  type HoverCardContextType,
};
