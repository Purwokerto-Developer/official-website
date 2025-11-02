'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/better-auth/auth-client';
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
  const { data } = useSession();
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
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

      // fetch available cameras once
      try {
        const cams = await Html5Qrcode.getCameras();
        setCameras(cams.map((c: any) => ({ id: c.id, label: c.label || c.id })));
        if (cams && cams.length > 0 && !selectedCameraId) {
          setSelectedCameraId(cams[0].id);
        }
      } catch (err) {
        // ignore — not critical
      }

      // determine a responsive qrbox size based on container width
      let qrboxSize = 250;
      try {
        const rect = qrReaderElement.getBoundingClientRect();
        qrboxSize = Math.max(160, Math.min(360, Math.floor(rect.width * 0.75)));
      } catch (err) {
        // fallback to default
      }

      const cameraConfig = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : { facingMode: 'environment' };

      await html5QrCode.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1,
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
            // useSession provides the client session data; if there's no user we redirect to login
            if (!data?.user) {
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

  const handleSwitchCamera = async () => {
    // cycle through available cameras
    if (!cameras || cameras.length <= 1) return;
    const idx = cameras.findIndex((c) => c.id === selectedCameraId);
    const next = cameras[(idx + 1) % cameras.length];
    setSelectedCameraId(next.id);

    // restart scanner with new camera
    await stopScanning();
    setTimeout(() => initializeScanner(), 200);
  };

  const handleScanFile = async (file: File | null) => {
    if (!file) return;
    setProcessing(true);
    setCameraError(null);
    try {
      if (scannerRef.current && (scannerRef.current as any).scanFile) {
        const result = await (scannerRef.current as any).scanFile(file, true);
        // simulate callback flow
        await onScanSuccess(result);
        setSuccess(true);
        setTimeout(() => handleClose(), 1200);
      } else {
        setCameraError('File scanning not supported in this browser.');
      }
    } catch (err) {
      console.error('File scan error:', err);
      setCameraError('No QR code found in the selected image.');
    }
    setProcessing(false);
  };

  const handleSubmitManual = async () => {
    if (!manualCode) return setCameraError('Please enter a code.');
    setProcessing(true);
    try {
      await onScanSuccess(manualCode);
      setSuccess(true);
      setTimeout(() => handleClose(), 1200);
    } catch (err) {
      console.error('Manual scan error:', err);
      setCameraError('Failed to verify the provided code.');
    }
    setProcessing(false);
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
            {/* Controls toolbar */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              {cameras && cameras.length > 0 && (
                <button
                  title="Switch camera"
                  onClick={handleSwitchCamera}
                  className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/90 backdrop-blur-sm"
                >
                  {cameras.length > 1 ? 'Switch Camera' : 'Camera'}
                </button>
              )}

              <label className="cursor-pointer rounded-md bg-white/10 px-2 py-1 text-xs text-white/90 backdrop-blur-sm">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleScanFile(e.target.files ? e.target.files[0] : null)}
                />
              </label>

              <button
                onClick={() => setShowManualInput((s) => !s)}
                className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/90 backdrop-blur-sm"
              >
                Manual
              </button>
            </div>

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

              {/* Manual input area */}
              {showManualInput && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Paste QR payload or token"
                    className="w-2/3 rounded-md border px-2 py-1 text-sm"
                  />
                  <Button onClick={handleSubmitManual} className="text-sm">
                    Submit
                  </Button>
                </div>
              )}
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
