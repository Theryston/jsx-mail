import { Skeleton } from '@nextui-org/react';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  className?: string;
  height?: string;
  width?: string;
  isLoading?: boolean;
};

export default function Card({
  children,
  height,
  width,
  isLoading,
  className,
}: Props) {
  return (
    <div
      className={clsx('bg-zinc-900 rounded-2xl overflow-hidden', className, {
        'w-full': !width,
        'h-full': !height,
        'p-5': !isLoading,
      })}
      style={{
        height,
        width,
      }}
    >
      {isLoading ? <Skeleton className="w-full h-full" /> : children}
    </div>
  );
}
