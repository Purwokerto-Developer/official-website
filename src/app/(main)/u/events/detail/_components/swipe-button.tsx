'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

export default function SwipeToSubmitButton() {
  const [submitted, setSubmitted] = useState(false);
  const x = useMotionValue(0);
  const maxSwipe = 260; // sampai ujung kanan

  const bgColor = useTransform(
    x,
    [0, maxSwipe],
    ['#3B82F6', '#22C55E'], // biru → hijau
  );

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > maxSwipe * 0.9) {
      animate(x, maxSwipe, { type: 'spring', stiffness: 300 });
      setSubmitted(true);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300 });
    }
  };

  return (
    <motion.div
      className="relative flex h-14 w-72 items-center justify-center overflow-hidden rounded-full select-none"
      style={{ backgroundColor: bgColor }}
    >
      <span className="pointer-events-none absolute font-medium text-white">
        {submitted ? 'Submitted!' : 'Swipe to Submit'}
      </span>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxSwipe }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="absolute top-1 bottom-1 left-1 flex w-12 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
      >
        {submitted ? (
          <Check className="text-green-500" />
        ) : (
          <motion.div animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
            <ArrowRight className="text-blue-500" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
