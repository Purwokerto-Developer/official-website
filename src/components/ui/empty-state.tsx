'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from './button';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  heightClassName?: string;
  iconSrc?: string;
  iconAlt?: string;
  iconNode?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  heightClassName = 'h-[380px]',
  iconSrc = '/img-logo.png',
  iconAlt = 'Logo',
  iconNode,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('flex flex-col items-center justify-center text-center', heightClassName, className)}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-sky-950">
        {iconNode ?? <Image src={iconSrc} width={60} height={60} alt={iconAlt} />}
      </div>
      <h2 className="mt-4 text-base font-semibold text-gray-800 dark:text-neutral-100">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-neutral-400">{description}</p>
      ) : null}
      {actionLabel ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  );
}

export default EmptyState;


