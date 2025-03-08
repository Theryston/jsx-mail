import * as React from 'react';

import { cn } from '../lib/utils.js';
import { CalendarIcon } from 'lucide-react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        className={cn(
          'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-xl bg-zinc-900 px-3 py-1 shadow-xs text-sm transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:flex file:items-center file:justify-center',
          'focus-visible:bg-zinc-800 focus-visible:ring-zinc-800',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          type === 'date' &&
            '[&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:opacity-0',
          className,
        )}
        {...props}
      />

      {type === 'date' && (
        <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
    </div>
  );
}

export { Input };
