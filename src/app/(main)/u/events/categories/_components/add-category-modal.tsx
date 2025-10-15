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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ElementPlus } from 'iconsax-reactjs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

const categorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  description: z.string().min(5, 'Deskripsi minimal 5 karakter'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type AddCategoryModalProps = {
  onSuccess?: () => void;
};

const AddCategoryModal = ({ onSuccess }: AddCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const submitHandler = async (data: CategoryFormValues) => {
    setLoading(true);
    const res = await addCategory(data);
    setLoading(false);
    if (res.success) {
      showToast('success', 'Kategori berhasil disimpan');
      reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    } else {
      showToast('error', res.error || 'Gagal menyimpan kategori');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient_blue">
          <ElementPlus className="mr-2 text-white" variant="Bulk" />
          Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kategori Event</DialogTitle>
        </DialogHeader>
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
            <Textarea id="description" {...register('description')} disabled={loading} />
            {errors.description && (
              <span className="mt-1 block text-xs text-red-500">{errors.description.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <ElementPlus className="mr-2 animate-spin" variant="Bulk" />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
