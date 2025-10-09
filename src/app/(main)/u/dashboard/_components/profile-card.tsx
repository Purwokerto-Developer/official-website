'use client';
import DotGrid from '@/components/dot-grid';
import Lanyard from '@/components/lanyard';
import { Card } from '@/components/ui/card';
import { Session } from '@/types/better-auth';
import { useTheme } from 'next-themes';
import React from 'react';

const ProfileCard = ({ session }: { session: Session }) => {
  const { resolvedTheme } = useTheme();

  const baseColor = resolvedTheme === 'dark' ? '#1F2038' : '#F1F5F9';
  const activeColor = resolvedTheme === 'dark' ? '#2930FF' : '#74d4ff';

  return (
    <Card className="relative flex h-[500px] w-full items-start justify-start overflow-hidden px-0 py-0">
      <div className="absolute inset-0 top-0 left-0 h-full w-full">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor={baseColor}
          activeColor={activeColor}
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ width: '100vw', height: '100vh', left: '-20px', top: '-20px' }}
        />
      </div>
      <Lanyard
        position={[0, 0, 10]}
        gravity={[0, -40, 0]}
        user={{
          firstName: session.user.name || '',
          username: session.user.email || '',
        }}
      />
    </Card>
  );
};

export default ProfileCard;
