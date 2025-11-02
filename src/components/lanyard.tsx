'use client';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

type Props = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  user?: { firstName: string; username?: string };
  cardColor?: string;
  cardTexture?: any;
  simplified?: boolean;
};

function Lightweight({
  user,
  cardColor,
  isMobile,
}: {
  user?: { firstName?: string; username?: string };
  cardColor?: string;
  isMobile?: boolean;
}) {
  const initials =
    (user?.firstName || '')
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';
  return (
    <div style={{ height: 500 }} className="flex w-full items-center justify-center px-4">
      <div className="relative w-full max-w-xs sm:max-w-sm">
        <div
          style={{ background: cardColor }}
          className="h-36 w-full overflow-hidden rounded-lg shadow-md sm:h-40"
        />
        <div className="absolute top-3 left-3 text-sm font-bold text-white sm:top-4 sm:left-4 sm:text-base">
          {user?.firstName || 'User'}
        </div>
        <div className="absolute top-3 right-3 text-xs text-white/70 sm:top-4 sm:right-4 sm:text-sm">
          {user?.username || ''}
        </div>
        <div className="absolute bottom-3 left-3 text-xs text-white/60">{initials}</div>
      </div>
    </div>
  );
}

export default function LanyardWrapper(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = useMediaQuery('(max-width: 640px)');

  const deviceMemory =
    typeof navigator !== 'undefined' && (navigator as any).deviceMemory
      ? (navigator as any).deviceMemory
      : 4;
  const hardwareConcurrency =
    typeof navigator !== 'undefined' && (navigator as any).hardwareConcurrency
      ? (navigator as any).hardwareConcurrency
      : 4;
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shouldSimplify =
    props.simplified ??
    (isMobile || deviceMemory <= 1 || hardwareConcurrency <= 2 || prefersReducedMotion);

  if (!mounted) return <div style={{ height: 500 }} className="w-full" />;
  if (shouldSimplify)
    return <Lightweight user={props.user} cardColor={props.cardColor} isMobile={isMobile} />;

  // Heavy lanyard removed to avoid loading large 3D/physics bundles on navigation.
  // Always render the lightweight placeholder instead.
  return <Lightweight user={props.user} cardColor={props.cardColor} isMobile={isMobile} />;
}
