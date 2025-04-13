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
import { useMemo } from 'react';

interface UtmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAdmin;
}

export function UtmsModal({ isOpen, onClose, user }: UtmsModalProps) {
  const utmGroups = useMemo(() => {
    return (user.userUtmGroups || []).map(
      (group: { id: string; views?: { id: string; url: string }[] }) => ({
        id: group.id,
        views: group.views || [],
      }),
    );
  }, [user.userUtmGroups]);

  const totalViews = useMemo(() => {
    return utmGroups.reduce(
      (acc, group) => acc + (group.views?.length || 0),
      0,
    );
  }, [utmGroups]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User UTMs - {user.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-4">
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
            <p className="text-sm font-bold">Total views: {totalViews}</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>URL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utmGroups.map((group) =>
                  group.views?.map((view) => (
                    <TableRow key={view.id}>
                      <TableCell>{view.id}</TableCell>
                      <TableCell>{view.url}</TableCell>
                    </TableRow>
                  )),
                )}
                {utmGroups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No views found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
