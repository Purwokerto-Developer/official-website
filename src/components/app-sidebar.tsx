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
import { auth } from "@/lib/auth"
type Session = typeof auth.$Infer.Session;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session?: Session
}


export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const user = session?.user

  if (!user) {
    return null
  }
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarItems.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarItems.navMain} />
        {/* <NavProjects projects={sidebarItems.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
