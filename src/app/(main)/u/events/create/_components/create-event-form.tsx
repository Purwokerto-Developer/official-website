'use client';

import { createEventWithImage } from '@/action/event-action';
import { FormInput } from '@/components/form-input';
import { Form } from '@/components/ui/form';
import { FormFieldType } from '@/types/form-field-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddCategoryModal from '../../categories/_components/add-category-modal';
import { Button } from '@/components/ui/button';
import { Additem } from 'iconsax-reactjs';
import { DatePicker, TimePicker } from '@/components/ui/date-picker';
import { showToast } from '@/components/custom-toaster';
import { slugify } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useFormOptions } from '@/lib/swr';

const eventSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title max 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description max 1000 characters'),
  location_name: z.string().min(2, 'Location name is required'),
  location_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  event_type: z.enum(['online', 'offline'], 'Event type is required'),
  category_id: z.string().min(1, 'Category is required'),
  collaborator_id: z.string().optional(),
  image: z.custom<File>((val) => {
    return val instanceof File && val.size > 0;
  }, 'Image is required'),
}).superRefine((val, ctx) => {
  if (val.event_type === 'online') {
    if (!val.location_name || val.location_name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['location_name'],
        message: 'Meeting name is required for online events',
      });
    }
    if (!val.location_url || val.location_url.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['location_url'],
        message: 'Meeting link is required for online events',
      });
    }
  } else if (val.event_type === 'offline') {
    if (!val.location_name || val.location_name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['location_name'],
        message: 'Location name is required for offline events',
      });
    }
  }
});

type FormData = z.infer<typeof eventSchema>;

export default function CreateEventForm() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      event_type: 'online',
      category_id: '',
      collaborator_id: '',
      image: undefined,
      location_name: '',
      location_url: '',
    },
  });

  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const eventType = form.watch('event_type');

  // Clear fields when switching event type
  const handleEventTypeChange = (newType: 'online' | 'offline') => {
    if (newType === 'online') {
      // Clear location fields for online events
      form.setValue('location_name', '');
      form.setValue('location_url', '');
    } else {
      // Clear location fields for offline events
      form.setValue('location_name', '');
      form.setValue('location_url', '');
    }
  };
  
  // Use SWR for data fetching
  const { categoryOptions, userOptions, isLoading: optionsLoading, refresh } = useFormOptions();
  
  // Fixed validation logic - no more infinite loop
  const isFormValid = useMemo(() => {
    return form.formState.isValid && 
      !!date && 
      !!time &&
      !!form.getValues('location_name');
  }, [form.formState.isValid, date, time]);

  // ✅ Submit pakai FormData langsung
  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description ?? '');
    formData.append('location_name', data.location_name);
    if (data.location_url) formData.append('location_url', data.location_url);
    formData.append('event_type', data.event_type);
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.collaborator_id) formData.append('collaborator_id', data.collaborator_id);
    formData.append('start_time', date?.toISOString() ?? new Date().toISOString());
    formData.append('image', data.image);

    startTransition(async () => {
      const result = await createEventWithImage(formData);
      if (result.success) {
        showToast('success', 'Event created successfully!');
        form.reset();
        setDate(new Date());
        setTime('08:00');
        const created = Array.isArray(result.data) && result.data.length > 0 ? result.data[0] : null;
        const slug = created?.title ? slugify(created.title) : slugify(data.title);
        router.push(`/u/events/detail/${slug}`);
      } else {
        showToast('error', result.error || 'Failed to create event.');
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full px-4 pt-5 pb-72 sm:px-8 md:pb-28 lg:px-10 lg:pb-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Create new event</h1>
              <p className="text-sm text-slate-500">Create a new PurwokertoDev event</p>
            </div>
            <Button
              variant="gradient_blue"
              type="submit"
              disabled={!isFormValid || isPending}
              className="hidden md:flex"
            >
              <Additem size="32" variant="Bulk" />
              {isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>

          {/* Form Inputs */}
          <FormInput
            form={form}
            name="title"
            type={FormFieldType.TEXT}
            placeholder="Judul Event"
            required
          />

          <FormInput
            form={form}
            name="event_type"
            type={FormFieldType.SELECT}
            className='dark:text-white'
            options={[
              { label: 'Online', value: 'online' },
              { label: 'Offline', value: 'offline' },
            ]}
            required
            onChange={(value) => {
              form.setValue('event_type', value as 'online' | 'offline');
              handleEventTypeChange(value as 'online' | 'offline');
            }}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormInput
              form={form}
              name="location_name"
              placeholder={eventType === 'online' ? 'Meeting name (e.g. Google Meet Room)' : 'Location name (e.g. Gedung Soedirman)'}
              type={FormFieldType.TEXT}
              required
            />
            <FormInput
              form={form}
              name="location_url"
              placeholder={eventType === 'online' ? 'Meeting link (URL)' : 'Google Maps URL'}
              type={FormFieldType.TEXT}
              required={eventType === 'online'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DatePicker value={date} onChange={setDate} />
            <TimePicker value={time} onChange={setTime} />
          </div>

          <FormInput
            form={form}
            name="description"
            type={FormFieldType.TEXTAREA}
            placeholder="Tulis deskripsi event..."
            required
          />

          <div className="flex items-start gap-3">
            <FormInput
              form={form}
              name="category_id"
              placeholder="Select Category"
              type={FormFieldType.SELECT}
              options={categoryOptions}
              required
            />
            <AddCategoryModal onSuccess={refresh} label="Add new" />
          </div>

          <FormInput
            form={form}
            name="collaborator_id"
            placeholder="Speaker/Collaborator"
            type={FormFieldType.SELECT}
            options={userOptions}
          />

          <FormInput form={form} name="image" type={FormFieldType.IMAGE} />

          {/* Mobile Button */}
          <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/90 dark:supports-[backdrop-filter]:bg-neutral-900/60 md:hidden">
            <Button
              type="submit"
              disabled={!isFormValid || isPending}
              variant="gradient_blue"
              className="w-full"
            >
              <Additem size="20" variant="Bulk" />
              {isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
