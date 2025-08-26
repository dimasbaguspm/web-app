import { useEffect, useState } from 'react';

/**
 * Client ID configuration options
 */
export interface ClientIdOptions {
  /** Cookie name for storing the client ID */
  cookieName?: string;
  /** Cookie expiration in days */
  expirationDays?: number;
  /** Custom domain for the cookie (defaults to current domain) */
  domain?: string;
  /** Whether the cookie should be secure (HTTPS only) */
  secure?: boolean;
  /** SameSite attribute for the cookie */
  sameSite?: 'strict' | 'lax' | 'none';
  /** Whether to use session storage as fallback */
  useSessionStorage?: boolean;
  /** Custom prefix for the generated ID */
  idPrefix?: string;
}

/**
 * Default configuration for client ID generation
 */
const DEFAULT_OPTIONS: Required<ClientIdOptions> = {
  cookieName: 'client_id',
  expirationDays: 365,
  domain: '.dimasbaguspm.com',
  secure: true,
  sameSite: 'lax',
  useSessionStorage: true,
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
 * Set cookie using Cookie Store API with fallback
 */
async function setCookieValue(
  name: string,
  value: string,
  options: ClientIdOptions,
): Promise<void> {
  const expires = new Date();
  expires.setDate(
    expires.getDate() +
      (options.expirationDays || DEFAULT_OPTIONS.expirationDays),
  );

  // Try Cookie Store API first (modern browsers)
  if ('cookieStore' in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window as any).cookieStore.set({
        name,
        value,
        expires: expires.getTime(),
        domain: options.domain || window.location.hostname,
        sameSite: options.sameSite || 'lax',
      });
      return;
    } catch (e) {
      console.warn(
        'Cookie Store API failed, falling back to document.cookie',
        e,
      );
    }
  }

  // Fallback to document.cookie
  let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure !== false && window.location.protocol === 'https:') {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get cookie value using Cookie Store API with fallback
 */
async function getCookieValue(name: string): Promise<string | null> {
  // Try Cookie Store API first
  if ('cookieStore' in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cookie = await (window as any).cookieStore.get(name);
      return cookie?.value || null;
    } catch (e) {
      console.warn(
        'Cookie Store API failed, falling back to document.cookie',
        e,
      );
    }
  }

  // Fallback to document.cookie
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

/**
 * Generate and persist a client ID
 */
export async function generateClientId(
  options: ClientIdOptions = {},
): Promise<string> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Check if we already have a client ID
    const existingId = await getCookieValue(config.cookieName);
    if (existingId) {
      return existingId;
    }

    // Check session storage as fallback
    if (config.useSessionStorage && isStorageAvailable('sessionStorage')) {
      const sessionId = sessionStorage.getItem(config.cookieName);
      if (sessionId) {
        // Move from session storage to cookie
        await setCookieValue(config.cookieName, sessionId, config);
        return sessionId;
      }
    }

    // Generate new client ID
    const browserFingerprint = generateBrowserFingerprint();
    const randomId = generateRandomId();
    const timestamp = Date.now().toString(36);

    const clientId = `${config.idPrefix}_${browserFingerprint}_${randomId}_${timestamp}`;

    // Store in cookie
    await setCookieValue(config.cookieName, clientId, config);

    // Store in session storage as backup
    if (config.useSessionStorage && isStorageAvailable('sessionStorage')) {
      sessionStorage.setItem(config.cookieName, clientId);
    }

    return clientId;
  } catch (error) {
    console.error('Failed to generate client ID:', error);

    // Emergency fallback
    const fallbackId = `${config.idPrefix}_fallback_${generateRandomId()}_${Date.now().toString(36)}`;

    // Try to store fallback
    if (config.useSessionStorage && isStorageAvailable('sessionStorage')) {
      sessionStorage.setItem(config.cookieName, fallbackId);
    }

    return fallbackId;
  }
}

/**
 * Get existing client ID or generate a new one
 */
export async function getClientId(
  options: ClientIdOptions = {},
): Promise<string> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  // Try to get existing ID first
  const existingId = await getCookieValue(config.cookieName);
  if (existingId) {
    return existingId;
  }

  // Generate new ID if none exists
  return generateClientId(options);
}

/**
 * Clear the client ID (useful for logout/reset)
 */
export async function clearClientId(
  options: ClientIdOptions = {},
): Promise<void> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Clear from Cookie Store API
    if ('cookieStore' in window) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).cookieStore.delete(config.cookieName);
      } catch (e) {
        console.warn('Cookie Store API delete failed:', e);
      }
    }

    // Clear from document.cookie (fallback)
    document.cookie = `${config.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

    // Clear from session storage
    if (config.useSessionStorage && isStorageAvailable('sessionStorage')) {
      sessionStorage.removeItem(config.cookieName);
    }
  } catch (error) {
    console.error('Failed to clear client ID:', error);
  }
}

/**
 * React hook for managing client ID
 */
export function useClientId(options: ClientIdOptions = {}) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeClientId = async () => {
      try {
        const id = await getClientId(options);
        if (isMounted) {
          setClientId(id);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setClientId(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeClientId();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(options)]);

  const refreshClientId = async () => {
    setLoading(true);
    setError(null);

    try {
      await clearClientId(options);
      const newId = await generateClientId(options);
      setClientId(newId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return {
    clientId,
    loading,
    error,
    refreshClientId,
    clearClientId: () => clearClientId(options),
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
