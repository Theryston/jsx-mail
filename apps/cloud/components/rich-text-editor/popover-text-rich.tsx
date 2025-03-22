'use client';

import { Check, ChevronDown, type LucideIcon } from 'lucide-react';
import { EditorBubbleItem, useEditor } from 'novel';

import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';
import { Button } from '@jsx-mail/ui/button';

export type PopoverTextRichItem = {
  command: (editor: ReturnType<typeof useEditor>['editor']) => void;
  name?: string;
  icon?: LucideIcon;
  content?: React.ReactNode;
  isActive?: (editor: ReturnType<typeof useEditor>['editor']) => boolean;
};

interface PopoverTextRichProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: PopoverTextRichItem[];
  title?: string;
  className?: string;
}

export const PopoverTextRich = ({
  open,
  onOpenChange,
  items,
  title = 'Options',
  className = '',
}: PopoverTextRichProps) => {
  const { editor } = useEditor();
  if (!editor) return null;

  const activeItem = items
    .filter((item) => item.isActive && item.isActive(editor))
    .pop() ?? {
    name: title,
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className={`gap-2 rounded-none border-none hover:bg-accent focus:ring-0 ${className}`}
      >
        <Button variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item, index) =>
          item.content ? (
            item.content
          ) : (
            <EditorBubbleItem
              key={index}
              onSelect={(editor) => {
                item.command(editor);
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border p-1">
                  {item.icon && <item.icon className="h-3 w-3" />}
                </div>
                <span>{item.name}</span>
              </div>
              {item.isActive && activeItem.name === item.name && (
                <Check className="h-4 w-4" />
              )}
            </EditorBubbleItem>
          ),
        )}
      </PopoverContent>
    </Popover>
  );
};
