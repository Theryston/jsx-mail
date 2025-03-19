import {
  Check,
  ChevronDown,
  Heading1,
  TextQuote,
  TextIcon,
  Code,
  type LucideIcon,
  ListIcon,
} from 'lucide-react';
import { EditorBubbleItem, useEditor } from 'novel';

import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';
import { Button } from '@jsx-mail/ui/button';

export type SelectorItem = {
  name: string;
  icon: LucideIcon;
  command: (editor: ReturnType<typeof useEditor>['editor']) => void;
  isActive: (editor: ReturnType<typeof useEditor>['editor']) => boolean;
};

const items: SelectorItem[] = [
  {
    name: 'Text',
    icon: TextIcon,
    command: (editor) => {
      if (!editor) return;
      editor.chain().focus().toggleNode('paragraph', 'paragraph').run();
    },
    isActive: (editor) => {
      if (!editor) return false;
      return (
        editor.isActive('paragraph') &&
        !editor.isActive('bulletList') &&
        !editor.isActive('orderedList')
      );
    },
  },
  {
    name: 'Heading 1',
    icon: Heading1,
    command: (editor) => {
      if (!editor) return;
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
    isActive: (editor) => {
      if (!editor) return false;
      return editor.isActive('heading', { level: 1 });
    },
  },
  {
    name: 'Bullet List',
    icon: ListIcon,
    command: (editor) => {
      if (!editor) return;
      editor.chain().focus().toggleBulletList().run();
    },
    isActive: (editor) => {
      if (!editor) return false;
      return editor.isActive('bulletList');
    },
  },
  {
    name: 'Quote',
    icon: TextQuote,
    command: (editor) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .toggleNode('paragraph', 'paragraph')
        .toggleBlockquote()
        .run();
    },
    isActive: (editor) => {
      if (!editor) return false;
      return editor.isActive('blockquote');
    },
  },
  {
    name: 'Code',
    icon: Code,
    command: (editor) => {
      if (!editor) return;
      editor.chain().focus().toggleCodeBlock().run();
    },
    isActive: (editor) => {
      if (!editor) return false;
      return editor.isActive('codeBlock');
    },
  },
];
interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: 'Multiple',
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="gap-2 rounded-none border-none hover:bg-accent focus:ring-0"
      >
        <Button variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
        {items.map((item, index) => (
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
                <item.icon className="h-3 w-3" />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <Check className="h-4 w-4" />}
          </EditorBubbleItem>
        ))}
      </PopoverContent>
    </Popover>
  );
};
