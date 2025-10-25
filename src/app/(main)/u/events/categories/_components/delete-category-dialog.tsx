import { useState } from 'react';
import { deleteCategory } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'iconsax-reactjs';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

interface DeleteCategoryDialogProps {
  id: string;
  name: string;
  onSuccess?: () => void;
}

const DeleteCategoryDialog = ({ id, name, onSuccess }: DeleteCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteCategory(id);
    setLoading(false);
    if (res.success) {
      showToast('success', `Kategori "${name}" berhasil dihapus`);
      setOpen(false);
      if (onSuccess) onSuccess();
    } else {
      showToast('error', res.error || 'Gagal menghapus kategori');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Delete category"
          className="text-destructive flex w-full items-center gap-2"
        >
          <Trash size="32" className="text-destructive" variant="Bulk" />
          <span className="font-semibold">Delete</span>
          <DropdownMenuShortcut className="text-destructive">⌘D</DropdownMenuShortcut>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background rounded-xl border-0 shadow-xl">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <div className="bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-full border">
            <Trash size="24" className="text-destructive" variant="Bulk" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive text-lg font-bold">
              Hapus Kategori
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Kategori{' '}
              <span className="text-destructive font-semibold">{name}</span> akan dihapus secara
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="mt-4 flex flex-row justify-center gap-2">
          <AlertDialogCancel disabled={loading} className="rounded-lg border px-4 py-2">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90 rounded-lg px-4 py-2 font-semibold text-white shadow transition-colors"
          >
            {loading ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCategoryDialog;
