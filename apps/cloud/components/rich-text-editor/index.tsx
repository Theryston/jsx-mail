'use client';

import {
  EditorCommand,
  handleCommandNavigation,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  handleImagePaste,
  handleImageDrop,
  ImageResizer,
} from 'novel';
import { defaultExtensions } from './extensions';
import { slashCommand, suggestionItems } from './suggestion';
import { uploadFn } from './image-upload';
import { MenuSwitch } from './menu-switch';

const processContent = (content: string) => {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" /><style>body{font-family:"Roboto",sans-serif;}</style></head><body>${content}</body></html>`;
};

export function RichTextEditor({
  setContent: setContentHtml,
  content: contentHtml,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const extensions = [...defaultExtensions, slashCommand];

  console.log(contentHtml);

  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          setContentHtml(processContent(html));
        }}
        editorProps={{
          attributes: {
            class: 'min-h-[300px] outline-none text-sm',
          },
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
        }}
        slotAfter={<ImageResizer />}
      >
        <MenuSwitch />
        <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
}
