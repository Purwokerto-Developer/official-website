'use client';
import DotGrid from '@/components/dot-grid';
import Lanyard from '@/components/lanyard';
import { SimpleColorPicker } from '@/components/ui/simple-color-picker';
import { Card } from '@/components/ui/card';
import { Session } from '@/types/better-auth';
import { useTheme } from 'next-themes';
import React from 'react';

const ProfileCard = ({ session }: { session: Session }) => {
  const { resolvedTheme } = useTheme();

  const baseColor = resolvedTheme === 'dark' ? '#1F2038' : '#F1F5F9';
  const activeColor = resolvedTheme === 'dark' ? '#2930FF' : '#74d4ff';

  const [cardColor, setCardColor] = React.useState('#2563EB'); // blue-600 default
  // Sync with localStorage after mount
  React.useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lanyardColor') : null;
    if (stored) setCardColor(stored);
  }, []);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lanyardColor', cardColor);
    }
  }, [cardColor]);

  const swatchColors = [
    '#1F2937', // gray-800
    '#374151', // gray-700
    '#4B5563', // gray-600
    '#DC2626', // red-600
    '#EA580C', // orange-600
    '#CA8A04', // yellow-600
    '#16A34A', // green-600
    '#059669', // emerald-600
    '#0D9488', // teal-600
    '#2563EB', // blue-600
    '#4F46E5', // indigo-600
    '#7C3AED', // violet-600
    '#DB2777', // pink-600
    '#D97706', // amber-600
  ];

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
      <div className="absolute top-4 right-4 z-10 flex w-72 flex-col items-end">
        <SimpleColorPicker
          value={cardColor}
          onChange={setCardColor}
          swatches={swatchColors}
          className="w-fit"
        />
      </div>
      <Lanyard
        position={[0, 0, 10]}
        gravity={[0, -40, 0]}
        cardColor={cardColor}
        user={{
          firstName: session.user.name || '',
          username: session.user.email || '',
        }}
      />
    </Card>
  );
};

export default ProfileCard;
