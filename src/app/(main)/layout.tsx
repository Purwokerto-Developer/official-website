import { AppSidebar } from '@/components/app-sidebar';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getServerSession } from '@/lib/better-auth/get-session';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';

export const metadata: Metadata = {
  title: 'Purwokerto Dev',
  description: 'Community for developer in Purwokerto',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const user = session?.user;
  if (!user) {
    redirect('/login');
  }
  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
          </div>
          <div className="mx-4 flex items-center gap-2">
            <AnimatedThemeToggler />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
