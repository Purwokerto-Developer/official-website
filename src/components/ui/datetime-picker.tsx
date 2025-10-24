'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'iconsax-reactjs';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
  placeholder = 'Pick a date and time',
}: DateTimePickerProps) {
  const normalizeValue = (v?: Date | string) => {
    if (!v) return undefined;
    if (v instanceof Date) return Number.isFinite(v.getTime()) ? v : undefined;
    try {
      const parsed = new Date(String(v));
      return Number.isFinite(parsed.getTime()) ? parsed : undefined;
    } catch {
      return undefined;
    }
  };

  const initialDate = normalizeValue(value);
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [timeValue, setTimeValue] = useState<string>(
    initialDate ? format(initialDate, 'HH:mm') : '',
  );

  // Instead of automatically propagating on every render, only propagate when
  // the user explicitly selects a date or changes the time input. This avoids
  // feedback loops caused by parent updates feeding back into local state.
  const propagateIfNeeded = (d: Date | undefined, t: string) => {
    if (!d) return;
    // Only propagate when both date and a valid time (HH:mm) are present
    if (!t || !/^\d{2}:\d{2}$/.test(t)) return;

    const [hoursRaw, minutesRaw] = t.split(':');
    const hours = parseInt(hoursRaw, 10);
    const minutes = parseInt(minutesRaw, 10);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0, 0);

    const incoming = normalizeValue(value as any);
    if (!incoming || newDate.getTime() !== incoming.getTime()) {
      onChange(newDate);
    }
  };

  // Update local state when prop changes, but only when it's actually different
  useEffect(() => {
    const incoming = normalizeValue(value);
    if (!incoming) return;

    if (!date || incoming.getTime() !== date.getTime()) {
      setDate(incoming);
    }

    const formatted = format(incoming, 'HH:mm');
    if (formatted !== timeValue) setTimeValue(formatted);
  }, [value]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    // propagate only when a date already selected
    if (date) propagateIfNeeded(date, newTime);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <Calendar variant="Bulk" size={16} className="mr-2" />
            {date ? format(date, 'MMM dd, yyyy') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              propagateIfNeeded(d, timeValue);
            }}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
      <div className="relative w-full">
        <Input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled}
          className="pl-10"
          placeholder="select time"
        />
      </div>
    </div>
  );
}
