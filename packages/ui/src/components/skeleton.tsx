import { cn } from '@jsx-mail/ui/lib/utils';

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
