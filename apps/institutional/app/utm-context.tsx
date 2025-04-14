import { useUtm } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type UtmContextType = {
  utmGroupId: string | null;
};

const UtmContext = createContext<UtmContextType>({} as UtmContextType);

export function UtmProvider({ children }: { children: React.ReactNode }) {
  const [utmGroupId, setUtmGroupId] = useState<string | null>(null);
  const { mutateAsync: createUtmOrView } = useUtm();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastProcessedUrl = useRef('');

  useEffect(() => {
    if (lastProcessedUrl.current === window.location.href) return;

    const utmSearchParams = [];
    const searchParamsEntries = Object.fromEntries(searchParams.entries());

    for (const [key, value] of Object.entries(searchParamsEntries)) {
      if (key.startsWith('utm_')) {
        utmSearchParams.push({
          utmName: key,
          utmValue: value,
        });
      }
    }

    const url = window.location.href;

    const utmGroupId = localStorage.getItem('utmGroupId');

    if (utmGroupId) setUtmGroupId(utmGroupId);

    createUtmOrView({
      url,
      utms: utmSearchParams,
      userUtmGroupId: utmGroupId ? utmGroupId : undefined,
    }).then((res) => {
      localStorage.setItem('utmGroupId', res.userUtmGroupId);
      setUtmGroupId(res.userUtmGroupId);
    });

    lastProcessedUrl.current = window.location.href;
  }, [pathname, searchParams]);

  return (
    <UtmContext.Provider value={{ utmGroupId }}>{children}</UtmContext.Provider>
  );
}

export function useUtmInfo() {
  return useContext(UtmContext);
}
