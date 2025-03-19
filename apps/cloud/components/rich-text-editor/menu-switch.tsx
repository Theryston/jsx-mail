import { EditorBubble } from 'novel';
import { NodeSelector } from './selectors/node-selector';
import { useState } from 'react';
import { LinkSelector } from './selectors/link-selector';

export const MenuSwitch = () => {
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  return (
    <EditorBubble
      tippyOptions={{
        placement: 'top-start',
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      <NodeSelector open={openNode} onOpenChange={setOpenNode} />
      <LinkSelector open={openLink} onOpenChange={setOpenLink} />
    </EditorBubble>
  );
};
