import {
  HoverCardContent as HoverCardContentPrimitive,
  type HoverCardContentProps as HoverCardContentPrimitiveProps,
  HoverCardPortal as HoverCardPortalPrimitive,
  HoverCard as HoverCardPrimitive,
  type HoverCardProps as HoverCardPrimitiveProps,
  HoverCardTrigger as HoverCardTriggerPrimitive,
  type HoverCardTriggerProps as HoverCardTriggerPrimitiveProps,
} from "@/components/animate-ui/primitives/radix/hover-card";
import { cn } from "@/lib/utils";

type HoverCardProps = HoverCardPrimitiveProps;

function HoverCard(props: HoverCardProps) {
  return <HoverCardPrimitive {...props} />;
}

type HoverCardTriggerProps = HoverCardTriggerPrimitiveProps;

function HoverCardTrigger(props: HoverCardTriggerProps) {
  return <HoverCardTriggerPrimitive {...props} />;
}

type HoverCardContentProps = HoverCardContentPrimitiveProps;

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: HoverCardContentProps) {
  return (
    <HoverCardPortalPrimitive>
      <HoverCardContentPrimitive
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </HoverCardPortalPrimitive>
  );
}

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  type HoverCardProps,
  type HoverCardTriggerProps,
  type HoverCardContentProps,
};
