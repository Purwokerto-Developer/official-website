"use client";

import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TeamItem } from "@/types/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { ShieldTick, Verify } from "iconsax-reactjs";

export function TeamSwitcher({ teams }: { teams: TeamItem[] }) {
  const activeTeam = teams[0];

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default bg-sidebar-accent text-sidebar-accent-foreground"
        >
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src={activeTeam.logo}
              alt={activeTeam.name}
              height={32}
              width={32}
              className="rounded-md"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{activeTeam.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {activeTeam.plan}
            </span>
          </div>
          <ShieldTick
            className="text-green-500 dark:text-green-500 text-[50px]"
            variant="Bulk"
          />{" "}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
