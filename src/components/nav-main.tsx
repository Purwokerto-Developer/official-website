'use client';

import { ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { NavItem } from '@/types/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const allowedVariants = ['default', 'secondary', 'destructive', 'outline', 'green', 'yellow'];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = !!item.items?.length;
          const isActive = item.url === pathname;

          return (
            <SidebarMenuItem key={item.title}>
              {hasSubItems ? (
                <Collapsible defaultOpen={isActive} className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && (
                        <item.icon
                          size="20"
                          variant={isActive ? 'Bold' : 'Bulk'}
                          className={cn(
                            isActive
                              ? 'text-primary dark:text-primary'
                              : 'text-slate-500 dark:text-slate-200',
                          )}
                        />
                      )}
                      <span className="flex items-center gap-2">
                        {item.title}
                        {item.badge && (
                          <Badge
                            variant={
                              allowedVariants.includes(item.badge?.variant as string)
                                ? (item.badge?.variant as
                                    | 'default'
                                    | 'secondary'
                                    | 'destructive'
                                    | 'outline')
                                : 'secondary'
                            }
                            className="text-[10px] uppercase"
                          >
                            {item.badge.label}
                          </Badge>
                        )}
                      </span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const subIsActive = subItem.url === pathname;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span
                                  className={cn(
                                    'flex items-center gap-2',
                                    subIsActive && 'text-primary',
                                  )}
                                >
                                  {subItem.title}
                                  {subItem.badge && (
                                    <Badge
                                      variant={
                                        allowedVariants.includes(subItem.badge?.variant as string)
                                          ? (subItem.badge?.variant as
                                              | 'default'
                                              | 'secondary'
                                              | 'destructive'
                                              | 'outline')
                                          : 'default'
                                      }
                                      className="text-[10px] uppercase"
                                    >
                                      {subItem.badge.label}
                                    </Badge>
                                  )}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link
                    href={item.url}
                    className={cn(
                      'flex items-center gap-2 text-lg',
                      isActive &&
                        'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-bold',
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size="20"
                        variant={isActive ? 'Bold' : 'Bulk'}
                        className={cn(
                          isActive
                            ? 'text-primary dark:text-primary'
                            : 'text-slate-500 dark:text-slate-200',
                        )}
                      />
                    )}
                    <span className="flex items-center gap-2">
                      {item.title}
                      {item.badge && (
                        <Badge
                          variant={
                            allowedVariants.includes(item.badge?.variant as string)
                              ? (item.badge?.variant as
                                  | 'default'
                                  | 'secondary'
                                  | 'destructive'
                                  | 'outline')
                              : 'secondary'
                          }
                          className="text-[10px] uppercase"
                        >
                          {item.badge.label}
                        </Badge>
                      )}
                    </span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
