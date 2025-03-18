'use client';

import { useMe } from '@/hooks/user';
import { CloudSidebar } from '@/components/cloud-sidebar';
import { SidebarProvider } from '@jsx-mail/ui/sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';
import { titleCase } from '@/utils/title-case';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: me, error, isPending } = useMe();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (me?.name) Crisp.user.setNickname(me.name);
    if (me?.email) Crisp.user.setEmail(me.email);
    if (me?.phone) Crisp.user.setPhone(me.phone);
  }, [me]);

  useEffect(() => {
    if (me?.onboardingStep !== 'completed' && pathname !== '/onboarding') {
      router.push('/onboarding');
      return;
    }

    if (me?.onboardingStep === 'completed' && pathname === '/onboarding') {
      router.push('/');
      return;
    }
  }, [pathname, me?.onboardingStep]);

  if (isPending) {
    console.log('isPending');
    return <Loading />;
  }

  if (!me) {
    console.log('no me');
    router.push('/sign-in');
    return null;
  }

  if (error) {
    console.log('error');
    router.push('/sign-in');
    return null;
  }

  return (
    <SidebarProvider>
      {pathname !== '/onboarding' && <CloudSidebar />}

      {me?.session?.impersonateUserId && (
        <div className="fixed bottom-0 right-0 py-2 px-4 bg-black/70 rounded-tl-xl z-50">
          <p className="text-white text-sm">
            Impersonating {titleCase(me.name)}
          </p>
        </div>
      )}

      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}

function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center px-4 text-center">
      <h1 className="text-2xl font-bold">Loading{dots}</h1>
      <p className="text-muted-foreground text-xs animate-pulse">
        Please wait while we load your data
      </p>
    </div>
  );
}
