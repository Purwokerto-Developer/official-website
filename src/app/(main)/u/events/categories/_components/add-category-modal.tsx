'use client';

import { useState, useTransition } from 'react';
import { addCategory } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { ElementPlus, Send } from 'iconsax-reactjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CategoryFormInput, categoryFormSchema } from '@/db/zod/categories';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/form-input';
import { FormFieldType } from '@/types/form-field-type';

type AddCategoryModalProps = {
  onSuccess?: () => void;
  label?: string;
};

const AddCategoryModal = ({ onSuccess, label = 'Tambah Kategori' }: AddCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onChange',
    defaultValues: { name: '', description: '' },
  });

  const submitHandler = (data: CategoryFormInput) => {
    startTransition(async () => {
      const res = await addCategory(data);
      if (res.success) {
        showToast('success', 'Kategori berhasil disimpan');
        form.reset();
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        showToast('error', res.error || 'Gagal menyimpan kategori');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient_blue">
          <ElementPlus className="mr-2 text-white" variant="Bulk" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kategori Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
            <FormInput
              form={form}
              name="name"
              type={FormFieldType.TEXT}
              placeholder="Nama Kategori"
              required
            />

            <FormInput
              form={form}
              name="description"
              type={FormFieldType.TEXTAREA}
              placeholder="Deskripsi"
              required
            />

            <DialogFooter>
              <Button
                type="submit"
                variant="gradient_blue"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? (
                  <>
                    <Send size="32" variant="Bulk" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Send size="32" variant="Bulk" /> Simpan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
