import { useCreateContactImport } from '@/hooks/bulk-sending';
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

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-48 bg-zinc-900 relative rounded-md p-2 outline-none text-sm"
          placeholder="john,john@example.com"
        />

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
