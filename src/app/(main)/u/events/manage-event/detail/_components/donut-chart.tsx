'use client'

import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

type Slice = { label: string; value: number }

type Props = {
  title?: string
  data: Slice[]
}

export default function DonutChart({ title, data }: Props) {
  const total = React.useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])
  const chartData = data.map((d, i) => ({ key: d.label, value: d.value, fill: `var(--chart-${i + 1})` }))
  const config: ChartConfig = Object.fromEntries([
    ['value', { label: 'Total' }],
    ...data.map((d, i) => [d.label.toLowerCase().replace(/\s+/g, '-'), { label: d.label, color: `var(--chart-${i + 1})` }]),
  ]) as ChartConfig

  return (
    <div className="rounded-xl border p-4">
      {title ? <h4 className="mb-3 text-sm font-semibold">{title}</h4> : null}
      <ChartContainer config={config} className="mx-auto aspect-square max-h-[240px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey="value" nameKey="key" innerRadius={60} strokeWidth={5}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                        {total.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                        Total
                      </tspan>
                    </text>
                  )
                }
                return null
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}


