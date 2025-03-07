import { NextRequest, NextResponse } from 'next/server';

const publicRoutes: { path: string; whenAuthenticated: 'next' | 'redirect' }[] =
  [
    { path: '/sign-in', whenAuthenticated: 'next' },
    { path: '/sign-up', whenAuthenticated: 'next' },
    { path: '/security-code', whenAuthenticated: 'next' },
    { path: '/password-recovery', whenAuthenticated: 'next' },
    { path: '/password-reset', whenAuthenticated: 'next' },
    { path: '/auth', whenAuthenticated: 'next' },
  ];

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/sign-in';
const REDIRECT_WHEN_AUTHENTICATED = '/';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/app')) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = redirectUrl.pathname.replace('/app', '');

    return NextResponse.redirect(redirectUrl);
  }

  const publicRoute = publicRoutes.find((route) => route.path === pathname);
  const authToken = request.cookies.get('token');

  if (!authToken && publicRoute) return NextResponse.next();

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED;

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
    // try {
    //   const decoded = jwt.verify(
    //     authToken.value,
    //     process.env.JWT_SECRET as string,
    //   );
    //   if (!decoded) {
    //     throw new Error('Invalid token');
    //   }
    //   return NextResponse.next();
    // } catch {
    //   const redirectUrl = request.nextUrl.clone();
    //   redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    //   return NextResponse.redirect(redirectUrl);
    // }
  }

  return NextResponse.next();
}
