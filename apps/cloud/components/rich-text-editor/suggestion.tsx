import { Command, createSuggestionItems, renderItems } from 'novel';
import { CodeIcon, Heading1Icon, ListIcon, QuoteIcon } from 'lucide-react';

export const suggestionItems = createSuggestionItems([
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    searchTerms: ['codeblock'],
    icon: <CodeIcon size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Heading 1',
    description: 'Add a heading 1.',
    searchTerms: ['h1'],
    icon: <Heading1Icon size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run(),
  },
  {
    title: 'Quote',
    description: 'Add a quote.',
    searchTerms: ['quote'],
    icon: <QuoteIcon size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: 'Bullet List',
    description: 'Add a bullet list.',
    searchTerms: ['bullet'],
    icon: <ListIcon size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
]);

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
