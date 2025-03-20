import { EditorBubble } from 'novel';
import { NodeSelector } from './selectors/node-selector';
import { useState } from 'react';
import { LinkSelector } from './selectors/link-selector';
import { BoldSelector } from './selectors/bold-selector';

export const MenuSwitch = () => {
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openBold, setOpenBold] = useState(false);

  return (
    <EditorBubble
      tippyOptions={{
        placement: 'top-start',
      }}
      className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      <NodeSelector open={openNode} onOpenChange={setOpenNode} />
      <LinkSelector open={openLink} onOpenChange={setOpenLink} />
      <BoldSelector open={openBold} onOpenChange={setOpenBold} />
    </EditorBubble>
  );
};
