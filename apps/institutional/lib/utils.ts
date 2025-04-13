export function getCloudUrl(path: string, utmGroupId: string | null) {
  if (typeof window === 'undefined') return `https://cloud.jsxmail.org${path}`;

  const cloudUrl = new URL(`https://cloud.jsxmail.org${path}`);

  if (utmGroupId) cloudUrl.searchParams.set('utmGroupId', utmGroupId);

  return cloudUrl.toString();
}
