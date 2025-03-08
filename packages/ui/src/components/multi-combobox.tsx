'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Button } from '@jsx-mail/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@jsx-mail/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';
import { Badge } from '@jsx-mail/ui/badge';
import { cn } from '@jsx-mail/ui/lib/utils';

export function MultiCombobox({
  items,
  values,
  onChange,
  placeholder = 'Select items...',
}: {
  items: { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (itemValue: string) => {
    if (values.includes(itemValue)) {
      onChange(values.filter((value) => value !== itemValue));
    } else {
      onChange([...values, itemValue]);
    }
  };

  const handleRemove = (itemValue: string) => {
    onChange(values.filter((value) => value !== itemValue));
  };

  const selectedItems = items.filter((item) => values.includes(item.value));

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between bg-zinc-900 border-none h-12 w-full rounded-xl text-sm active:scale-100 overflow-y-auto items-start',
            selectedItems.length > 0 && 'h-auto',
          )}
        >
          <div
            className={cn(
              'flex flex-wrap gap-1 items-center mt-1.5',
              selectedItems.length > 0 && 'mt-2 mb-2',
            )}
          >
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="mr-1 px-2 py-0"
                >
                  {item.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRemove(item.value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(item.value);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 mt-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] h-[300px] p-0" side="bottom">
        <Command>
          <CommandInput placeholder={placeholder} />

          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => handleSelect(item.value)}
                >
                  <div className="flex items-center gap-2">
                    {values.includes(item.value) ? (
                      <Check className="size-4" />
                    ) : (
                      <div className="w-4" />
                    )}
                    {item.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
