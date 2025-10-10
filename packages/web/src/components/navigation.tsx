import { CardsIcon, HouseIcon } from "@phosphor-icons/react";
import { Link, useResolvedPath } from "react-router";
import { Button } from "@/components/animate-ui/components/buttons/button";
import ThemeToggle from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import UserMenu from "../pages/main/user-menu";

const navigationLinks = [
  {
    href: "/",
    label: "Chat",
    icon: HouseIcon,
  },
  {
    href: "/gallery",
    label: "Gallery",
    icon: CardsIcon,
  },
];

export function NavigationHeader({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
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
            "flex items-center gap-2",
            "col-start-1 row-start-1",
            "md:col-start-1 md:row-start-1 md:min-w-72 md:pb-1",
          )}
        >
          <MobileNavigation className="md:hidden" />
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-primary hover:text-primary/90 font-display text-2xl"
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
  const path = useResolvedPath(".");
  return (
    <NavigationMenu className={cn("h-full *:h-full", className)}>
      <NavigationMenuList className="h-full gap-2">
        {navigationLinks.map((link) => (
          <NavigationMenuItem key={link.label} className="h-full">
            <NavigationMenuLink
              asChild
              active={path.pathname === link.href}
              className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
            >
              <Link to={link.href}>{link.label}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNavigation({ className }: { className?: string }) {
  const path = useResolvedPath(".");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn("group size-8", className)}
          variant="ghost"
          size="icon"
        >
          <MorphingIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-36 p-1 md:hidden">
        <NavigationMenu className="max-w-none *:w-full">
          <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={link.label} className="w-full">
                  <NavigationMenuLink
                    asChild
                    className="flex-row items-center gap-2 py-1.5"
                    active={path.pathname === link.href}
                  >
                    <Link to={link.href}>
                      <Icon
                        size={16}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
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
