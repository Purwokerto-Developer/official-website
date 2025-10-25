'use client'

import { useEffect, useMemo, useState } from 'react'
import { getEventParticipants, type EventParticipantRow } from '@/action/event-action'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = { eventId: string }

export default function ManageEventParticipants({ eventId }: Props) {
  const [rows, setRows] = useState<EventParticipantRow[]>([])

  useEffect(() => {
    const run = async () => {
      const res = await getEventParticipants(eventId)
      if (res.success && Array.isArray(res.data)) setRows(res.data)
    }
    run()
  }, [eventId])

  const attended = useMemo(() => rows.filter(r => r.status === 'attended').length, [rows])
  const total = useMemo(() => rows.length, [rows])

  return (
    <Card className="space-y-4 dark:bg-background">

      <CardHeader>
        <CardTitle>Participants list</CardTitle>
      </CardHeader>
      <CardContent>

      <Table>
        <TableCaption>Participants list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Attendance Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {r.image ? (
                    <Image src={r.image} alt={r.name ?? r.email} width={28} height={28} className="rounded-full" />
                  ) : (
                    <div className="bg-neutral-200 h-7 w-7 rounded-full" />
                  )}
                  <span className="text-sm">{r.name ?? '-'}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{r.email}</TableCell>
              <TableCell className="text-sm capitalize">{r.status}</TableCell>
              <TableCell className="text-sm">{r.joined_at ? new Date(r.joined_at).toLocaleString() : '-'}</TableCell>
              <TableCell className="text-sm">{r.attendance_time ? new Date(r.attendance_time).toLocaleString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </CardContent>
    </Card>
  )
}


