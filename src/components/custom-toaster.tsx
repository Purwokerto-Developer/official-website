'use client';

import { Toaster, toast, Toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'loading' | 'info';

const toastIcons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="text-green-500" size={18} />,
  error: <XCircle className="text-red-500" size={18} />,
  loading: <Loader2 className="animate-spin text-blue-500" size={18} />,
  info: <Info className="text-blue-500" size={18} />,
};

const lastToastTime: Record<ToastType, number> = {
  success: 0,
  error: 0,
  loading: 0,
  info: 0,
};

export const CustomToaster = () => (
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
);

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

  const baseClasses =
    'flex items-center gap-2 px-4 py-3 rounded-lg bg-background/80 dark:bg-background/60 shadow-md border border-border text-foreground transition-all duration-300 ease-in-out';

  const colorByType: Record<ToastType, string> = {
    success: 'border-green-200 dark:border-green-600',
    error: 'border-red-200 dark:border-red-600',
    loading: 'border-blue-200 dark:border-blue-600',
    info: 'border-blue-100 dark:border-blue-700',
  };

  const icon = toastIcons[type];

  toast.custom(
    (t: Toast) => (
      <div
        className={`${baseClasses} ${colorByType[type]} ${
          t.visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        }`}
        style={{ minWidth: 220, maxWidth: 320 }}
      >
        {icon}
        <span className="truncate text-sm font-medium" style={{ lineHeight: 1.4 }}>
          {message}
        </span>
      </div>
    ),
    { id: type },
  );
};
