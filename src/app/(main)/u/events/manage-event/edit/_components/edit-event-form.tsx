'use client';

import { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/form-input';
import { FormFieldType } from '@/types/form-field-type';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, TimePicker } from '@/components/ui/date-picker';
import { showToast } from '@/components/custom-toaster';
import { updateEventWithImage } from '@/action/event-action';
import { slugify } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import AddCategoryModal from '../../../categories/_components/add-category-modal';
import { useFormOptions } from '@/lib/swr';

const schema = z
  .object({
    title: z.string().min(5),
    description: z.string().min(10),
    event_type: z.enum(['online', 'offline']),
    category_id: z.string().min(1),
    collaborator_id: z.string().optional(),
    location_name: z.string().min(2, 'Location name is required'),
    location_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    image: z.any().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.event_type === 'online') {
      if (!val.location_name || val.location_name.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['location_name'], message: 'Meeting name is required for online events' });
      }
      if (!val.location_url || val.location_url.trim().length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['location_url'], message: 'Meeting link is required for online events' });
      }
    } else if (val.event_type === 'offline') {
      if (!val.location_name || val.location_name.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['location_name'], message: 'Location name is required for offline events' });
      }
    }
  });

type FormData = z.infer<typeof schema>;
type Props = { initial: any; id: string };

export default function EditEventForm({ initial, id }: Props) {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: initial.title,
      description: initial.description ?? '',
      event_type: initial.event_type,
      category_id: initial.category_id ?? '',
      collaborator_id: initial.collaborator_id ?? '',
      location_name: initial.location_name ?? '',
      location_url: initial.location_url ?? '',
    },
  });

  const [date, setDate] = useState<Date | undefined>(new Date(initial.start_time));
  const initialTime = (() => {
    try {
      const d = new Date(initial.start_time);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    } catch {
      return undefined;
    }
  })();
  const [time, setTime] = useState<string | undefined>(initialTime);
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

  const combineDateAndTime = (d?: Date, t?: string) => {
    const base = d ? new Date(d) : new Date();
    if (t && /^\d{2}:\d{2}$/.test(t)) {
      const [hh, mm] = t.split(':').map((v) => parseInt(v, 10));
      base.setHours(hh);
      base.setMinutes(mm);
      base.setSeconds(0);
      base.setMilliseconds(0);
    }
    return base;
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description ?? '');
    formData.append('location_name', data.location_name);
    if (data.location_url) formData.append('location_url', data.location_url);
    formData.append('event_type', data.event_type);
    formData.append('category_id', data.category_id);
    if (data.collaborator_id) formData.append('collaborator_id', data.collaborator_id);
    const combined = combineDateAndTime(date, time);
    formData.append('start_time', combined.toISOString());
    if ((data as any).image) formData.append('image', (data as any).image);

    startTransition(async () => {
      const res = await updateEventWithImage(id, formData);
      if (res.success) {
        showToast('success', 'Event updated successfully');
        router.push(`/u/events/detail/${slugify(data.title)}`);
      } else {
        showToast('error', res.error || 'Failed to update event');
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full px-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit event</h1>
              <p className="text-sm text-slate-500">Update an existing PurwokertoDev event</p>
            </div>
            <Button variant="gradient_blue" type="submit" disabled={!isFormValid || isPending} className="hidden md:flex">
              Save Changes
            </Button>
          </div>

          <FormInput form={form} name="title" type={FormFieldType.TEXT} placeholder="Judul Event" required />

          <FormInput
            form={form}
            name="event_type"
            type={FormFieldType.SELECT}
            options={[{ label: 'Online', value: 'online' }, { label: 'Offline', value: 'offline' }]}
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

          <FormInput form={form} name="description" type={FormFieldType.TEXTAREA} placeholder="Tulis deskripsi event..." required />

          <div className="flex items-start gap-3">
            <FormInput form={form} name="category_id" placeholder="Select Category" type={FormFieldType.SELECT} options={categoryOptions} required />
            <AddCategoryModal onSuccess={refresh} label="Add new" />
          </div>

          <FormInput form={form} name="collaborator_id" placeholder="Speaker/Collaborator" type={FormFieldType.SELECT} options={userOptions} />
          <FormInput form={form} name="image" type={FormFieldType.IMAGE} />

          <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-900/90 dark:supports-[backdrop-filter]:bg-neutral-900/60 md:hidden">
            <Button type="submit" disabled={!isFormValid || isPending} variant="gradient_blue" className="w-full">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


