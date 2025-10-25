'use client'

import React from 'react'

type Item = { label: string; value: number; color?: string }

type Props = {
  title?: string
  data: Item[]
  height?: number
  max?: number
}

export default function BarChart({ title, data, height = 160, max }: Props) {
  const computedMax = max ?? Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="rounded-xl border p-4">
      {title ? <h4 className="mb-3 text-sm font-semibold">{title}</h4> : null}
      <div className="flex items-end gap-4" style={{ height }}>
        {data.map((d) => {
          const pct = Math.max(0, Math.min(100, (d.value / computedMax) * 100))
          return (
            <div key={d.label} className="flex flex-col items-center">
              <div
                className="w-8 rounded-t bg-sky-500 shadow-sm transition-all dark:bg-sky-600"
                style={{ height: `${pct}%`, backgroundColor: d.color || undefined }}
                title={`${d.label}: ${d.value}`}
              />
              <div className="mt-2 w-12 truncate text-center text-xs text-neutral-500">{d.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


