'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.replace(/^\/u/, '').split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/u/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;

    return (
      <BreadcrumbItem key={segment}>
        {!isLast ? (
          <>
            <BreadcrumbLink href={href} className="capitalize">
              {segment.replace(/-/g, ' ')}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </>
        ) : (
          <BreadcrumbPage className="capitalize">{segment.replace(/-/g, ' ')}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
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
