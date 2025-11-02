import { AppSidebar } from '@/components/app-sidebar';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { isAuthenticated } from '@/lib/better-auth/get-session';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Purwokerto Dev',
  description: 'Community for developer in Purwokerto',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await isAuthenticated();

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* Make the inset full viewport height and let the children area scroll */}
      <SidebarInset>
        <div className="relative flex max-h-[95vh] min-h-[95vh] flex-col overflow-hidden">
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

          <main className="hide-scrollbar h-full min-h-full flex-1 overflow-auto scroll-smooth p-4 pt-0 pb-10">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
