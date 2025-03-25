'use client';

import { UserAdmin } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@jsx-mail/ui/dialog';
import { ScrollArea } from '@jsx-mail/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jsx-mail/ui/table';

interface UtmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAdmin;
}

export function UtmsModal({ isOpen, onClose, user }: UtmsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User UTMs - {user.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UTM Name</TableHead>
                <TableHead>UTM Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.userUtm.map((utm, index) => (
                <TableRow key={index}>
                  <TableCell>{utm.utmName}</TableCell>
                  <TableCell>{utm.utmValue}</TableCell>
                </TableRow>
              ))}
              {user.userUtm.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No UTMs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
