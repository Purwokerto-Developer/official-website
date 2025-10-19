import { randomBytes } from 'crypto';

export interface QRAttendanceData {
  eventId: string;
  token: string;
  timestamp: number;
  type: 'event_attendance';
}

/**
 * Generate a secure random token for QR code
 */
export function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create QR data string for attendance
 */
export function createQRData(eventId: string, token: string): string {
  const data: QRAttendanceData = {
    eventId,
    token,
    timestamp: Date.now(),
    type: 'event_attendance',
  };
  return JSON.stringify(data);
}

/**
 * Parse and validate QR data
 */
export function parseQRData(qrString: string): QRAttendanceData | null {
  try {
    const data = JSON.parse(qrString) as QRAttendanceData;
    
    // Validate structure
    if (
      !data.eventId ||
      !data.token ||
      !data.timestamp ||
      data.type !== 'event_attendance'
    ) {
      return null;
    }

    // Check if QR is not too old (e.g., 24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - data.timestamp > maxAge) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Validate QR token against stored token
 */
export function validateQRToken(
  scannedToken: string,
  storedToken: string
): boolean {
  return scannedToken === storedToken;
}

