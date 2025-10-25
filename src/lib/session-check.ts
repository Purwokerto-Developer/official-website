export async function checkAuthenticated(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/check', { cache: 'no-store' });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data?.authenticated;
  } catch (err) {
    console.error('session-check failed', err);
    return false;
  }
}

export default checkAuthenticated;
