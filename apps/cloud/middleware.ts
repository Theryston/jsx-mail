import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/app')) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = redirectUrl.pathname.replace('/app', '');

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}
