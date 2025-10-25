'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar2, Clock } from 'iconsax-reactjs';

export function DatePicker({
  value,
  onChange,
  disabled,
  className,
}: {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start font-normal', className)}
          disabled={disabled}
        >
          <Calendar2 size="32" variant="Bulk" className="text-primary" />
          {value ? value.toLocaleDateString() : 'Select date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (onChange) onChange(date);
            setOpen(false);
          }}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

export function TimePicker({
  value,
  onChange,
  disabled,
  className,
}: {
  value?: string;
  onChange?: (time: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [hour, setHour] = React.useState('');
  const [minute, setMinute] = React.useState('');

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHour(h);
      setMinute(m);
    }
  }, [value]);

  const handleApply = () => {
    if (onChange) onChange(`${hour}:${minute}`);
    setOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(className)}>
        <Button
          variant="outline"
          className={cn('w-full justify-start font-normal', className)}
          disabled={disabled}
        >
          <Clock size="32" variant="Bulk" className="text-primary" />
          {hour && minute ? `${hour}:${minute}` : 'Select time'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 space-y-3 p-3" align="start">
        <div className="flex items-center justify-between gap-3">
          <div className="flex w-1/2 flex-col">
            <label className="text-muted-foreground mb-1 text-xs">Hour</label>
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="h-8 rounded border text-sm"
            >
              <option value="" disabled>
                HH
              </option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-1/2 flex-col">
            <label className="text-muted-foreground mb-1 text-xs">Minute</label>
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="h-8 rounded border text-sm"
            >
              <option value="" disabled>
                MM
              </option>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          className="mt-2 w-full"
          onClick={handleApply}
          disabled={!hour || !minute}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
}
