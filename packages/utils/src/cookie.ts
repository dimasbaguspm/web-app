// Universal cookie reader: prefer the modern cookieStore API when available,
// otherwise fall back to document.cookie. Returns undefined when cookies
// are unavailable (e.g. some SSR environments).
type CookieStoreLike = {
  get?: (name: string) => Promise<{ name?: string; value?: string } | undefined>;
};

export async function getCookieValue(name: string): Promise<string | undefined> {
  try {
    const cs = (globalThis as unknown as { cookieStore?: CookieStoreLike }).cookieStore;
    if (cs && typeof cs.get === 'function') {
      const res = await cs.get(name);
      return res?.value;
    }

    if (typeof document !== 'undefined' && typeof document.cookie === 'string') {
      const match = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
      if (!match) return undefined;
      return decodeURIComponent(match.split('=').slice(1).join('='));
    }
  } catch {
    // swallow and return undefined - caller handles missing cookie
  }

  return undefined;
}
