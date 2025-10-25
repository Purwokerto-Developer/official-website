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
export const TestToastButton = () => {
  const [loadingTime, setLoadingTime] = useState(3);
  return (
    <div className="flex flex-col gap-2">
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
        onClick={() => showToast('success', 'Toast Success!')}
      >
        Test Success Toast
      </button>
      <button
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-red-700"
        onClick={() => showToast('error', 'Toast Error!')}
      >
        Test Error Toast
      </button>
      <button
        className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-600"
        onClick={() => {
          let time = 3;
          showToast('loading', `Loading... (${time}s)`);
          const interval = setInterval(() => {
            time--;
            if (time > 0) {
              showToast('loading', `Loading... (${time}s)`);
            } else {
              showToast('success', 'Selesai!');
              clearInterval(interval);
            }
          }, 1000);
        }}
      >
        Test Loading Toast
      </button>
      <button
        className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-gray-700"
        onClick={() => showToast('info', 'Toast Info!')}
      >
        Test Info Toast
      </button>
    </div>
  );
};

/**
 * Menampilkan custom toast dengan glassmorphism dan cooldown.
 * @param type - Jenis toast
 * @param message - Pesan yang akan ditampilkan
 * @param cooldownMs - Durasi cooldown dalam ms (default: 2000)
 */
export const showToast = (type: ToastType, message: string, cooldownMs: number = 2000) => {
  // For `loading` toasts we want fast updates (e.g., per-second countdown),
  // so skip the cooldown logic for that type. For other types keep cooldown.
  if (type !== 'loading') {
    const now = Date.now();
    const lastTime = lastToastTime[type] || 0;
    if (now - lastTime < cooldownMs) return;
    lastToastTime[type] = now;
  }

  const DEFAULT_DURATION = 3000;
  const duration = type === 'loading' ? Infinity : DEFAULT_DURATION;
  const baseClasses =
    'flex items-center gap-2 px-4 py-3 rounded-lg bg-background dark:bg-background shadow-md border border-border text-foreground transition-all duration-300 ease-in-out';
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
  function ToastProgress({ t, message }: { t: Toast; message: string }) {
    const [elapsed, setElapsed] = useState(0);

    // If message contains a seconds countdown like "(3s)", parse it and
    // use that to drive the progress for loading toasts. This keeps the
    // progress bar in sync with updates to the message (when showToast is
    // called repeatedly with updated seconds).
    const parseSeconds = (msg: string): number | null => {
      const m = msg.match(/(\d+)\s*s\b/) || msg.match(/\((\d+)s\)/);
      if (m && m[1]) return parseInt(m[1], 10);
      // Also accept just a number in parentheses: (3)
      const m2 = msg.match(/\((\d+)\)/);
      if (m2 && m2[1]) return parseInt(m2[1], 10);
      return null;
    };

    const parsedSeconds = parseSeconds(message);
    const initialSecondsRef = (function () {
      // useRef cannot be used conditionally here because ToastProgress is a nested
      // component; instead, create a stable ref via closure with React hook.
      // But we do have access to hooks, so use useState to store initial seconds once.
      // We'll use a state value that we only set once.
      const [initial, setInitial] = useState<number | null>(null as number | null);
      return {
        get current() {
          return initial;
        },
        set current(v: number | null) {
          if (initial === null && v !== null) setInitial(v);
        },
      } as { current: number | null };
    })();

    // If we see a parsedSeconds and haven't set initial yet, set it.
    if (parsedSeconds !== null && initialSecondsRef.current === null) {
      initialSecondsRef.current = parsedSeconds;
    }

    useEffect(() => {
      if (!t.visible) return;
      const interval = setInterval(() => {
        const now = Date.now();
        const e = now - t.createdAt;
        setElapsed(e);
      }, 100);
      return () => clearInterval(interval);
    }, [t.visible, t.createdAt]);

    const isIndeterminate = !Number.isFinite(duration);

    let percent: number;
    let countdown: number | null = null;

    if (parsedSeconds !== null && initialSecondsRef.current !== null) {
      // Use the parsed seconds to compute percent (decreasing as seconds go down)
      const initial = initialSecondsRef.current || parsedSeconds;
      percent = Math.max(0, Math.min(100, (parsedSeconds / initial) * 100));
      countdown = parsedSeconds;
    } else {
      // Fall back to elapsed/duration when no parsed seconds provided
      percent = isIndeterminate
        ? 100
        : Math.max(0, Math.min(100, 100 - (elapsed / duration) * 100));
      const remainingMs = isIndeterminate ? 0 : Math.max(0, duration - elapsed);
      countdown = isIndeterminate ? null : Math.ceil(remainingMs / 1000);
    }
    return (
      <div
        className={`${baseClasses} ${colorByType[type]} ${
          t.visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
        } relative flex items-start gap-3`}
        style={{ minWidth: 260, maxWidth: 380, marginTop: 8, zIndex: 9999 }}
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
              {countdown !== null ? `${countdown}s` : ''}
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
              } ${isIndeterminate ? 'animate-pulse' : ''}`}
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
  // Show the toast. For `loading` we set duration=Infinity and keep it
  // independent so it won't automatically convert to a success toast.
  toast.custom((t: Toast) => <ToastProgress t={t} message={message} />, { id: type });
};
