import { api } from "@convex/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { convexQuery } from "@convex-dev/react-query";
import { SignOutIcon, UserIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import AsanaIcon from "@/assets/asana-icon.svg?react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { type Gradient, getGradientClasses } from "@/lib/colors";
import { cn } from "@/lib/utils";

export default function UserMenu() {
  const { data: userData } = useQuery(
    convexQuery(api.core.accounts.getUser, {}),
  );
  const { signOut } = useAuthActions();

  const profileColors =
    (userData?.profileColors as Gradient) || (["fuchsia", "amber"] as const);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent rounded-full focus-visible:ring-2"
        >
          <Avatar className="size-9 md:size-8">
            <AvatarFallback
              className={cn(
                "bg-linear-to-br",
                getGradientClasses(profileColors),
              )}
            >
              <UserIcon className="size-5 text-white/90" weight="bold" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          {userData ? (
            <>
              <span className="text-foreground truncate text-xl font-accent font-light">
                {userData.name}
              </span>
              <span className="text-muted-foreground truncate text-xs font-normal">
                {userData.email}
              </span>
            </>
          ) : (
            <UserLabelSkeleton />
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Connections</DropdownMenuLabel>
        <DropdownMenuGroup>
          <UserConnections />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <SignOutIcon
            size={16}
            weight="bold"
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserConnections() {
  const { data: connections, isPending } = useQuery(
    convexQuery(api.core.connections.getUserConnections, {}),
  );

  if (isPending) {
    return <ConnectionsSkeleton />;
  }

  if (!connections || connections.length === 0) {
    return (
      <DropdownMenuItem disabled>
        <span className="text-muted-foreground">No connections</span>
      </DropdownMenuItem>
    );
  }

  return connections.map((connection) => (
    <DropdownMenuItem key={connection.asanaUserId}>
      <AsanaIcon className="size-3 mx-0.5 opacity-60" aria-hidden="true" />
      <span className="truncate text-muted-foreground">
        {connection.asanaUserEmail}
      </span>
    </DropdownMenuItem>
  ));
}

function ConnectionsSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

function UserLabelSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-1 py-0.5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-36" />
    </div>
  );
}
