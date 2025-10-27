'use client';

import { createEventWithImage } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { type EventFormInput, eventFormSchema } from '@/db/zod/events';
import { useFormOptions } from '@/lib/swr';
import { slugify } from '@/lib/utils';
import { FormFieldType } from '@/types/form-field-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Additem } from 'iconsax-reactjs';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import AddCategoryModal from '../../categories/_components/add-category-modal';

export default function CreateEventForm() {
  const router = useRouter();
  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location_name: '',
      location_url: '',
      event_type: 'online',
      category_id: '',
      collaborator_id: '',
      start_time: undefined,
      image: null,
    },
  });

  const [isPending, startTransition] = useTransition();
  const eventType = form.watch('event_type');
  const { categoryOptions, userOptions, refresh } = useFormOptions();
  const watchedStartTime = form.watch('start_time');
  const watchedLocationName = form.watch('location_name');

  const isFormValid =
    form.formState.isValid &&
    !!watchedStartTime &&
    (eventType === 'online' || !!watchedLocationName);

  const onSubmit = async (data: EventFormInput) => {
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
    formData.append('image', data.image as File);

    startTransition(async () => {
      const result = await createEventWithImage(formData);
      if (result.success) {
        showToast('success', 'Event created successfully!');
        form.reset();
        const created = result.data?.[0] ?? null;
        const slug = slugify(created?.title || data.title);
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
            onChange={(v) => form.setValue('event_type', v as 'online' | 'offline')}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <FormInput
              form={form}
              name="location_name"
              placeholder={eventType === 'online' ? 'Meeting name' : 'Location name'}
              type={FormFieldType.TEXT}
              required
            />
            <FormInput
              form={form}
              name="location_url"
              placeholder={eventType === 'online' ? 'Meeting link' : 'Google Maps URL'}
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
          <FormInput form={form} name="image" type={FormFieldType.IMAGE} />

          <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:hidden dark:border-neutral-800 dark:bg-neutral-900/90 dark:supports-[backdrop-filter]:bg-neutral-900/60">
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
