'use client';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { TeamItem } from '@/types/sidebar';
import { Verify } from 'iconsax-reactjs';
import Image from 'next/image';

export function TeamSwitcher({ teams }: { teams: TeamItem[] }) {
  const activeTeam = teams[0];

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="bg-sidebar-accent text-sidebar-accent-foreground cursor-default"
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
            <div className="flex items-center justify-start gap-1 truncate font-medium">
              {activeTeam.name}{' '}
              <Verify
                size="15"
                className="mt-1 text-[50px] text-green-500 dark:text-green-500"
                variant="Bulk"
              />
            </div>
            <span className="text-muted-foreground truncate text-xs">{activeTeam.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
