'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/form-input';
import { FormFieldType } from '@/types/form-field-type';
import { showToast } from '@/components/custom-toaster';
import { updateEventWithImage } from '@/action/event-action';
import { slugify } from '@/lib/utils';
import AddCategoryModal from '../../../categories/_components/add-category-modal';
import { useFormOptions } from '@/lib/swr';
import { eventFormSchema } from '@/db/zod/events';

// ✅ Make image optional for edit
const editSchema = eventFormSchema.omit({ image: true }).extend({ image: z.any().optional() });
type FormData = z.infer<typeof editSchema>;

type Props = {
  initial: any;
  id: string;
};

export default function EditEventForm({ initial, id }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { categoryOptions, userOptions, refresh } = useFormOptions();

  const initialStartTime = initial.start_time ? new Date(initial.start_time) : undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(editSchema),
    mode: 'onChange',
    defaultValues: {
      title: initial.title,
      description: initial.description ?? '',
      event_type: initial.event_type,
      category_id: initial.category_id ?? '',
      collaborator_id: initial.collaborator_id ?? '',
      location_name: initial.location_name ?? '',
      location_url: initial.location_url ?? '',
      start_time: initialStartTime,
    },
  });

  const eventType = form.watch('event_type');
  const watchedStartTime = form.watch('start_time');
  const watchedLocationName = form.watch('location_name');

  const isFormValid =
    form.formState.isValid &&
    !!watchedStartTime &&
    (eventType === 'online' || !!watchedLocationName);

  const handleEventTypeChange = (newType: 'online' | 'offline') => {
    form.setValue('event_type', newType);
    form.setValue('location_name', '');
    form.setValue('location_url', '');
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    Object.entries({
      title: data.title,
      description: data.description ?? '',
      location_name: data.location_name,
      location_url: data.location_url,
      event_type: data.event_type,
      category_id: data.category_id,
      collaborator_id: data.collaborator_id,
      start_time: data.start_time ? (data.start_time as Date).toISOString() : '',
    }).forEach(([key, value]) => {
      if (value) formData.append(key, String(value));
    });

    if ((data as any).image) {
      formData.append('image', (data as any).image);
    }

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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit event</h1>
              <p className="text-sm text-slate-500">Update an existing PurwokertoDev event</p>
            </div>
            <Button
              variant="gradient_blue"
              type="submit"
              disabled={!isFormValid || isPending}
              className="hidden md:flex"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {/* Inputs */}
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
            options={[
              { label: 'Online', value: 'online' },
              { label: 'Offline', value: 'offline' },
            ]}
            required
            onChange={(v) => handleEventTypeChange(v as 'online' | 'offline')}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <FormInput
              form={form}
              name="location_name"
              placeholder={
                eventType === 'online'
                  ? 'Meeting name (e.g. Google Meet)'
                  : 'Location name (e.g. Gedung Soedirman)'
              }
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
            <FormInput form={form} name="start_time" type={FormFieldType.DATETIME} />
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
          <FormInput
            form={form}
            name="image"
            type={FormFieldType.IMAGE}
            previousImage={initial?.image}
          />

          {/* Mobile Save Button */}
          <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:hidden dark:border-neutral-800 dark:bg-neutral-900/90 dark:supports-[backdrop-filter]:bg-neutral-900/60">
            <Button
              type="submit"
              disabled={!isFormValid || isPending}
              variant="gradient_blue"
              className="w-full"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
