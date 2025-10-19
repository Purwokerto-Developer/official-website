'use client'

import React from 'react'
import { Area, AreaChart as RAreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

type Point = { label: string; joined: number; attended: number }
type Props = { title?: string; data: Point[] }

export default function AreaChart({ title, data }: Props) {

  const config: ChartConfig = {
    joined: { label: 'Joined', color: 'var(--chart-1)' },
    attended: { label: 'Attended', color: 'var(--chart-2)' },
  }

  return (
    <div className="rounded-xl border p-4">
      {title ? <h4 className="mb-3 text-sm font-semibold">{title}</h4> : null}
      <ChartContainer config={config} className="mx-auto h-[260px] w-full">
        <RAreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
          <defs>
            <linearGradient id="fillJoined" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-joined)" stopOpacity={0.6} />
              <stop offset="95%" stopColor="var(--color-joined)" stopOpacity={0.08} />
            </linearGradient>
            <linearGradient id="fillAttended" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-attended)" stopOpacity={0.6} />
              <stop offset="95%" stopColor="var(--color-attended)" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
          <Area
            dataKey="joined"
            type="natural"
            fill="url(#fillJoined)"
            fillOpacity={0.4}
            stroke="var(--color-joined)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
          />
          <Area
            dataKey="attended"
            type="natural"
            fill="url(#fillAttended)"
            fillOpacity={0.4}
            stroke="var(--color-attended)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
          />
        </RAreaChart>
      </ChartContainer>
    </div>
  )
}


