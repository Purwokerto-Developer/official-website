import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, value, defaultValue, ...props }: React.ComponentProps<'input'>) {
  // To avoid React "uncontrolled -> controlled" warnings when a value
  // can be undefined initially and later become defined, normalize the
  // value passed to the native input. If a consumer doesn't provide a
  // `value` but provides a `defaultValue`, use that. Otherwise fall back
  // to an empty string so the input is consistently controlled.
  const normalizedValue = value ?? defaultValue ?? '';

  return (
    <input
      type={type}
      data-slot="input"
      value={normalizedValue as any}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
