// GitHub PAT cookie (ks-gh-token), written by admin-worker via Set-Cookie
// (URI-encoded plain value). Pages are prerendered, so readTokenFromCookies
// only ever sees a value when an SSR context exists; it is a no-op at build.
const COOKIE_NAME = 'ks-gh-token';

export function readTokenFromCookies(cookies: { get: (name: string) => { value: string } | undefined }): string | null {
  const raw = cookies.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export const TOKEN_COOKIE_NAME = COOKIE_NAME;
