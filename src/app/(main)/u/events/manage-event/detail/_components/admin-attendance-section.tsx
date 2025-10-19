'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink, Users, CheckCircle, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { showToast } from '@/components/custom-toaster';
import QRCode from 'react-qr-code';
import { generateQRToken } from '@/action/event-action';
import { createQRData } from '@/lib/qr-utils';

interface AdminAttendanceSectionProps {
  eventId: string;
  eventType: 'online' | 'offline';
  isAttendanceOpen: boolean;
  eventTitle: string;
}

export default function AdminAttendanceSection({
  eventId,
  eventType,
  isAttendanceOpen,
  eventTitle,
}: AdminAttendanceSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [qrToken, setQrToken] = useState<string>('');
  const [qrData, setQrData] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate QR token on mount for offline events
  useEffect(() => {
    if (eventType === 'offline') {
      generateToken();
    }
  }, [eventType, eventId]);

  const generateToken = async () => {
    try {
      const result = await generateQRToken(eventId);
      if (result.success && result.data) {
        const token = result.data.token;
        setQrToken(token);
        const data = createQRData(eventId, token);
        setQrData(data);
      }
    } catch (error) {
      console.error('Failed to generate QR token:', error);
      showToast('error', 'Failed to generate QR token');
    }
  };

  // Generate attendance URL based on event type
  const attendanceUrl = `${window.location.origin}/u/events/attendance/${eventId}?mode=${eventType === 'offline' ? 'qr' : 'link'}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(attendanceUrl);
      showToast('success', 'Attendance URL copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = attendanceUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast('success', 'Attendance URL copied to clipboard!');
    }
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
      link.download = `attendance-qr-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('success', 'QR code downloaded!');
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <Card className='dark:bg-background'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <Users size={20} />
            Attendance Management - {eventType === 'offline' ? 'QR Code' : 'Link Sharing'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-950">
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Attendance is {isAttendanceOpen ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* For Online Events - Share Link */}
          {eventType === 'online' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium ">
                  Online Attendance URL
                </label>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Share this link with participants via email, chat, or notification
                </p>
                <div className="flex gap-2">
                  <Input
                    value={attendanceUrl}
                    readOnly
                    className="flex-1 bg-white dark:bg-gray-800"
                  />
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                  >
                    <Copy size={16} />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* For Offline Events - Display QR Code */}
          {eventType === 'offline' && qrData && (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium ">
                  QR Code for Attendance
                </label>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Display this QR code at the venue for participants to scan
                </p>
              </div>

              {/* QR Code Display */}
              <div className="flex justify-center">
                <div 
                  ref={qrRef}
                  className="bg-white p-6 rounded-lg border-2 border-gray-200"
                >
                  <QRCode
                    value={qrData}
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>

              {/* QR Actions */}
              <div className="flex justify-center gap-2">
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                >
                  <Download size={16} />
                  Download QR
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
                >
                  Print QR
                </Button>
              </div>
            </div>
          )}

          {/* Full Attendance Page Link */}
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-white p-3 dark:bg-gray-900 dark:border-blue-900">
            <div>
              <p className="text-sm font-medium ">
                Full Attendance Management
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                View detailed attendance list and manage participants
              </p>
            </div>
            <Link href={`/u/events/attendance/${eventId}?mode=${eventType === 'offline' ? 'qr' : 'link'}`}>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                <ExternalLink size={16} />
                View Page
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className='dark:bg-background'>
        <CardHeader>
          <CardTitle className="text-sm ">
            How to use this attendance system:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {eventType === 'online' ? (
            <>
              <div className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Copy the attendance URL using the button above</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Share the link with participants via email, chat, or notification</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Participants click the link to mark their attendance online</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">4.</span>
                <span>Monitor attendance in real-time from the "View Page" link</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Display the QR code above on your screen at the event venue</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Participants open the event detail page and click "Scan QR Code"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>They scan the QR code to automatically mark attendance</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">4.</span>
                <span>Optionally download or print the QR code for easier display</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
