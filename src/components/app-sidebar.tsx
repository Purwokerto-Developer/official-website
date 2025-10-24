'use client';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import * as React from 'react';

import { sidebarItems } from '@/constants';
import { Session } from '@/types/better-auth';
import { Separator } from './ui/separator';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session?: Session;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const user = session?.user;

  if (!user || !session) {
    return null;
  }
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarItems.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems.navMain} label="Main Navigation" />
        {user.role === 'admin' && (
          <>
            <Separator />
            <NavMain items={sidebarItems.adminNav} label="Admin Navigation" />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
