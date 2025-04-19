import * as React from 'react';

import { cn } from '@jsx-mail/ui/lib/utils';
import { CalendarIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { toast } from '@jsx-mail/ui/sonner';

type InputProps = React.ComponentProps<'input'> & {
  copyIcon?: boolean;
};

function Input({ className, type, copyIcon, ...props }: InputProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (props.value && typeof props.value === 'string') {
      navigator.clipboard
        .writeText(props.value)
        .then(() => {
          setCopied(true);
          toast.success('Copied to clipboard');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          toast.error('Failed to copy');
        });
    }
  };

  return (
    <div className="relative w-full">
      <input
        type={type}
        data-slot="input"
        className={cn(
          'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-xl bg-zinc-900 px-3 py-1 shadow-xs text-sm transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:flex file:items-center file:justify-center',
          'focus-visible:bg-zinc-800 focus-visible:ring-zinc-800',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          type === 'date' &&
            '[&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:opacity-0',
          copyIcon && 'pr-10',
          className,
        )}
        {...props}
      />

      {type === 'date' && (
        <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}

      {copyIcon && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}

export { Input };
