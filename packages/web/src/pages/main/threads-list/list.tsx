import type { ThreadDoc as Thread } from "@convex-dev/agent";
import { PushPinSimpleIcon } from "@phosphor-icons/react";
import { isThisWeek, isToday, isYesterday } from "date-fns";
import {
  AnimatePresence,
  type HTMLMotionProps,
  LayoutGroup,
  motion,
  type Transition,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type ThreadItem = Pick<Thread, "_id" | "_creationTime" | "title"> & {
  pinned: boolean;
  current?: boolean;
};
type TimeGroup = "today" | "yesterday" | "thisWeek" | "older";

function getTimeGroup(creationTime: number): TimeGroup {
  const date = new Date(creationTime);

  if (isToday(date)) return "today";
  if (isYesterday(date)) return "yesterday";
  if (isThisWeek(date, { weekStartsOn: 0 })) return "thisWeek";
  return "older";
}

const timeGroupLabels: Record<TimeGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  thisWeek: "This Week",
  older: "Older",
};

const timeGroups: TimeGroup[] = ["today", "yesterday", "thisWeek", "older"];

const itemTransition: Transition = {
  stiffness: 320,
  damping: 20,
  mass: 0.8,
  type: "spring",
};

type ThreadsListProps = {
  currentThreadId?: string;
  threads: Thread[];
  className?: string;
  zIndexResetDelay?: number;
} & HTMLMotionProps<"div">;

function ThreadsList({
  currentThreadId,
  threads,
  className,
  zIndexResetDelay = 500,
  ...props
}: ThreadsListProps) {
  const selectedThreadRef = useRef<HTMLDivElement | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const [togglingGroup, setTogglingGroup] = useState<
    TimeGroup | "pinned" | null
  >(null);

  useEffect(() => {
    if (selectedThreadRef.current) {
      selectedThreadRef.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, []);

  const listItems = useMemo<ThreadItem[]>(
    () =>
      threads.map(({ _id, _creationTime, title }) => ({
        _id,
        _creationTime,
        title: title || "New chat",
        pinned: pinnedIds.has(_id),
        current: _id === currentThreadId,
      })),
    [threads, currentThreadId, pinnedIds],
  );

  const { pinned, groupedByTime } = useMemo(() => {
    const pinnedItems: ThreadItem[] = [];
    const grouped = {} as Record<TimeGroup, ThreadItem[]>;

    for (const item of listItems) {
      if (item.pinned) {
        pinnedItems.push(item);
      } else {
        const group = getTimeGroup(item._creationTime);
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(item);
      }
    }

    return { pinned: pinnedItems, groupedByTime: grouped };
  }, [listItems]);

  const toggleStatus = (id: string) => {
    const item = listItems.find((u) => u._id === id);
    if (!item) return;

    if (item.pinned) {
      setTogglingGroup("pinned");
    } else {
      setTogglingGroup(getTimeGroup(item._creationTime));
    }

    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    setTimeout(() => setTogglingGroup(null), zIndexResetDelay);
  };

  return (
    <motion.div layoutScroll className={cn("space-y-3", className)} {...props}>
      <LayoutGroup>
        {pinned.length > 0 && (
          <div
            className={cn(
              "space-y-2 md:space-y-1.5 relative",
              togglingGroup === "pinned" ? "z-5" : "z-10",
            )}
          >
            {pinned.map((item) => (
              <ThreadListItem
                key={item._id}
                item={item}
                onToggle={toggleStatus}
                ref={item.current ? selectedThreadRef : undefined}
              />
            ))}
          </div>
        )}

        {timeGroups.map((group) => {
          const items = groupedByTime[group];
          if (!items || items.length === 0) return null;

          return (
            <div key={group}>
              <AnimatePresence>
                <motion.p
                  layout
                  key={`${group}-label`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="px-3 text-muted-foreground/80 dark:text-muted-foreground/50 text-sm md:text-xs mb-2"
                >
                  {timeGroupLabels[group]}
                </motion.p>
              </AnimatePresence>
              <div
                className={cn(
                  "space-y-2 md:space-y-1.5 relative",
                  togglingGroup === group ? "z-5" : "z-10",
                )}
              >
                {items.map((item) => (
                  <ThreadListItem
                    key={item._id}
                    item={item}
                    onToggle={toggleStatus}
                    ref={item.current ? selectedThreadRef : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </LayoutGroup>
    </motion.div>
  );
}

type ThreadListItemProps = {
  item: ThreadItem;
  onToggle: (id: string) => void;
  ref?: React.Ref<HTMLDivElement>;
};

function ThreadListItem({ item, onToggle, ref }: ThreadListItemProps) {
  const navigate = useNavigate();
  return (
    <motion.div
      ref={ref}
      layoutId={`item-${item._id}`}
      transition={itemTransition}
      onClick={() => navigate(`/chat/${item._id}`)}
      className={cn(
        "flex items-center justify-between gap-5 rounded-lg pl-3 pr-1 py-1 cursor-pointer border border-input/50 dark:hover:bg-accent/30 hover:bg-accent/70 group",
        item.current && "bg-input/70 dark:bg-accent/60",
      )}
    >
      <div className="flex-1 text-sm truncate select-none">{item.title}</div>
      <Toggle
        size="sm"
        variant="outline"
        aria-label={
          item.pinned
            ? `Unpin thread "${item.title}"`
            : `Pin thread "${item.title}"`
        }
        pressed={item.pinned}
        onPressedChange={() => onToggle(item._id)}
        onClick={(event) => event.stopPropagation()}
        className="md:h-7 md:px-1 md:min-w-7 shrink-0 transition-opacity duration-250 data-[state=off]:opacity-0 group-hover:data-[state=off]:opacity-100 data-[state=on]:border-foreground/10 data-[state=on]:bg-transparent hover:data-[state=on]:border-foreground/40 data-[state=on]:text-foreground/60 hover:data-[state=on]:text-foreground/80"
      >
        <PushPinSimpleIcon className="size-4" />
      </Toggle>
    </motion.div>
  );
}

export { ThreadsList, type ThreadItem };
