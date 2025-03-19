import { Placeholder, StarterKit } from 'novel';

const placeholder = Placeholder.configure({
  placeholder: 'Write something or type "/" for commands',
  includeChildren: true,
});

const starterKit = StarterKit.configure({
  codeBlock: {
    HTMLAttributes: {
      style:
        'background-color: #f0f0f0; padding: 10px; border-radius: 5px; color: #000;',
    },
  },
  heading: {
    levels: [1],
    HTMLAttributes: {
      style:
        'margin: 0px; padding: 0.389em 0px 0px; font-size: 2.25em; line-height: 1.44em; font-weight: 600;',
    },
  },
  blockquote: {
    HTMLAttributes: {
      style: 'border-left: 4px solid #ccc; padding-left: 10px;',
    },
  },
  listItem: {
    HTMLAttributes: {
      style: 'margin-left: 1.5em; list-style-type: disc;',
    },
  },
});

export const defaultExtensions = [starterKit, placeholder];
