export function getCloudUrl(path: string) {
  if (typeof window === 'undefined') return `https://cloud.jsxmail.org${path}`;

  const currentUrl = new URL(window.location.href);
  const cloudUrl = new URL(`https://cloud.jsxmail.org${path}`);

  currentUrl.searchParams.forEach((value, key) => {
    cloudUrl.searchParams.set(key, value);
  });

  const url = cloudUrl.toString();

  console.log(url);

  return url;
}
