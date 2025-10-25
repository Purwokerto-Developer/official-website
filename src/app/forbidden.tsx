'use client';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Shield, ShieldCross } from 'iconsax-reactjs';

export default function Forbidden() {
  const router = useRouter();
  return (
    <Empty className="min-h-[60vh] border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Shield size={32} variant="Bulk" className="text-primary" />
        </EmptyMedia>
        <EmptyTitle>Oops! Gak Bisa Masuk 😅</EmptyTitle>
        <EmptyDescription>
          Kayaknya kamu belum punya izin buat buka halaman ini.
          <br /> Balik dulu aja ya~
        </EmptyDescription>

        <Button
          variant="gradient_blue"
          size="lg"
          className="mt-4 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ShieldCross size={20} variant="Bulk" />
          Iyeeee
        </Button>
      </EmptyHeader>
    </Empty>
  );
}
