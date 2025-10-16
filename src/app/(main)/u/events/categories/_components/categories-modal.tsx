import { addCategory, editCategory } from '@/action/event-action';
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
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ElementPlus } from 'iconsax-reactjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryFormProps = {
  initial?: Partial<CategoryFormValues>;
  loading?: boolean;
};

import { useCallback } from 'react';

type CategoryFormExtraProps = {
  mode: 'add' | 'edit';
  id?: string;
};

function CategoryForm({
  initial,
  loading,
  mode = 'add',
  id,
}: CategoryFormProps & CategoryFormExtraProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial,
  });

  const submitHandler = useCallback(
    async (data: CategoryFormValues) => {
      try {
        let res;
        if (mode === 'edit' && id) {
          res = await editCategory(id, { ...data });
        } else {
          res = await addCategory({ ...data });
        }
        if (res.success) {
          showToast(
            'success',
            mode === 'edit' ? 'Kategori berhasil diupdate' : 'Kategori berhasil disimpan',
          );
          reset();
          // TODO: Optionally close modal and trigger list refresh
        } else {
          showToast('error', res.error || 'Gagal menyimpan kategori');
        }
      } catch (err) {
        showToast('error', 'Gagal menyimpan kategori');
      }
    },
    [mode, id, reset],
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nama Kategori
        </label>
        <Input id="name" {...register('name')} autoFocus disabled={loading} />
        {errors.name && (
          <span className="mt-1 block text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Deskripsi
        </label>
        <Input id="description" {...register('description')} disabled={loading} />
        {errors.description && (
          <span className="mt-1 block text-xs text-red-500">{errors.description.message}</span>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </DialogFooter>
    </form>
  );
}

type CategoriesModalProps = {
  mode: 'add' | 'edit';
  id?: string;
  initial?: { name?: string; description?: string };
  loading?: boolean;
};

const CategoriesModal = ({ mode, id, initial, loading }: CategoriesModalProps) => {
  // Modal handles its own submit logic internally
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gradient_blue">
          <ElementPlus className="text-white" variant="Bulk" />
          {mode === 'add' ? 'Tambah Kategori' : 'Edit Kategori'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Tambah Kategori Event' : 'Edit Kategori Event'}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm initial={initial} loading={loading} mode={mode} id={id} />
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesModal;
