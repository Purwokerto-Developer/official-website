'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type SimpleColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
  swatches?: string[];
  className?: string;
  buttonClassName?: string;
};

const DEFAULT_SWATCHES = [
  '#1F2937', // gray-800
  '#374151', // gray-700
  '#4B5563', // gray-600
  '#DC2626', // red-600
  '#EA580C', // orange-600
  '#CA8A04', // yellow-600
  '#16A34A', // green-600
  '#059669', // emerald-600
  '#0D9488', // teal-600
  '#2563EB', // blue-600
  '#4F46E5', // indigo-600
  '#7C3AED', // violet-600
  '#DB2777', // pink-600
  '#D97706', // amber-600
];

function normalizeHex(input: string): string | null {
  if (!input) return null;
  let v = input.trim().toUpperCase();
  if (!v.startsWith('#')) v = `#${v}`;
  // Allow 3 or 6 hex digits
  const hex = v.replace('#', '');
  if (/^[0-9A-F]{3}$/.test(hex)) {
    // expand #RGB -> #RRGGBB
    const r = hex[0];
    const g = hex[1];
    const b = hex[2];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^[0-9A-F]{6}$/.test(hex)) {
    return `#${hex}`;
  }
  return null;
}

export function SimpleColorPicker({
  value,
  onChange,
  swatches = DEFAULT_SWATCHES,
  className,
  buttonClassName,
}: SimpleColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState(value);

  React.useEffect(() => {
    setInput(value);
  }, [value]);

  const handleInputChange = (v: string) => {
    setInput(v);
    const normalized = normalizeHex(v);
    if (normalized) {
      onChange(normalized);
    }
  };

  const current = normalizeHex(value) ?? '#3B82F6';

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'bg-background text-foreground w-full justify-start gap-3',
              'border-input border',
              buttonClassName,
            )}
            aria-label="Open color picker"
          >
            <span
              aria-hidden
              className="border-input h-5 w-5 rounded-sm border"
              style={{ backgroundColor: current }}
            />
            <span className="text-sm">{current}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="start" sideOffset={8}>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Recommended</Label>
              <div className="grid grid-cols-7 gap-2">
                {swatches.map((c) => {
                  const isActive = normalizeHex(c) === current;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Pick ${c}`}
                      onClick={() => onChange(normalizeHex(c) ?? c)}
                      className={cn(
                        'h-7 w-7 rounded-sm border',
                        isActive ? 'border-foreground' : 'border-input',
                      )}
                      style={{ backgroundColor: c }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="bg-border h-px w-full" />

            <div className="space-y-2">
              <Label htmlFor="hex-input" className="text-xs">
                HEX
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="hex-input"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#3B82F6"
                  className="font-mono"
                />
                <input
                  aria-label="Color input"
                  type="color"
                  value={current}
                  className="h-10 w-10 overflow-hidden rounded-full"
                  onChange={(e) => onChange(e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
