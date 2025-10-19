'use client';

import { useState, useTransition, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { markAttendance } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';
import QRCode from 'react-qr-code';
import {
  Calendar,
  Clock,
  Location,
  TickCircle,
  CloseCircle,
  Refresh,
  ExportSquare,
} from 'iconsax-reactjs';

import { EventDetail } from '@/types/event-type';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Props = { eventId: string; mode?: 'link' | 'qr'; detailEvent?: EventDetail };

export default function AttendanceClient({ eventId, mode = 'link', detailEvent }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const qrRef = useRef<HTMLDivElement>(null);

  const handleAttend = () => {
    setStatus('idle');
    startTransition(async () => {
      const res = await markAttendance(eventId);
      if (res.success) {
        setStatus('success');
        showToast('success', 'Attendance recorded');
      } else {
        if (res.error?.includes('already marked attendance')) {
          setStatus('success');
          showToast('success', 'Attendance already recorded for this event');
        } else {
          setStatus('error');
          showToast('error', res.error || 'Failed to attend');
        }
      }
    });
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new window.Image(0);
    img.onload = () => {
      const padding = 20;
      canvas.width = img.width + 2 * padding;
      canvas.height = img.height + 2 * padding;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);

      const link = document.createElement('a');
      link.download = `attendance-qr-${eventId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const attendanceUrl = useMemo(
    () =>
      typeof window !== 'undefined'
        ? `${window.location.origin}/u/events/attendance/${eventId}?mode=link`
        : '',
    [eventId],
  );

  const formattedTime = useMemo(() => {
    if (!detailEvent?.start_time) return null;
    return {
      date: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(detailEvent.start_time)),
      time: new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(detailEvent.start_time)),
    };
  }, [detailEvent?.start_time]);

  return (
    <div className="flex min-h-screen items-start justify-center pt-16 pb-10">
      <div className="w-full max-w-lg space-y-8 p-4 md:p-6">
        {/* Event Info Card */}
        {detailEvent && (
          <Card className="overflow-hidden py-0 shadow-2xl shadow-gray-200/50 dark:shadow-neutral-900/50">
            <div className="relative aspect-[3/1.5] w-full">
              <Image
                src={detailEvent.image || '/placeholder-event.jpg'}
                alt={detailEvent.title}
                fill
                priority={false}
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-end bg-black/30 p-5">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold tracking-wider text-gray-800 uppercase backdrop-blur-sm">
                  {detailEvent.event_type === 'online' ? 'Online' : 'In-Person'}
                </span>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <h2 className="text-2xl leading-snug font-extrabold text-gray-900 dark:text-white">
                {detailEvent.title}
              </h2>
              <Separator className="dark:bg-neutral-700" />
              {/* Detail Icon Group */}
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                {formattedTime && (
                  <div className="flex items-center gap-4">
                    {/* Tanggal */}
                    <p className="flex items-center gap-2">
                      <Calendar
                        size={20}
                        variant="Bulk"
                        className="flex-shrink-0 text-purple-600"
                      />
                      <span className="font-medium">{formattedTime.date}</span>
                    </p>
                    <div className="h-5 w-px bg-gray-200 dark:bg-neutral-700" />
                    {/* Waktu */}
                    <p className="flex items-center gap-2">
                      <Clock size={20} variant="Bulk" className="flex-shrink-0 text-blue-600" />
                      <span className="font-medium">{formattedTime.time}</span>
                    </p>
                  </div>
                )}
                {detailEvent.location_name && (
                  <p className="flex items-start gap-2 pt-2">
                    {/* Lokasi */}
                    <Location
                      size={20}
                      variant="Bulk"
                      className="mt-0.5 flex-shrink-0 text-red-600"
                    />
                    <span className="flex-1">
                      {detailEvent.location_name}{' '}
                      {detailEvent.location_url && (
                        <a
                          href={detailEvent.location_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-500 underline-offset-4 hover:underline"
                        >
                          (Lihat Peta)
                        </a>
                      )}
                    </span>
                  </p>
                )}
                {detailEvent.description && (
                  <p className="line-clamp-3 pt-4 text-xs italic">"{detailEvent.description}"</p>
                )}
              </div>
            </div>
            {/* Attendance by Link */}
            {mode === 'link' && (
              <div className="space-y-6 p-6 pt-0 text-center">
                <p className="text-base text-gray-500 dark:text-gray-400">
                  click the button below to record your attendance for this event.
                </p>

                <Button
                  onClick={handleAttend}
                  disabled={isPending || status === 'success'}
                  variant={isPending || status === 'success' ? 'secondary' : 'gradient_blue'}
                  className={`w-full transition duration-300 ${
                    isPending || status === 'success'
                      ? 'cursor-not-allowed opacity-70'
                      : 'transform shadow-xl shadow-blue-500/50 hover:-translate-y-0.5'
                  }`}
                >
                  {isPending ? (
                    <>
                      <Refresh size={20} variant="Outline" className="mr-2 h-5 w-5 animate-spin" />{' '}
                      Taking Attendance...
                    </>
                  ) : status === 'success' ? (
                    <>
                      <TickCircle size={20} variant="Bulk" className="mr-2 h-5 w-5" /> Kehadiran
                      Attendance taked!
                    </>
                  ) : (
                    'Take Attendance Now!'
                  )}
                </Button>

                {/* Visual Feedback yang lebih menarik */}
                {status === 'success' && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-50/50 p-3 text-sm font-semibold text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <TickCircle size={20} variant="Bulk" />
                    <span>
                      Attendance has been recorded successfully!, Thank you for your participation.
                    </span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-red-50/50 p-3 text-sm font-semibold text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <CloseCircle size={20} variant="Bulk" />
                    <span>Failed to record attendance. Please try again.</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Attendance by QR */}
        {mode === 'qr' && (
          <div className="space-y-6 rounded-3xl bg-white p-8 text-center shadow-lg dark:bg-neutral-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">QR Code Attendance</h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              Scan this QR code to open the attendance page.
            </p>

            <div className="flex justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-3 dark:from-indigo-900/20 dark:to-purple-900/20">
              <div
                ref={qrRef}
                className="relative rounded-xl bg-white p-4 shadow-xl shadow-neutral-200/50 transition-all duration-300 hover:scale-[1.02] dark:shadow-neutral-900/50"
              >
                <QRCode
                  value={attendanceUrl}
                  size={256}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#1E3A8A"
                  style={{ height: 'auto', maxWidth: '100%', width: '100%', borderRadius: '8px' }}
                  viewBox="0 0 256 256"
                />
                {/* Logo/Icon di tengah QR Code */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white p-1.5 shadow-md">
                  <TickCircle size={32} variant="Bulk" className="text-indigo-600" />
                </div>
              </div>
            </div>

            <Button
              onClick={downloadQRCode}
              variant="outline"
              size="lg"
              className="mx-auto flex items-center gap-2 rounded-xl border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-neutral-700"
            >
              <ExportSquare size={20} variant="Bulk" />
              Download QR Code
            </Button>

            <p className="rounded-lg bg-gray-50 p-2 text-xs break-all text-neutral-400 dark:bg-neutral-700/50">
              <span className="font-semibold text-gray-500 dark:text-gray-300">Scan URL:</span>{' '}
              {attendanceUrl}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
