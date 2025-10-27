'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const HeavyLanyard = dynamic(() => import('./lanyard-heavy'), {
  ssr: false,
  loading: () => <div style={{ height: 420 }} className="w-full" />,
});

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
}: {
  user?: { firstName?: string; username?: string };
  cardColor?: string;
}) {
  const initials =
    (user?.firstName || '')
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';
  return (
    <div style={{ height: 500 }} className="flex w-full items-center justify-center">
      <div className="relative w-full max-w-sm">
        <div style={{ background: cardColor }} className="h-40 w-full rounded-md shadow-md" />
        <div className="absolute top-4 left-4 font-bold text-white">
          {user?.firstName || 'User'}
        </div>
        <div className="absolute top-4 right-4 text-sm text-white/70">{user?.username || ''}</div>
        <div className="absolute bottom-4 left-4 text-xs text-white/60">{initials}</div>
      </div>
    </div>
  );
}

export default function LanyardWrapper(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 640);
    }
  }, []);

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
  if (shouldSimplify) return <Lightweight user={props.user} cardColor={props.cardColor} />;

  return <HeavyLanyard {...props} />;
}
