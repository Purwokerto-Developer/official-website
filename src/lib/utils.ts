import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Indonesian format (e.g. 14 Oktober 2025)
 * @param date Date object or string
 * @param options Intl.DateTimeFormatOptions
 */
export function formatDateID(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(options || {}),
  });
}

// Slug helpers
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function deslugify(slug: string): string {
  return decodeURIComponent(slug.replace(/-/g, ' ')).trim();
}

/**
 * Combine date and time into a single Date in the local timezone.
 *
 * - `date` can be a Date instance, a string in `YYYY-MM-DD` format, or undefined.
 * - `time` should be a string `HH:mm`.
 *
 * Returns a Date constructed with local timezone values (so `toISOString()` will
 * represent the correct instant for the user's local input).
 */
export function combineDateAndTime(date?: Date | string, time?: string): Date {
  let base: Date;
  if (!date) {
    base = new Date();
  } else if (typeof date === 'string') {
    const parts = date.split('-').map((v) => parseInt(v, 10));
    const y = parts[0] || new Date().getFullYear();
    const m = parts[1] ? parts[1] - 1 : 0;
    const d = parts[2] || 1;
    base = new Date(y, m, d);
  } else {
    base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  if (time && /^\d{2}:\d{2}$/.test(time)) {
    const [hh, mm] = time.split(':').map((v) => parseInt(v, 10));
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      base.setHours(hh, mm, 0, 0);
    }
  }

  return base;
}
