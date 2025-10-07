"use client"

import { Toaster, toast, Toast } from "react-hot-toast"
import { CheckCircle, XCircle, Loader2, Info } from "lucide-react"
import { ReactNode } from "react"

type ToastType = "success" | "error" | "loading" | "info"

const toastIcons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="text-green-400" size={20} />,
  error: <XCircle className="text-red-400" size={20} />,
  loading: <Loader2 className="animate-spin text-blue-400" size={20} />,
  info: <Info className="text-blue-400" size={20} />,
}

const lastToastTime: Record<ToastType, number> = {
    success: 0,
    error: 0,
    loading: 0,
    info: 0
}

export const CustomToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: "transparent",
        boxShadow: "none",
        padding: 0,
      },
    }}
  />
)

/**
 * Menampilkan custom toast dengan glassmorphism dan cooldown.
 * @param type - Jenis toast
 * @param message - Pesan yang akan ditampilkan
 * @param cooldownMs - Durasi cooldown dalam ms (default: 2000)
 */
export const showToast = (
  type: ToastType,
  message: string,
  cooldownMs: number = 2000
) => {
  const now = Date.now()
  const lastTime = lastToastTime[type] || 0

  if (now - lastTime < cooldownMs) return
  lastToastTime[type] = now

  const baseClasses =
    "flex items-center gap-3 p-4 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-slate-800/40 text-white shadow-lg border border-white/20 transition-all duration-300 ease-in-out"

  const colorByType: Record<ToastType, string> = {
    success: "border-green-400/30",
    error: "border-red-400/30",
    loading: "border-blue-400/30",
    info: "border-blue-300/30",
  }

  const icon = toastIcons[type]

  toast.custom((t: Toast) => (
    <div
      className={`${baseClasses} ${colorByType[type]} ${
        t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  ), { id: type })
}
