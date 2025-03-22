import { cn } from '@jsx-mail/ui/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@jsx-mail/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export function SmallCard({
  title,
  value,
  description,
  valueColor = 'primary',
}: {
  title: string;
  value: string;
  valueColor?: 'primary' | 'destructive';
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-8 bg-zinc-900 p-4 rounded-2xl">
      <div className="flex items-center gap-1">
        <h2 className="text-xs font-medium">{title}</h2>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p className="text-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
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
