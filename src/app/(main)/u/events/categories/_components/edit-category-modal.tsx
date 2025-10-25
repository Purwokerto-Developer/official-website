import { editCategory } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Send } from 'iconsax-reactjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { categoryInsertSchema } from '@/lib/zod';

const categorySchema = categoryInsertSchema.extend({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(50, 'Nama maksimal 50 karakter'),
  description: z
    .string()
    .min(5, 'Deskripsi minimal 5 karakter')
    .max(255, 'Deskripsi maksimal 255 karakter'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type EditCategoryModalProps = {
  initial: { name: string; description: string };
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
};

const EditCategoryModal = ({ initial, id, open, setOpen, onSuccess }: EditCategoryModalProps) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial,
  });

  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  const submitHandler = async (data: CategoryFormValues) => {
    setLoading(true);
    const res = await editCategory(id, { ...data });
    setLoading(false);
    if (res.success) {
      showToast('success', 'Kategori berhasil diupdate');
      setOpen(false);
      if (onSuccess) onSuccess();
    } else {
      showToast('error', res.error || 'Gagal mengupdate kategori');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Kategori Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nama Kategori
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="category name"
              autoFocus
              disabled={loading}
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-red-500">{errors.name.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Deskripsi
            </label>
            <Textarea
              id="description"
              placeholder="category description"
              {...register('description')}
              disabled={loading}
            />
            {errors.description && (
              <span className="mt-1 block text-xs text-red-500">{errors.description.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" variant="gradient_blue" disabled={loading}>
              {loading ? (
                <>
                  <Edit size="32" variant="Bulk" />
                  Mengedit...
                </>
              ) : (
                <>
                  <Edit size="32" variant="Bulk" />
                  Edit
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
