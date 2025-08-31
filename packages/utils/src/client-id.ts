import { useState } from 'react';

/**
 * Client ID configuration options
 */
export interface ClientIdOptions {
  /** localStorage key name for storing the client ID */
  name?: string;
  /** Custom prefix for the generated ID */
  idPrefix?: string;
}

// Default configuration for client ID generation (uses localStorage key).
const DEFAULT_OPTIONS: ClientIdOptions = {
  name: 'client_id',
  idPrefix: 'moekthy',
};

/**
 * Generate a browser fingerprint based on available browser features
 */
function generateBrowserFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Canvas fingerprint
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Client fingerprint', 2, 2);
  }
  const canvasFingerprint = canvas.toDataURL();

  // Collect browser characteristics
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || '',
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    canvas: canvasFingerprint.slice(-50), // Last 50 chars to reduce size
    webgl: getWebGLFingerprint(),
    localStorage: isStorageAvailable('localStorage'),
    sessionStorage: isStorageAvailable('sessionStorage'),
    indexedDB: 'indexedDB' in window,
  };

  // Create hash from fingerprint
  return hashString(JSON.stringify(fingerprint));
}

/**
 * Get WebGL fingerprint
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) return '';

    // Type assertion for WebGL context
    const webglContext = gl as WebGLRenderingContext;
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');

    if (debugInfo) {
      return (
        webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) +
        webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      );
    }

    return (
      webglContext.getParameter(webglContext.VENDOR) +
      webglContext.getParameter(webglContext.RENDERER)
    );
  } catch {
    return '';
  }
}

/**
 * Check if storage is available
 */
function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Simple hash function for strings
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a random UUID-like string
 */
function generateRandomId(): string {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Persist value to localStorage (synchronous). We intentionally only use
 * localStorage in this refactor to keep behavior consistent across
 * environments and to make APIs synchronous.
 */
function setStoredValue(name: string, value: string): void {
  try {
    window.localStorage.setItem(name, value);
  } catch (e) {
    // ignore localStorage failures (e.g., quota, disabled)
    // Keep silent to avoid throwing from storage helpers
    console.warn('localStorage.setItem failed for', name, e);
  }
}

/**
 * Read value from localStorage (synchronous).
 */
function getStoredValue(name: string): string | null {
  try {
    return window.localStorage.getItem(name);
  } catch (e) {
    console.warn('localStorage.getItem failed for', name, e);
    return null;
  }
}

/**
 * Generate and persist a client ID
 */
export function generateClientId(options: ClientIdOptions = {}): string {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Check if we already have a client ID in localStorage
    const existingId = getStoredValue(config.name ?? 'client_id');
    if (existingId) {
      return existingId;
    }

    // Generate new client ID
    const browserFingerprint = generateBrowserFingerprint();
    const randomId = generateRandomId();
    const timestamp = Date.now().toString(36);

    const clientId = `${config.idPrefix}_${browserFingerprint}_${randomId}_${timestamp}`;

    setStoredValue(config.name ?? 'client_id', clientId);

    return clientId;
  } catch (error) {
    console.error('Failed to generate client ID:', error);

    // Emergency fallback
    const fallbackId = `${config.idPrefix}_fallback_${generateRandomId()}_${Date.now().toString(36)}`;

    try {
      setStoredValue(config.name ?? 'client_id', fallbackId);
    } catch {
      // ignore
    }

    return fallbackId;
  }
}

/**
 * Get existing client ID or generate a new one
 */
export function getClientId(options: ClientIdOptions = {}): string {
  const config = { ...DEFAULT_OPTIONS, ...options };

  // Try to get existing ID first (localStorage)
  const existingId = getStoredValue(config.name ?? 'client_id');
  if (existingId) return existingId;

  // Generate new ID if none exists
  return generateClientId(options);
}

/**
 * Clear the client ID (useful for logout/reset)
 */
export function clearClientId(options: ClientIdOptions = {}): void {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    try {
      window.localStorage.removeItem(config.name ?? 'client_id');
    } catch (e) {
      // ignore localStorage removal failures
      console.warn('localStorage.removeItem failed for', config.name, e);
    }
  } catch (error) {
    console.error('Failed to clear client ID:', error);
  }
}

/**
 * React hook for managing client ID
 */
export function useClientId(options: ClientIdOptions = {}) {
  const [clientId, setClientId] = useState<string | null>(getClientId(options));

  const refreshClientId = () => {
    setClientId(generateClientId(options));
  };

  return {
    clientId,
    refreshClientId,
  };
}

/**
 * Validate if a client ID has the expected format
 */
export function isValidClientId(clientId: string, prefix?: string): boolean {
  if (!clientId || typeof clientId !== 'string') {
    return false;
  }

  const expectedPrefix = prefix || DEFAULT_OPTIONS.idPrefix;
  return (
    clientId.startsWith(`${expectedPrefix}_`) && clientId.split('_').length >= 4
  );
}

/**
 * Extract information from a client ID
 */
export function parseClientId(clientId: string): {
  prefix: string;
  browserFingerprint: string;
  ipHash?: string;
  randomId: string;
  timestamp: string;
  createdAt: Date;
} | null {
  if (!isValidClientId(clientId)) {
    return null;
  }

  const parts = clientId.split('_');
  const hasIpHash = parts.length === 6;

  return {
    prefix: parts[0],
    browserFingerprint: parts[1],
    ipHash: hasIpHash ? parts[2] : undefined,
    randomId: hasIpHash ? parts[3] : parts[2],
    timestamp: hasIpHash ? parts[4] : parts[3],
    createdAt: new Date(parseInt(hasIpHash ? parts[4] : parts[3], 36)),
  };
}
