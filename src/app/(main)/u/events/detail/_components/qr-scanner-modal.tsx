'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, X, Loader2, CheckCircle } from 'lucide-react';
import { showToast } from '@/components/custom-toaster';

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
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (open && !scannerRef.current) {
      // Add small delay to ensure DOM is ready
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

  const initializeScanner = async () => {
    try {
      setCameraError(null);
      
      // Check if DOM element exists before initializing
      const qrReaderElement = document.getElementById('qr-reader');
      if (!qrReaderElement) {
        console.error('QR reader element not found in DOM');
        setCameraError('Scanner initialization failed. Please try again.');
        return;
      }
      
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // QR Code detected
          setScanning(false);
          setProcessing(true);

          try {
            // Validate QR data
            const qrData = JSON.parse(decodedText);
            
            if (qrData.eventId !== eventId) {
              showToast('error', 'This QR code is for a different event');
              setProcessing(false);
              return;
            }

            // Call the attendance action
            await onScanSuccess(decodedText);
            
            setSuccess(true);
            setProcessing(false);
            
            // Close modal after 2 seconds
            setTimeout(() => {
              handleClose();
            }, 2000);
          } catch (error) {
            console.error('QR scan error:', error);
            showToast('error', 'Invalid QR code format');
            setProcessing(false);
            setScanning(true);
          }
        },
        (errorMessage) => {
          // Scanning in progress (not an error)
          if (!scanning) {
            setScanning(true);
          }
        }
      );
    } catch (error) {
      console.error('Failed to initialize scanner:', error);
      setCameraError('Failed to access camera. Please check permissions.');
      showToast('error', 'Camera access denied');
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
              className="w-full rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
            />
            
            {/* Scanning Overlay */}
            {scanning && !processing && !success && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Scan className="animate-pulse" size={24} />
                    <span className="font-medium">Scanning...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Overlay */}
            {processing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
                  <Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={32} />
                  <p className="font-medium">Verifying attendance...</p>
                  <p className="text-sm text-gray-500">Please wait</p>
                </div>
              </div>
            )}

            {/* Success Overlay */}
            {success && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center">
                  <CheckCircle className="mx-auto mb-2 text-green-600" size={48} />
                  <p className="font-bold text-green-600 text-lg">Attendance Confirmed!</p>
                  <p className="text-sm text-gray-500">Closing...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg text-center max-w-xs">
                  <X className="mx-auto mb-2 text-red-600" size={48} />
                  <p className="font-medium text-red-600 mb-2">Camera Error</p>
                  <p className="text-sm text-gray-600">{cameraError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {!processing && !success && !cameraError && (
            <div className="text-center space-y-2">
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
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex items-center gap-2"
              >
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

