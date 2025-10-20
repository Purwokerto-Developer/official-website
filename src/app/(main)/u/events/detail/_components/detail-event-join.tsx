'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EventDetail } from '@/types/event-type';
import { Airdrop, Calendar, Colorfilter, InfoCircle, Location, WristClock } from 'iconsax-reactjs';
import { useEffect, useMemo, useState } from 'react';
import {
  joinEvent,
  setAttendanceOpen,
  checkUserEventStatus,
  cancelEventJoin,
  markAttendance,
  attendEventViaQR,
} from '@/action/event-action';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getServerSession } from '@/lib/better-auth/get-session';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Scan } from 'lucide-react';
import QRScannerModal from './qr-scanner-modal';
import { showToast } from '@/components/custom-toaster';

type DetailEventJoinProps = {
  data: EventDetail;
  adminMode?: boolean;
  userRole?: string;
};

export const DetailEventJoin = ({ data, adminMode, userRole }: DetailEventJoinProps) => {
  const router = useRouter();
  const eventDate = useMemo(() => new Date(data.start_time), [data.start_time]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [userStatus, setUserStatus] = useState<{
    isJoined: boolean;
    hasAttended: boolean;
  }>({ isJoined: false, hasAttended: false });
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  // Check user status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkUserEventStatus(data.id);
        if (result.success && result.data) {
          setUserStatus(result.data);
        }
      } catch (error) {
        console.error('Failed to check user status:', error);
      }
    };

    if (!adminMode) {
      checkStatus();
    }
  }, [data.id, adminMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  const formattedTime = useMemo(() => {
    try {
      const d = new Date(data.start_time);
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(d);
    } catch {
      return String(data.start_time);
    }
  }, [data.start_time]);

  // Action handlers for user actions
  const handleJoin = async () => {
    setJoining(true);
    try {
      const result = await joinEvent(data.id);
      if (result.success) {
        setUserStatus((prev) => ({ ...prev, isJoined: true }));
      }
    } catch (error) {
      console.error('Failed to join event:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleCancelJoin = async () => {
    setLoading(true);
    try {
      const result = await cancelEventJoin(data.id);
      if (result.success) {
        setUserStatus((prev) => ({ ...prev, isJoined: false }));
      }
    } catch (error) {
      console.error('Failed to cancel join:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrData: string) => {
    try {
      const result = await attendEventViaQR(qrData);
      if (result.success) {
        setUserStatus((prev) => ({ ...prev, hasAttended: true }));
        // Toast hanya dipanggil sekali di sini
        showToast('success', 'Attendance confirmed via QR!');
        // Jangan langsung refresh, biarkan user melihat toast
        setTimeout(() => router.refresh(), 1200);
      } else {
        // Handle already attended case gracefully
        if (result.error?.includes('already marked attendance')) {
          setUserStatus((prev) => ({ ...prev, hasAttended: true }));
          showToast('success', 'Attendance already recorded for this event');
          setTimeout(() => router.refresh(), 1200);
        } else {
          showToast('error', result.error || 'Failed to verify attendance');
        }
        // Don't throw error - handle gracefully
      }
    } catch (error) {
      console.error('QR scan failed:', error);
      showToast('error', 'Failed to process QR code');
      // Don't throw error - handle gracefully
    }
  };

  return (
    <div className="flex w-full flex-col justify-between gap-8 md:flex-row md:gap-8 lg:gap-12 xl:gap-16">
      {/* Kiri – Banner */}
      <div className="relative flex h-64 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 sm:h-96 md:h-[700px] dark:bg-neutral-900">
        {/* event image */}
        <Image
          src={data.image ?? '/event-banner.jpg'}
          alt={data.title}
          fill
          className="object-cover"
          priority={false}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Kanan – Detail & Status */}
      <div className="w-full space-y-6 md:w-6/12">
        {/* CARD STATUS */}
        <Card className="bg-card border-primary/20 rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="mb-2 flex items-center gap-2">
              <Calendar size="20" variant="Bulk" className="text-primary" />
              <span className="font-medium">Event starts in</span>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-sm ${
                data.is_attendance_open
                  ? 'bg-green-600/10 text-green-600'
                  : 'bg-red-600/10 text-red-600'
              }`}
            >
              {data.is_attendance_open ? 'Open' : 'Closed'}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Countdown */}
            <div>
              <div className="flex justify-between gap-2">
                {/* Hari */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.days}</span>
                  <span className="text-xs">Days</span>
                </div>
                {/* Jam */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.hours}</span>
                  <span className="text-xs">Hours</span>
                </div>
                {/* Menit */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.minutes}</span>
                  <span className="text-xs">Minutes</span>
                </div>
                {/* Detik */}
                <div className="flex w-1/4 flex-col items-center justify-center rounded-md bg-slate-100 px-4 py-3 dark:bg-neutral-800">
                  <span className="text-primary text-2xl font-bold">{timeLeft.seconds}</span>
                  <span className="text-xs">Seconds</span>
                </div>
              </div>
            </div>

            {/* Attendance Status Alert - hanya tampil jika user sudah join */}
            {userStatus.isJoined && (
              <div
                className={`flex items-start gap-2 rounded-md border-none p-3 text-sm ${
                  data.is_attendance_open
                    ? 'bg-green-600/10 text-green-600'
                    : 'bg-yellow-600/10 text-yellow-600'
                }`}
              >
                <InfoCircle size="18" className="mt-0.5" />
                {data.is_attendance_open
                  ? 'Attendance is open. You can mark your attendance.'
                  : 'Attendance is closed.'}
              </div>
            )}

            {/* Primary action buttons - differs for admin vs user */}
            {adminMode ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="gradient_blue"
                    className="mt-3 w-full rounded-full"
                    disabled={joining}
                  >
                    {data.is_attendance_open ? 'Close Attendance' : 'Open Attendance'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background rounded-xl border-0 shadow-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {data.is_attendance_open
                        ? 'Close attendance session?'
                        : 'Open attendance session?'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {data.is_attendance_open
                        ? 'Participants will no longer be able to mark attendance.'
                        : 'Participants will be able to mark attendance.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-primary hover:bg-primary/90"
                      onClick={async () => {
                        setJoining(true);
                        await setAttendanceOpen(data.id, !data.is_attendance_open);
                        setJoining(false);
                        router.refresh();
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div className="space-y-3">
                {/* Action Buttons - Only show if not attended */}
                {!userStatus.hasAttended && (
                  <div className="space-y-2">
                    {!userStatus.isJoined ? (
                      <Button
                        onClick={handleJoin}
                        variant="gradient_blue"
                        className="w-full rounded-full"
                        disabled={joining || new Date(data.start_time) < new Date()}
                      >
                        {new Date(data.start_time) < new Date()
                          ? 'Event Ended'
                          : joining
                            ? 'Joining...'
                            : 'Join Event'}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        {/* Online Event - Show attendance link button */}
                        {data.event_type === 'online' && (
                          <div className="space-y-4">
                            <Button
                              onClick={handleCancelJoin}
                              variant="outline"
                              className="w-full flex-1 rounded-full"
                              disabled={loading || new Date(data.start_time) < new Date()}
                            >
                              {loading ? 'Cancelling...' : 'Cancel Join'}
                            </Button>

                            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-950">
                              <InfoCircle size={16} className="text-blue-600 dark:text-blue-400" />
                              <AlertTitle className="text-blue-900 dark:text-blue-100">
                                {data.is_attendance_open
                                  ? 'Attendance is Open'
                                  : 'Waiting for Attendance'}
                              </AlertTitle>
                              <AlertDescription className="text-blue-700 dark:text-blue-300">
                                {data.is_attendance_open
                                  ? 'Admin will provide the attendance link shortly.'
                                  : 'Attendance will open soon. You will be able to mark attendance when ready.'}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}

                        {/* Offline Event - Show QR scan button */}
                        {data.event_type === 'offline' && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Button
                                onClick={handleCancelJoin}
                                variant="outline"
                                className="flex-1 rounded-full"
                                disabled={loading || new Date(data.start_time) < new Date()}
                              >
                                {loading ? 'Cancelling...' : 'Cancel Join'}
                              </Button>
                              <Button
                                onClick={() => setScannerOpen(true)}
                                variant="gradient_blue"
                                className="flex-1 rounded-full"
                                disabled={loading || !data.is_attendance_open}
                              >
                                <Scan size={16} className="mr-2" />
                                {data.is_attendance_open ? 'Scan QR Code' : 'Scan (Not Open)'}
                              </Button>
                            </div>
                            <Alert className="border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950">
                              <Scan size={16} className="text-green-600 dark:text-green-400" />
                              <AlertTitle className="text-green-900 dark:text-green-100">
                                {data.is_attendance_open
                                  ? 'QR Scanner Ready'
                                  : 'Waiting for QR Code'}
                              </AlertTitle>
                              <AlertDescription className="text-green-700 dark:text-green-300">
                                {data.is_attendance_open
                                  ? 'Scan the QR code displayed by the admin to mark your attendance.'
                                  : 'QR code will be available when attendance opens.'}
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Show attended status message when user has already attended */}
                {userStatus.hasAttended && (
                  <div className="space-y-2">
                    <Alert className="border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-900 dark:text-green-100">
                        Attendance Confirmed
                      </AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-300">
                        You have successfully attended this event. Thank you for participating!
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* QR Scanner Modal for Offline Events */}
                {data.event_type === 'offline' && (
                  <QRScannerModal
                    open={scannerOpen}
                    onClose={() => setScannerOpen(false)}
                    onScanSuccess={handleQRScan}
                    eventId={data.id}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <div>
          <h3 className="mb-1 font-semibold">Description</h3>
          <p className="text-sm">{data.description ?? '-'}</p>
        </div>

        {/* Detail */}
        <div>
          <h3 className="mb-1 font-semibold">Detail</h3>
          <div className="flex flex-col gap-5">
            {/* Location */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Location size="20" variant="Bulk" className="text-primary" />
                <span className="">{data.event_type === 'online' ? 'Meeting' : 'Location'}</span>
              </div>
              {data.location_name ? (
                data.location_url && new Date(data.start_time) > new Date() ? (
                  <Link
                    href={data.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary text-sm underline underline-offset-4"
                  >
                    {data.location_name}
                  </Link>
                ) : (
                  <span
                    className={`text-sm ${new Date(data.start_time) <= new Date() ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}
                  >
                    {data.location_name}
                    {new Date(data.start_time) <= new Date() && (
                      <span className="ml-1 text-xs text-red-500">(Event Expired)</span>
                    )}
                  </span>
                )
              ) : (
                <p className="text-muted-foreground text-sm">Not specified</p>
              )}
            </div>

            {/* Event type */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Airdrop size="20" className="text-primary" variant="Bulk" />
                <span className="">Event type</span>
              </div>
              <p className="text-muted-foreground text-sm">{data.event_type}</p>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <WristClock size="20" className="text-primary" variant="Bulk" />
                <span className="">Time</span>
              </div>
              <p className="text-muted-foreground text-sm">{formattedTime}</p>
            </div>

            {/* Collaborator */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Colorfilter size="20" variant="Bulk" className="text-primary" />
                <span className="">Collaborator</span>
              </div>
              <p className="text-muted-foreground text-sm">{data.collaborator_name ?? '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
