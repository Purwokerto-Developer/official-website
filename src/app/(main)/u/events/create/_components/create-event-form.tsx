'use client';

import { getCategories, createEventWithImage } from '@/action/event-action';
import { getUsers } from '@/action/user-action';
import { FormInput } from '@/components/form-input';
import { Form } from '@/components/ui/form';
import { eventInsertSchema } from '@/lib/zod';
import { FormFieldType } from '@/types/form-field-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddCategoryModal from '../../categories/_components/add-category-modal';
import { Button } from '@/components/ui/button';
import { Additem } from 'iconsax-reactjs';
import { DatePicker, TimePicker } from '@/components/ui/date-picker';
import { showToast } from '@/components/custom-toaster';

const eventSchema = eventInsertSchema.extend({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title max 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description max 1000 characters'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address max 200 characters'),
  event_type: z.enum(['online', 'offline'], 'Event type is required'),
  category_id: z.string().min(1, 'Category is required'),
  collaborator_id: z.string().optional(),
  start_time: z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
    message: 'Start time is required',
  }),
  image: z.custom<File>((val) => {
    return val instanceof File && val.size > 0;
  }, 'Image is required'),
});

export default function CreateEventForm() {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      address: '',
      event_type: 'online',
      category_id: '',
      collaborator_id: '',
      start_time: new Date(),
      image: undefined,
    },
  });

  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('08:00');
  const [isPending, startTransition] = useTransition();

  // Fetch kategori dan user
  useEffect(() => {
    const fetchOptions = async () => {
      const [catRes, userRes] = await Promise.all([getCategories(), getUsers()]);
      if (catRes.success && Array.isArray(catRes.data))
        setCategories(catRes.data.map((c: any) => ({ label: c.name, value: c.id })));
      if (userRes.success && Array.isArray(userRes.data))
        setUsers(userRes.data.map((u: any) => ({ label: u.name, value: u.id })));
    };
    fetchOptions();
  }, []);

  // ✅ Submit pakai FormData langsung
  const onSubmit = async (data: z.infer<typeof eventSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description ?? '');
    formData.append('address', data.address);
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
              disabled={!form.formState.isValid || isPending}
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

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormInput
              form={form}
              name="event_type"
              type={FormFieldType.SELECT}
              options={[
                { label: 'Online', value: 'online' },
                { label: 'Offline', value: 'offline' },
              ]}
              required
            />
            <FormInput
              form={form}
              name="address"
              placeholder="Alamat atau link event"
              type={FormFieldType.TEXT}
              required
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
              options={categories}
              required
            />
            <AddCategoryModal onSuccess={() => setCategories([])} label="Add new" />
          </div>

          <FormInput
            form={form}
            name="collaborator_id"
            placeholder="Speaker/Collaborator"
            type={FormFieldType.SELECT}
            options={users}
          />

          <FormInput form={form} name="image" type={FormFieldType.IMAGE} />

          {/* Mobile Button */}
          <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:hidden">
            <Button
              type="submit"
              disabled={!form.formState.isValid || isPending}
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
