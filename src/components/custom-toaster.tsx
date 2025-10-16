'use client';

import { Toaster, toast, Toast } from 'react-hot-toast';
import { TickCircle, CloseCircle, Timer1, InfoCircle } from 'iconsax-reactjs';
import { ReactNode, useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'loading' | 'info';

const toastIcons: Record<ToastType, ReactNode> = {
  success: <TickCircle className="text-green-500" size={28} variant="Bulk" />,
  error: <CloseCircle className="text-red-500" size={28} variant="Bulk" />,
  loading: <Timer1 className="text-blue-500" size={28} variant="Bulk" />,
  info: <InfoCircle className="text-blue-500" size={28} variant="Bulk" />,
};

const lastToastTime: Record<ToastType, number> = {
  success: 0,
  error: 0,
  loading: 0,
  info: 0,
};

export const CustomToaster = () => (
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
      containerStyle={{
        top: 24,
        right: 24,
      }}
    />
    {/* <div className="fixed right-6 bottom-6 z-[9999]">
      <TestToastButton />
    </div> */}
  </>
);
// Test button for all toast types
// const TestToastButton = () => {
//   const [loadingTime, setLoadingTime] = useState(3);
//   return (
//     <div className="flex flex-col gap-2">
//       <button
//         className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
//         onClick={() => showToast('success', 'Toast Success!')}
//       >
//         Test Success Toast
//       </button>
//       <button
//         className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-red-700"
//         onClick={() => showToast('error', 'Toast Error!')}
//       >
//         Test Error Toast
//       </button>
//       <button
//         className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-600"
//         onClick={() => {
//           let time = 3;
//           showToast('loading', `Loading... (${time}s)`);
//           const interval = setInterval(() => {
//             time--;
//             if (time > 0) {
//               showToast('loading', `Loading... (${time}s)`);
//             } else {
//               showToast('success', 'Selesai!');
//               clearInterval(interval);
//             }
//           }, 1000);
//         }}
//       >
//         Test Loading Toast
//       </button>
//       <button
//         className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-gray-700"
//         onClick={() => showToast('info', 'Toast Info!')}
//       >
//         Test Info Toast
//       </button>
//     </div>
//   );
// };

/**
 * Menampilkan custom toast dengan glassmorphism dan cooldown.
 * @param type - Jenis toast
 * @param message - Pesan yang akan ditampilkan
 * @param cooldownMs - Durasi cooldown dalam ms (default: 2000)
 */
export const showToast = (type: ToastType, message: string, cooldownMs: number = 2000) => {
  const now = Date.now();
  const lastTime = lastToastTime[type] || 0;
  if (now - lastTime < cooldownMs) return;
  lastToastTime[type] = now;

  const duration = 3000;
  const baseClasses =
    'flex items-center gap-2 px-4 py-3 rounded-lg bg-background/80 dark:bg-background/60 shadow-md border border-border text-foreground transition-all duration-300 ease-in-out';
  const colorByType: Record<ToastType, string> = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    loading: 'border-l-4 border-blue-500',
    info: 'border-l-4 border-blue-400',
  };
  const icon = toastIcons[type];
  const titleByType: Record<ToastType, string> = {
    success: 'Success',
    error: 'Error',
    loading: 'Loading',
    info: 'Info',
  };

  // Use a React component with interval for live progress
  function ToastProgress({ t }: { t: Toast }) {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
      if (!t.visible) return;
      const interval = setInterval(() => {
        setElapsed(Date.now() - t.createdAt);
      }, 100);
      return () => clearInterval(interval);
    }, [t.visible, t.createdAt]);
    const percent = Math.max(0, Math.min(100, 100 - (elapsed / duration) * 100));
    const countdown = Math.ceil((duration - elapsed) / 1000);
    return (
      <div
        className={`${baseClasses} ${colorByType[type]} ${
          t.visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        } relative flex items-start gap-3`}
        style={{ minWidth: 260, maxWidth: 380 }}
      >
        {/* Icon */}
        <div className="mt-1 flex-shrink-0">{icon}</div>
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold capitalize">{titleByType[type]}</span>
            <span
              className={`flex items-center gap-1 font-mono text-xs ${
                type === 'success'
                  ? 'text-green-500'
                  : type === 'error'
                    ? 'text-red-500'
                    : 'text-blue-500'
              }`}
            >
              <Timer1 size={16} variant="Bulk" className="animate-pulse" />
              {countdown}s
            </span>
          </div>
          <div className="text-muted-foreground mt-1 mb-2 max-w-[260px] text-sm break-words">
            {message}
          </div>
          {/* Progress bar */}
          <div className="bg-border/40 h-1 w-full overflow-hidden rounded">
            <div
              className={`h-full rounded transition-all duration-100 ${
                type === 'success'
                  ? 'bg-green-500'
                  : type === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        {/* Close button */}
        <button
          className="hover:bg-border/30 mt-1 ml-2 rounded p-1 transition"
          onClick={() => toast.dismiss(t.id)}
          aria-label="Close"
        >
          <CloseCircle size={18} variant="Bulk" className="text-muted-foreground" />
        </button>
      </div>
    );
  }

  toast.custom((t: Toast) => <ToastProgress t={t} />, { id: type });
};
