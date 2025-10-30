import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { CurrencyDollarIcon, NewspaperIcon } from "@phosphor-icons/react";
import { useToggle } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useCallback } from "react";
import AsanaIcon from "@/assets/asana-icon.svg?react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useChatInput } from "@/hooks/use-chat-input";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    type: "projects",
    description: "Show my daily briefing from Asana",
  },
  {
    type: "financial",
    description: "How is Asana's stock (ASAN) performing this month?",
  },
  {
    type: "search",
    description: "What are the most important tech news of the week?",
  },
] as const;

const ICONS = {
  projects: <AsanaIcon className="size-3.5 ml-px" />,
  financial: <CurrencyDollarIcon className="size-4" weight="bold" />,
  search: <NewspaperIcon className="size-4" weight="bold" />,
};

export function ConversationStart({ className }: { className?: string }) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      className={cn(
        "flex flex-col items-center select-none w-full md:w-auto px-4 md:px-0",
        className,
      )}
    >
      <Greeting />
      <p className="text-muted-foreground md:text-2xl text-lg font-light text-center md:mb-12 mb-8">
        What are we exploring today?
      </p>
      <div className="flex flex-col w-full md:w-auto px-4 md:px-8 pt-5 md:pt-4 md:pb-7 pb-5 dark:bg-background/40 bg-background/10 backdrop-blur-xs border rounded-2xl">
        <p className="text-muted-foreground text-center font-light text-sm mb-4">
          You can get started with one of these questions:
        </p>
        <div className="flex flex-col">
          {isMobile ? (
            <DefaultQuestions />
          ) : (
            <AnimatedBackground
              className="rounded-xl md:rounded-full bg-muted inset-x-0 inset-y-1.5"
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6,
              }}
              enableHover
            >
              <DefaultQuestions />
            </AnimatedBackground>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Greeting() {
  const { data: userData } = useQuery(
    convexQuery(api.core.accounts.getUser, {}),
  );
  return (
    <h1 className="font-accent md:text-5xl text-4xl font-light mb-3 inline-flex flex-wrap justify-center">
      Welcome{userData && <span>,&nbsp;</span>}
      <span className="inline-flex">
        {userData && (
          <span className="inline-block max-w-80 md:max-w-none truncate md:overflow-visible md:whitespace-normal">
            {userData.name}
          </span>
        )}
        &nbsp;✌️
      </span>
    </h1>
  );
}

export function DefaultQuestions() {
  const [clicked, toggleClicked] = useToggle(false);
  const { submitFromNewThread } = useChatInput();

  const handleClick = useCallback(
    (item: (typeof ITEMS)[number]) => {
      if (clicked) return;
      toggleClicked(true);
      submitFromNewThread(item.description, item.type === "search");
    },
    [submitFromNewThread, toggleClicked, clicked],
  );

  return ITEMS.map((item, index) => (
    <div key={index.toString()} data-id={`card-${index}`} className="py-1.5">
      <div className="rounded-xl md:rounded-full border-[0.5px]">
        <Button
          variant="outline"
          className="h-fit select-none border-none has-[>svg]:px-3 md:has-[>svg]:pl-6 md:has-[>svg]:pr-8 py-2 gap-3 text-muted-foreground rounded-xl md:rounded-full w-full justify-start shadow-none hover:bg-transparent bg-transparent font-normal"
          hoverScale={1}
          tapScale={0.97}
          onClick={() => handleClick(item)}
          disabled={clicked}
        >
          {ICONS[item.type]}
          <p className="text-sm whitespace-normal md:truncate text-left text-pretty">
            {item.description}
          </p>
        </Button>
      </div>
    </div>
  ));
}
