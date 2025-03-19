import {
  Heading1,
  TextQuote,
  TextIcon,
  Code,
  type LucideIcon,
  ListIcon,
} from 'lucide-react';
import { useEditor } from 'novel';

import {
  PopoverTextRich,
  type PopoverTextRichItem,
} from '../popover-text-rich';

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
  return (
    <PopoverTextRich
      open={open}
      onOpenChange={onOpenChange}
      items={items as PopoverTextRichItem[]}
      title="Multiple"
    />
  );
};
