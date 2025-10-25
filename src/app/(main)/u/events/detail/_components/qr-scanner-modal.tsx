'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import checkAuthenticated from '@/lib/session-check';
import buildLoginUrl from '@/lib/redirect-with-next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, X, Loader2, CheckCircle } from 'lucide-react';

interface QRScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => Promise<void>;
  eventId: string;
}

export default function QRScannerModal({
  open,
  onClose,
  onScanSuccess,
  eventId,
}: QRScannerModalProps) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanLineTop, setScanLineTop] = useState(20); // percent
  const scanLineRef = useRef<number | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (open && !scannerRef.current) {
      const timer = setTimeout(() => {
        initializeScanner();
      }, 100);

      return () => clearTimeout(timer);
    }

    return () => {
      if (scannerRef.current) {
        stopScanning();
      }
    };
  }, [open]);

  useEffect(() => {
    // animate a simple scan-line while scanning
    if (scanning && !processing && !success) {
      scanLineRef.current = window.setInterval(() => {
        setScanLineTop((t) => (t >= 80 ? 20 : t + 12));
      }, 300);
    } else if (scanLineRef.current) {
      window.clearInterval(scanLineRef.current);
      scanLineRef.current = null;
    }

    return () => {
      if (scanLineRef.current) {
        window.clearInterval(scanLineRef.current);
        scanLineRef.current = null;
      }
    };
  }, [scanning, processing, success]);

  const initializeScanner = async () => {
    try {
      setCameraError(null);

      const qrReaderElement = document.getElementById('qr-reader');
      if (!qrReaderElement) {
        setCameraError('Scanner initialization failed. Please try again.');
        return;
      }

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          setScanning(false);
          setProcessing(true);

          try {
            // Validate QR data
            const qrData = JSON.parse(decodedText);

            if (qrData.eventId !== eventId) {
              // show inline error instead of toast to avoid duplicates
              setCameraError('This QR code is for a different event.');
              setProcessing(false);
              // allow scanning again
              setTimeout(() => {
                setCameraError(null);
                setScanning(true);
              }, 1500);
              return;
            }

            // Auth pre-check: ensure user still authenticated before proceeding
            const authenticated = await checkAuthenticated();
            if (!authenticated) {
              setProcessing(false);

              // stop scanner and redirect to login with next intent
              if (scannerRef.current) {
                try {
                  await scannerRef.current.stop();
                  scannerRef.current.clear();
                  scannerRef.current = null;
                } catch (err) {
                  console.error('Error stopping scanner during redirect:', err);
                }
              }

              router.push(buildLoginUrl(`/u/events/${eventId}`, 'attend'));
              return;
            }

            // Call the attendance action (parent handles success/error toasts)
            await onScanSuccess(decodedText);

            setSuccess(true);
            setProcessing(false);

            // Close modal after short delay
            setTimeout(() => {
              handleClose();
            }, 1500);
          } catch (error) {
            console.error('QR scan error:', error);
            setCameraError('Invalid QR code format.');
            setProcessing(false);
            // resume scanning after short delay
            setTimeout(() => {
              setCameraError(null);
              setScanning(true);
            }, 1200);
          }
        },
        () => {
          if (!scanning) {
            setScanning(true);
          }
        },
      );
    } catch (error) {
      console.error('Failed to initialize scanner:', error);
      setCameraError('Failed to access camera. Please check permissions.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    if (scanLineRef.current) {
      window.clearInterval(scanLineRef.current);
      scanLineRef.current = null;
    }
  };

  const handleClose = async () => {
    await stopScanning();
    setScanning(false);
    setProcessing(false);
    setSuccess(false);
    setCameraError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan size={20} />
            Scan QR Code for Attendance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Camera Preview */}
          <div className="relative">
            <div
              id="qr-reader"
              className="h-64 w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-black dark:border-gray-700"
            />

            {/* Animated Scanning Overlay (pulsing frame + moving scan-line) */}
            {scanning && !processing && !success && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg border-2 border-dashed border-blue-400 opacity-80" />
                <div
                  className="absolute right-2 left-2 h-0.5 rounded bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-90"
                  style={{
                    top: `${scanLineTop}%`,
                    transition: 'top 300ms linear',
                    boxShadow: '0 0 12px rgba(59,130,246,0.6)',
                  }}
                />
                <div className="z-10 flex flex-col items-center gap-2">
                  <Scan className="animate-pulse text-blue-400" size={28} />
                  <span className="text-sm font-medium text-white/90">Scanning...</span>
                </div>
              </div>
            )}

            {/* Processing Overlay */}
            {processing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                <div className="rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
                  <Loader2 className="mx-auto mb-2 animate-spin text-blue-600" size={32} />
                  <p className="font-medium">Verifying attendance...</p>
                  <p className="text-sm text-gray-500">Please wait</p>
                </div>
              </div>
            )}

            {/* Success Overlay */}
            {success && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                <div className="rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
                  <CheckCircle className="mx-auto mb-2 text-green-600" size={48} />
                  <p className="text-lg font-bold text-green-600">Attendance Confirmed!</p>
                  <p className="text-sm text-gray-500">Closing...</p>
                </div>
              </div>
            )}

            {/* Error Overlay (inline) */}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                <div className="max-w-xs rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
                  <X className="mx-auto mb-2 text-red-600" size={40} />
                  <p className="mb-2 font-medium text-red-600">Error</p>
                  <p className="text-sm text-gray-600">{cameraError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {!processing && !success && !cameraError && (
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Point your camera at the QR code displayed by the admin
              </p>
              <p className="text-xs text-gray-500">
                The scanner will automatically detect and verify the code
              </p>
            </div>
          )}

          {/* Cancel Button */}
          {!processing && !success && (
            <div className="flex justify-center">
              <Button onClick={handleClose} variant="outline" className="flex items-center gap-2">
                <X size={16} />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
