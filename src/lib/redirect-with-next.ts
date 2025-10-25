export function isSafeInternalPath(path?: string) {
  if (!path) return false;
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.includes('://')) return false;
  return true;
}

export function buildLoginUrl(next?: string, action?: string) {
  const params = new URLSearchParams();
  if (next && isSafeInternalPath(next)) {
    params.set('next', next);
  }
  if (action) {
    params.set('action', action);
  }
  const qs = params.toString();
  return `/login${qs ? `?${qs}` : ''}`;
}

export default buildLoginUrl;

export const isSafeNext = isSafeInternalPath;
