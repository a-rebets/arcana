import { CardsIcon, ChatCircleTextIcon } from "@phosphor-icons/react";
import { type HTMLAttributes, useMemo } from "react";
import { Link, useLocation, useResolvedPath } from "react-router";
import { Button } from "@/components/animate-ui/components/buttons/button";
import ThemeToggle from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./animate-ui/components/radix/popover";
import UserMenu from "./user-menu";

const navigationLinks = [
  {
    href: "/",
    label: "Chat",
    icon: ChatCircleTextIcon,
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: CardsIcon,
  },
];

function isChatPath(path: string) {
  return path.startsWith("/chat") || path === "/";
}

function isActive(path: string, href: string) {
  if (href === "/") {
    return isChatPath(path);
  }
  return path.startsWith(href);
}

function useCurrentChatPath() {
  const { pathname: globalPath } = useResolvedPath(".");
  const { state }: { state?: { from: string } } = useLocation();

  const path = useMemo(() => {
    const from = state?.from;
    if (isChatPath(globalPath)) {
      return globalPath;
    }
    if (from && isChatPath(from)) {
      return from;
    }
    return "/";
  }, [globalPath, state]);
  return { chatPath: path, globalPath };
}

export function NavigationHeader({
  className,
  children,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <header className={cn("border-b px-4 md:px-6 pt-4 md:pt-0", className)}>
      <section
        className={cn(
          "relative grid gap-4 md:min-h-16",
          "grid-cols-2 grid-rows-[auto_auto] items-center",
          "md:grid-cols-[auto_1fr_auto] md:grid-rows-1",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 md:gap-2",
            "col-start-1 row-start-1",
            "md:col-start-1 md:row-start-1 md:min-w-72 md:pb-1",
          )}
        >
          <MobileNavigation className="md:hidden" />
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-primary hover:text-primary/90 font-display text-[1.7rem] md:text-2xl mb-0.5 md:mb-0"
            >
              arcana
            </Link>
            <DesktopNavigation className="max-md:hidden" />
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 justify-end",
            "col-start-2 row-start-1",
            "md:col-start-3 md:row-start-1 md:min-w-72",
          )}
        >
          <ThemeToggle />
          <UserMenu />
        </div>
        {children}
      </section>
    </header>
  );
}

export function MainNavigationSection({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "col-span-2 row-start-2 justify-self-center",
        "md:col-start-2 md:row-start-1 md:col-span-1",
        "relative h-14 w-full md:h-16 md:min-w-96 md:max-w-[35rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DesktopNavigation({ className }: { className?: string }) {
  const { chatPath, globalPath } = useCurrentChatPath();

  return (
    <NavigationMenu className={cn("h-full *:h-full", className)}>
      <NavigationMenuList className="h-full gap-2">
        {navigationLinks.map((link) => {
          return (
            <NavigationMenuItem key={link.label} className="h-full">
              <NavigationMenuLink
                asChild
                active={isActive(globalPath, link.href)}
                className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
              >
                <Link
                  to={link.href === "/" ? chatPath : link.href}
                  prefetch="intent"
                  state={{ from: globalPath }}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNavigation({ className }: { className?: string }) {
  const { chatPath, globalPath } = useCurrentChatPath();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "group rounded-full min-w-10 bg-transparent dark:bg-transparent shadow-none",
            className,
          )}
          variant="outline"
          size="icon"
        >
          <MorphingIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        alignOffset={-14}
        sideOffset={12}
        className="w-screen h-fit border-none shadow-none bg-transparent p-0"
        initial={{ opacity: 0, y: -10, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, y: 0, backdropFilter: "blur(8px)" }}
        exit={{ opacity: 0, y: -10, backdropFilter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <NavigationMenu className="max-w-none *:w-full">
          <NavigationMenuList className="flex-col items-start gap-2 px-3 pb-4 pt-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={link.label} className="w-full">
                  <NavigationMenuLink
                    asChild
                    className="group/nav-link flex-row items-center gap-5 py-2.5 px-[0.9rem] rounded-full data-[active]:bg-transparent text-muted-foreground data-[active]:text-accent-foreground"
                    active={isActive(globalPath, link.href)}
                  >
                    <Link
                      to={link.href === "/" ? chatPath : link.href}
                      prefetch="intent"
                      state={{ from: globalPath }}
                    >
                      <Icon
                        className="size-5.5 text-inherit"
                        aria-hidden="true"
                      />
                      <span className="text-lg group-data-[active]/nav-link:underline underline-offset-[6px]">
                        {link.label}
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
          <div className="bg-card/80 absolute inset-0 -z-10 rounded-b-3xl border-b dark:border-ring/30 border-ring/15 shadow-xl dark:shadow-none" />
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
}

function MorphingIcon() {
  return (
    <svg
      className="pointer-events-none"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Menu</title>
      <path
        d="M4 12L20 12"
        className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
      />
      <path
        d="M4 12H20"
        className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
      />
      <path
        d="M4 12H20"
        className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
      />
    </svg>
  );
}
