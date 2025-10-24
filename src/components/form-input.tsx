'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FormFieldType } from '@/types/form-field-type';
import { FileIcon } from 'lucide-react';
import { useRef } from 'react';
import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import InputImage from './input-image';
import { DatePicker, TimePicker } from './ui/date-picker';
import { DateTimePicker } from './ui/datetime-picker';

interface Option {
  label: string;
  value: string;
}

interface FormInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  type: FormFieldType;
  disabled?: boolean;
  required?: boolean;
  options?: Option[];
  previousImage?: string;
  className?: string; // Custom styling untuk setiap field
  onChange?: (value: any) => void; // Custom onChange handler
  value?: any;
}

export const FormInput = <T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  type,
  disabled = false,
  required = false,
  options = [],
  previousImage,
  className,
  onChange,
  value,
}: FormInputProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const renderField = (field: ControllerRenderProps<T, Path<T>>) => {
    switch (type) {
      case FormFieldType.TEXT:
      case FormFieldType.EMAIL:
        return (
          <Input
            placeholder={placeholder || `Input ${label || name}`}
            {...field}
            type={type}
            disabled={disabled}
            className={cn('w-full flex-1 appearance-none', className)}
          />
        );

      case FormFieldType.NUMBER:
        return (
          <Input
            placeholder={placeholder || `Input ${label || name}`}
            {...field}
            type="text"
            inputMode="numeric"
            disabled={disabled}
            className={cn('w-full appearance-none', className)}
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== 'Backspace' &&
                e.key !== 'Delete' &&
                e.key !== 'Tab' &&
                !e.key.includes('Arrow')
              ) {
                e.preventDefault();
              }
            }}
          />
        );

      case FormFieldType.TEXTAREA:
        return (
          <Textarea
            placeholder={placeholder || `Input ${label || name}`}
            {...field}
            disabled={disabled}
            className={cn('w-full', className)}
          />
        );

      case FormFieldType.SELECT:
        return (
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger className={cn('w-full dark:text-neutral-400', className)}>
              <SelectValue placeholder={placeholder || `${label || name}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem className="dark:text-neutral-400" key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case FormFieldType.RADIO:
        return (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className={cn('flex gap-4', className)}
          >
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} disabled={disabled} />
                <label htmlFor={`${name}-${opt.value}`}>{opt.label}</label>
              </div>
            ))}
          </RadioGroup>
        );

      case FormFieldType.FILE:
        return (
          <div
            className={cn(
              'flex h-9 w-full cursor-pointer items-center justify-start overflow-hidden rounded-md border',
              className,
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                field.onChange(file ?? undefined);
              }}
              disabled={disabled}
            />
            <div className="flex h-full items-center justify-center border-r bg-slate-100 px-3">
              <FileIcon className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex h-full flex-grow items-center px-3">
              {field.value?.name ? (
                <p className="line-clamp-1 text-sm text-gray-700">{field.value.name}</p>
              ) : (
                <p className="text-sm text-gray-500">{placeholder || 'No file chosen'}</p>
              )}
            </div>
          </div>
        );

      case FormFieldType.IMAGE:
        return (
          <InputImage
            value={field.value}
            previousImage={previousImage}
            disabled={disabled}
            onChange={(file) => {
              // Store File object directly in form state for upload
              if (file && typeof file === 'object' && file.file instanceof File) {
                field.onChange(file.file);
              } else {
                field.onChange(undefined);
              }
            }}
          />
        );

      case FormFieldType.DATETIME:
        return (
          <DateTimePicker
            value={value ?? field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
              onChange?.(newValue);
            }}
            disabled={disabled}
            placeholder={placeholder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="h-16">
          {label && (
            <FormLabel className="capitalize">
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl className="w-full">{renderField(field)}</FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
