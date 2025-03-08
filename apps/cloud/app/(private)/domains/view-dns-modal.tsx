'use client';

import { Domain } from '@/types/domain';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jsx-mail/ui/table';
import { Button } from '@jsx-mail/ui/button';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@jsx-mail/ui/sonner';

interface ViewDNSModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: Domain;
}

export function ViewDNSModal({ isOpen, onClose, domain }: ViewDNSModalProps) {
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const copyToClipboard = (text: string, recordId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(recordId);
    toast.success('Copied to clipboard');

    setTimeout(() => {
      setCopiedRecord(null);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {domain.status === 'verified' ? 'DNS Records' : 'Verify Domain'}
          </DialogTitle>
          <DialogDescription>
            {domain.status === 'verified'
              ? `DNS records for ${domain.name}`
              : `Add these DNS records to verify ${domain.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[90vh]">
          <div className="space-y-4">
            {domain.status !== 'verified' && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 text-amber-500">
                <p className="text-sm">
                  Your domain is not verified yet. Please add the following DNS
                  records to your domain provider to verify ownership.
                </p>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead className="w-[100px]">Copy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domain.dnsRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {record.value}
                    </TableCell>
                    <TableCell>{record.ttl}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(record.value, record.id)}
                      >
                        {copiedRecord === record.id ? (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
