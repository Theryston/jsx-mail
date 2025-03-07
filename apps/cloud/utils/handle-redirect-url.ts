import { toast } from '@jsx-mail/ui/sonner';

const ALLOWED_DOMAINS = ['localhost'];

export default function handleRedirectUrl(searchParams: any) {
  let url = '';
  const currentDomain = window.location.hostname;
  const currentBaseURL = window.location.origin;
  const defaultRedirect = `${currentBaseURL}/auth?redirect=${encodeURIComponent(`${currentBaseURL}/app`)}`;
  const searchRedirect = searchParams && searchParams.get('redirect');

  url = searchRedirect ? searchRedirect : defaultRedirect;

  const urlDomain = new URL(url).hostname;

  if (urlDomain !== currentDomain && !ALLOWED_DOMAINS.includes(urlDomain)) {
    toast.error('Invalid redirect URL');
    url = defaultRedirect;
  }

  return url;
}
