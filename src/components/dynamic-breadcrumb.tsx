'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.replace(/^\/u/, '').split('/').filter(Boolean);

  let breadcrumbs: React.ReactNode[] = [];
  if (segments.length <= 2) {
    breadcrumbs = segments.map((segment, index) => {
      const href = '/u/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      return (
        <BreadcrumbItem key={segment} className="flex max-w-[120px] sm:max-w-[180px] lg:max-w-none">
          {!isLast ? (
            <>
              <BreadcrumbLink
                href={href}
                className="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-nowrap capitalize"
                style={{ display: 'block' }}
              >
                {segment.replace(/-/g, ' ')}
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </>
          ) : (
            <BreadcrumbPage
              className="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-nowrap capitalize"
              style={{ display: 'block' }}
            >
              {segment.replace(/-/g, ' ')}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
      );
    });
  } else {
    const first = segments[0];
    const last = segments[segments.length - 1];
    breadcrumbs = [
      <BreadcrumbItem
        key={first}
        className="line-clamp-1 flex max-w-[120px] flex-nowrap sm:max-w-[180px] lg:max-w-none"
      >
        <BreadcrumbLink
          href={'/u/' + first}
          className="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-nowrap capitalize"
          style={{ display: 'block' }}
        >
          {first.replace(/-/g, ' ')}
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>,
      <BreadcrumbEllipsis key="ellipsis" />,
      <BreadcrumbItem key={last} className="flex max-w-[120px] sm:max-w-[180px] lg:max-w-none">
        <BreadcrumbSeparator />
        <BreadcrumbPage
          className="line-clamp-1 w-full overflow-hidden text-ellipsis whitespace-nowrap capitalize"
          style={{ display: 'block' }}
        >
          {last.replace(/-/g, ' ')}
        </BreadcrumbPage>
      </BreadcrumbItem>,
    ];
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap overflow-x-auto whitespace-nowrap">
        {breadcrumbs.length > 0 ? (
          breadcrumbs
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Purwokerto Dev</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
