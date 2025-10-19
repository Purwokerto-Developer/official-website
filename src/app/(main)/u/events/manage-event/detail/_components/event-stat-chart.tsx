'use client'

import React from 'react'

type DataPoint = { label: string; value: number; color?: string }

type Props = {
  data: DataPoint[]
  max?: number
  height?: number
}

export default function EventStatChart({ data, max, height = 160 }: Props) {
  const computedMax = max ?? Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-3 overflow-x-auto" style={{ height }}>
      {data.map((d) => {
        const pct = Math.max(0, Math.min(100, (d.value / computedMax) * 100))
        return (
          <div key={d.label} className="flex flex-col items-center">
            <div
              className="w-8 rounded-t bg-sky-500 transition-all dark:bg-sky-600"
              style={{ height: `${pct}%`, backgroundColor: d.color || undefined }}
              title={`${d.label}: ${d.value}`}
            />
            <div className="mt-2 w-10 truncate text-center text-xs text-neutral-500">{d.label}</div>
          </div>
        )
      })}
    </div>
  )
}


