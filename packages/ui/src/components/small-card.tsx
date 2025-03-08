import { cn } from '@jsx-mail/ui/lib/utils';

export function SmallCard({
  title,
  value,
  valueColor = 'primary',
}: {
  title: string;
  value: string;
  valueColor?: 'primary' | 'destructive';
}) {
  return (
    <div className="flex flex-col gap-8 bg-zinc-900 p-4 rounded-2xl">
      <h2 className="text-xs font-medium">{title}</h2>
      <p
        className={cn(
          'text-3xl font-bold',
          valueColor === 'primary' ? 'text-primary' : 'text-destructive',
        )}
      >
        {value}
      </p>
    </div>
  );
}
