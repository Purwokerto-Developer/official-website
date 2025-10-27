'use client';

import { editCategory } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { CategoryFormInput, categoryFormSchema } from '@/db/zod/categories';
import { FormFieldType } from '@/types/form-field-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Send } from 'iconsax-reactjs';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

type EditCategoryModalProps = {
  initial: { name: string; description: string };
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
};

const EditCategoryModal = ({ initial, id, open, setOpen, onSuccess }: EditCategoryModalProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onChange',
    defaultValues: initial,
  });

  useEffect(() => {
    form.reset(initial);
  }, [initial]);

  const submitHandler = (data: CategoryFormInput) => {
    startTransition(async () => {
      const res = await editCategory(id, data);
      if (res.success) {
        showToast('success', 'Kategori berhasil diupdate');
        form.reset(data);
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        showToast('error', res.error || 'Gagal mengupdate kategori');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Kategori Event</DialogTitle>
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
                    <Send size="32" variant="Bulk" /> Mengedit...
                  </>
                ) : (
                  <>
                    <Edit size="32" variant="Bulk" /> Edit
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

export default EditCategoryModal;
