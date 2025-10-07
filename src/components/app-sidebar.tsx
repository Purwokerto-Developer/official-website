"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { sidebarItems } from "@/constants"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session?: any
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarItems.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarItems.navMain} />
        {/* <NavProjects projects={sidebarItems.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
