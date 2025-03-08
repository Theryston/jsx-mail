import { cn } from '../lib/utils.js';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-zinc-900 animate-pulse rounded-lg', className)}
      {...props}
    />
  );
}

export { Skeleton };
