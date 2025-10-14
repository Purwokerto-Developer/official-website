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
import { SearchNormal } from 'iconsax-reactjs';

export default function NotFound() {
  const router = useRouter();
  return (
    <Empty className="flex h-screen items-center justify-center">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchNormal size={32} variant="Bulk" className="text-primary" />
        </EmptyMedia>
        <EmptyTitle>404 Moment 😭</EmptyTitle>
        <EmptyDescription>
          Halaman ini hilang kayak semangat di hari Senin.
          <br /> Balik aja dulu, nanti dicari bareng.
        </EmptyDescription>

        <Button
          variant="gradient_blue"
          size="lg"
          className="mt-4 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <SearchNormal size={20} variant="Bulk" />
          Iyeeee
        </Button>
      </EmptyHeader>
    </Empty>
  );
}
