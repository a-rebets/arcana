import "./index.css";

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

function Page() {
  return (
    <>
      <StarsBackground
        starColor="#FFF"
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]",
        )}
      />
      <main className="container mx-auto p-8 text-center relative z-10 flex flex-col min-h-full justify-center items-center pointer-events-none welcome-layout">
        <div className="flex flex-col justify-center items-center gap-8 bg-background/90 rounded-xl p-8 w-[40rem] pointer-events-auto shadow-[inset_0_-56px_80px_-48px_rgb(0_0_0_/_.5)]">
          <div className="select-none">
            <img
              src={logo}
              alt="Arcana Logo"
              className="w-72"
              draggable={false}
            />
            <div className="flex items-center gap-1 justify-end pr-3 -mt-2">
              <span className="font-accent font-thin text-xl mb-0.5">for</span>
              <img
                src={asana}
                alt="Asana Logo"
                className="w-20"
                draggable={false}
              />
            </div>
          </div>
          <p className="font-accent text-muted-foreground text-lg font-extralight select-none">
            ar<span className="mx-0.5 font-normal">·</span>ca
            <span className="mx-0.5 font-normal">·</span>num - a profound secret
            or mystery
          </p>
          <div className="w-full">
            <ul className="text-left border border-border/60 rounded-xl bg-background/60 divide-y">
              <li className="flex items-center gap-4 py-4 px-6">
                <ChatCircleDotsIcon
                  size={28}
                  weight="duotone"
                  className="text-foreground/80"
                />
                <div>
                  <p className="font-medium leading-none">
                    Chat with your work
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Natural conversations as your main interface.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4 py-4 px-6">
                <BinocularsIcon
                  size={28}
                  weight="duotone"
                  className="text-foreground/80"
                />
                <div>
                  <p className="font-medium leading-none">AI-driven insights</p>
                  <p className="text-sm text-muted-foreground">
                    Visualize Asana data instantly — get trends and insights at
                    a glance.
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4 py-4 px-6">
                <PlugsIcon
                  size={28}
                  weight="duotone"
                  className="text-foreground/80"
                />
                <div>
                  <p className="font-medium leading-none">
                    Plugs into any workspace
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Asana today; Google Calendar and more soon.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <LoginDialog>
            <Button size="lg" className="min-w-40 select-none">
              Start Now
            </Button>
          </LoginDialog>
        </div>
      </main>
    </>
  );
}

export default Page;
