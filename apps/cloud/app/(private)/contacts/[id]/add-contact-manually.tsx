import { useCreateContactImport } from '@/hooks/contact-group';
import { useUploadFile } from '@/hooks/file';
import { Button } from '@jsx-mail/ui/button';
import {
  Dialog,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '@jsx-mail/ui/dialog';
import { toast } from '@jsx-mail/ui/sonner';
import { useCallback, useState } from 'react';

export default function AddContactManually({
  id,
  isOpen,
  onOpenChange,
}: {
  id: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: createContactImport } = useCreateContactImport(id);

  const handleImport = useCallback(async () => {
    setIsCreating(true);

    try {
      const cleanValue = value.trim();

      if (cleanValue.length === 0) {
        toast.error('Fill in the form first');
        return;
      }

      const csvContent = `name,email\n${cleanValue}`;

      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const file = new File([blob], 'contacts.csv', {
        type: 'text/csv;charset=utf-8;',
      });

      const createdFile = await uploadFile(file);

      await createContactImport({
        fileId: createdFile.id,
        emailColumn: 'email',
        nameColumn: 'name',
      });

      toast.success('Contacts import started successfully!');
      onOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  }, [value]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contacts Manually</DialogTitle>
          <DialogDescription>
            Add contacts manually to the contact group.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full h-48 bg-zinc-900 relative rounded-md">
          <div
            onInput={(e) => setValue(e.currentTarget.innerText)}
            contentEditable
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="text-sm w-full h-full p-2 absolute top-0 left-0 right-0 bottom-0 outline-none border-2 border-transparent focus:border-blue-900 rounded-md overflow-y-auto z-10"
          />

          {value.trim().length === 0 && !isFocused && (
            <p className="text-zinc-400 text-sm absolute top-2 left-2 z-20">
              john,john@example.com
              <br />
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Each contact should be on a new line, in the format:
          <br />
          name,email
          <br />
          <br />
          Enter &quot;_&quot; in the name field if you don&apos;t have a name.
          <br />
          Like this: _,john@example.com
        </p>

        <DialogFooter>
          <Button onClick={() => handleImport()} disabled={isCreating}>
            {isCreating ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
