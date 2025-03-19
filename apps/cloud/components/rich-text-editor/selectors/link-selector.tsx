import { useEditor } from 'novel';
import { Check, Trash } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@jsx-mail/ui/lib/utils';
import { Button } from '@jsx-mail/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}
export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;

  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch (e) {
    return null;
  }
}
interface LinkSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ open, onOpenChange }: LinkSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { editor } = useEditor();
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  if (!editor) return null;

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Store the current selection when opening
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setSavedSelection(selection.getRangeAt(0).cloneRange());
      }
    }
    onOpenChange(newOpen);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="gap-2 rounded-none border-none">
          <p className="text-base">↗</p>
          <p
            className={cn('underline decoration-stone-400 underline-offset-4', {
              'text-blue-500': editor.isActive('link'),
            })}
          >
            Link
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0" sideOffset={10}>
        <form
          onSubmit={(e) => {
            const target = e.currentTarget as HTMLFormElement;
            e.preventDefault();

            const input = target[0] as HTMLInputElement;
            const url = getUrlFromString(input.value);

            // Restore the selection before applying the link
            if (savedSelection && window.getSelection()) {
              const selection = window.getSelection();
              selection?.removeAllRanges();
              selection?.addRange(savedSelection);
            }

            // Now set the link with the restored selection
            const setLink = editor.chain().focus().setLink;
            if (!url && !!setLink) return;

            setLink({ href: url as string });
            onOpenChange(false);
          }}
          className="flex w-full p-1"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Paste a link"
            className="flex-1 bg-background p-1 text-sm w-full outline-none"
            defaultValue={editor.getAttributes('link').href || ''}
          />

          {editor.getAttributes('link').href ? (
            <Button
              size="icon"
              variant="outline"
              type="button"
              className="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
              onClick={() => {
                // Restore selection before unlinking
                if (savedSelection && window.getSelection()) {
                  const selection = window.getSelection();
                  selection?.removeAllRanges();
                  selection?.addRange(savedSelection);
                }
                editor.chain().focus().unsetLink().run();
                onOpenChange(false);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="icon">
              <Check className="size-4" />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};
