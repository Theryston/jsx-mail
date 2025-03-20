import { Bold } from 'lucide-react';
import { useEditor } from 'novel';
import { Button } from '@jsx-mail/ui/button';

interface BoldSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BoldSelector = ({ open, onOpenChange }: BoldSelectorProps) => {
  const { editor } = useEditor();

  if (!editor) return null;

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
    onOpenChange(false);
  };

  const isActive = editor.isActive('bold');

  return (
    <Button
      variant="ghost"
      className="gap-2 rounded-none border-none"
      onClick={toggleBold}
      aria-pressed={isActive}
      data-state={open ? 'open' : 'closed'}
    >
      <Bold
        className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
      />
    </Button>
  );
};
