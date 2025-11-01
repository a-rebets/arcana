import {
  BinocularsIcon,
  ChatCircleDotsIcon,
  PlugsIcon,
} from "@phosphor-icons/react";
import asana from "@/assets/asana.svg";
import logo from "@/assets/logo.svg";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { cn } from "@/lib/utils";
import { LoginDialog } from "./login-dialog";

export const handle = {
  bodyClasses: "w-full h-dvh relative bg-neutral-950 overflow-hidden",
};

const content = [
  {
    icon: ChatCircleDotsIcon,
    title: "Chat with your work",
    description: "Natural conversations as your main interface.",
  },
  {
    icon: BinocularsIcon,
    title: "Actionable analytics",
    description: "Visualize your business data — get insights at a glance.",
  },
  {
    icon: PlugsIcon,
    title: "Plugs into any workspace",
    description: "Asana today; Google Calendar and more soon.",
  },
];

function Page() {
  return (
    <>
      <StarsBackground
        starColor="#FFF"
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-[radial-gradient(circle_at_bottom,_#262626_0%,_#000_100%)] md:bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]",
        )}
      />
      <main className="container mx-auto text-center relative px-2 z-10 flex flex-col h-full justify-center items-center pointer-events-none">
        <div className="flex flex-col justify-center items-center gap-8 bg-background/90 rounded-xl px-3 py-6 md:px-12 md:pb-7 w-full md:w-[38rem] pointer-events-auto shadow-[inset_0_-56px_80px_-48px_rgb(0_0_0_/_.5)]">
          <div className="select-none">
            <img
              src={logo}
              alt="Arcana Logo"
              className="md:w-72 w-64"
              draggable={false}
            />
            <div className="flex items-center gap-1 justify-end pr-3 -mt-2">
              <span className="font-accent font-thin md:text-xl text-lg mb-0.5">
                for
              </span>
              <img
                src={asana}
                alt="Asana Logo"
                className="md:w-20 w-18"
                draggable={false}
              />
            </div>
          </div>
          <p className="font-accent text-muted-foreground md:text-lg text-base font-extralight select-none">
            ar<span className="mx-0.5 font-normal">·</span>ca
            <span className="mx-0.5 font-normal">·</span>num - a profound secret
            or mystery
          </p>
          <ul className="text-left border border-border/60 rounded-xl bg-background/60 divide-y w-full">
            {content.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="flex items-center gap-4 py-4 px-6"
                >
                  <Icon
                    weight="duotone"
                    className="text-foreground/80 size-6 md:size-7 shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="font-medium leading-none md:text-base text-sm">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <LoginDialog>
            <Button
              size="lg"
              className="md:min-w-44 min-w-52 select-none rounded-lg"
            >
              Start Now
            </Button>
          </LoginDialog>
        </div>
      </main>
    </>
  );
}

export default Page;
