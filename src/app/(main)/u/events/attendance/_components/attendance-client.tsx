'use client';

import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { markAttendance } from '@/action/event-action';
import { showToast } from '@/components/custom-toaster';
import QRCode from 'react-qr-code';
import { Download, Copy, Share2 } from 'lucide-react';

type Props = { eventId: string; mode?: 'link' | 'qr' };

export default function AttendanceClient({ eventId, mode = 'link' }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const qrRef = useRef<HTMLDivElement>(null);

  const handleAttend = () => {
    startTransition(async () => {
      const res = await markAttendance(eventId);
      if (res.success) {
        setStatus('success');
        showToast('success', 'Attendance recorded');
      } else {
        // Handle already attended case gracefully
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
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `attendance-qr-${eventId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const attendanceUrl = `${window.location.origin}/u/events/attendance/${eventId}?mode=link`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(attendanceUrl);
      showToast('success', 'Link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = attendanceUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('success', 'Link copied to clipboard!');
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event Attendance Link',
          text: 'Click this link to mark your attendance',
          url: attendanceUrl,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          showToast('error', 'Failed to share link');
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-4">
      {mode === 'link' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">Attendance Link</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Share this link with participants to mark their attendance
            </p>
          </div>
          
          <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={attendanceUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border rounded-md"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy size={16} />
                Copy
              </Button>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button
                onClick={shareLink}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 size={16} />
                Share Link
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-neutral-400 mb-3">
              Or click below to mark your own attendance
            </p>
            <Button onClick={handleAttend} disabled={isPending} variant="gradient_blue">
              {isPending ? 'Submitting...' : 'Mark My Attendance'}
            </Button>
          </div>
        </div>
      )}

      {mode === 'qr' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold">Attendance QR Code</h3>
            <p className="text-sm text-neutral-500 mb-4">
              Scan this QR code to access the attendance page
            </p>
          </div>
          
          <div className="flex justify-center">
            <div 
              ref={qrRef}
              className="bg-white p-4 rounded-lg border-2 border-gray-200"
            >
              <QRCode
                value={attendanceUrl}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
          
          <div className="flex justify-center gap-2">
            <Button
              onClick={downloadQRCode}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download QR Code
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-neutral-400">
              URL: {attendanceUrl}
            </p>
          </div>
        </div>
      )}

      {status === 'success' && <p className="text-green-600 text-sm">Attendance success.</p>}
      {status === 'error' && <p className="text-red-600 text-sm">Attendance failed.</p>}
    </div>
  );
}


