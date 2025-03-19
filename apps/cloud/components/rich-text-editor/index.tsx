'use client';

import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
} from 'novel';
import { useState } from 'react';
import { JSONContent } from '@tiptap/react';
import { defaultExtensions } from './extensions';
import { slashCommand, suggestionItems } from './suggestion';
import { LinkSelector } from './selectors/link-selector';
import { NodeSelector } from './selectors/node-selector';

export function RichTextEditor({
  setContent: setContentHtml,
  content: contentHtml,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const [openLink, setOpenLink] = useState(false);
  const [openNode, setOpenNode] = useState(false);
  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const extensions = [...defaultExtensions, slashCommand];

  console.log('contentHtml', contentHtml);

  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        initialContent={content}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          const html = editor.getHTML();
          setContent(json);
          setContentHtml(html);
        }}
        editorProps={{
          attributes: {
            class: 'min-h-[300px] outline-none text-sm',
          },
        }}
      >
        <EditorBubble
          tippyOptions={{
            placement: 'bottom-start',
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
        </EditorBubble>
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
