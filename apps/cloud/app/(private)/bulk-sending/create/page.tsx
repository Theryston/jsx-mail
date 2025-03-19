'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Container } from '@/components/container';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContactGroups } from '@/hooks/contact-group';
import { useSenders } from '@/hooks/sender';
import { Check, ChevronsUpDown, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import { Textarea } from '@jsx-mail/ui/textarea';
import { toast } from '@jsx-mail/ui/sonner';
import { cn } from '@jsx-mail/ui/lib/utils';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@jsx-mail/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';
import { AddSenderModal } from '../../senders/add-sender-modal';
import { CreateContactGroupModal } from '../../contacts/create-contact-group-modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import { ContactGroup } from '@/types/contact-group';

export default function BulkSendingCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialContactGroupId = searchParams.get('contactGroupId');

  const [from, setFrom] = useState('');
  const [subject, setSubject] = useState('');
  const [toGroupId, setToGroupId] = useState(initialContactGroupId || '');
  const [content, setContent] = useState('');
  const [createSenderOpen, setCreateSenderOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOpenSendModal, setIsOpenSendModal] = useState(false);
  const [fromSearchOpen, setFromSearchOpen] = useState(false);
  const [toSearchOpen, setToSearchOpen] = useState(false);
  const [fromSearchQuery, setFromSearchQuery] = useState('');
  const [toSearchQuery, setToSearchQuery] = useState('');
  const { data: contactGroupsPagination } = useContactGroups();

  useEffect(() => {
    if (initialContactGroupId) {
      setToGroupId(initialContactGroupId);
    }
  }, [initialContactGroupId]);

  const handleSendEmail = useCallback(() => {
    if (!from || !subject || !toGroupId || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    const contactGroup = contactGroupsPagination?.contactGroups.find(
      (g) => g.id === toGroupId,
    );

    if (!contactGroup) {
      toast.error('Contact group not found');
      return;
    }

    if (contactGroup.contactsCount === 0) {
      toast.error('Contact group is empty please add some contacts');
      return;
    }

    setIsSending(true);

    try {
      // TODO: Implement bulk sending
      toast.success('Bulk sending started');
    } finally {
      setIsSending(false);
    }
  }, [from, subject, toGroupId, content, router, contactGroupsPagination]);

  return (
    <Container header>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">New Bulk Email</h1>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <SenderSelector
              from={from}
              setFrom={setFrom}
              fromSearchOpen={fromSearchOpen}
              setFromSearchOpen={setFromSearchOpen}
              fromSearchQuery={fromSearchQuery}
              setFromSearchQuery={setFromSearchQuery}
              setCreateSenderOpen={setCreateSenderOpen}
            />

            <ContactGroupSelector
              toGroupId={toGroupId}
              setToGroupId={setToGroupId}
              toSearchOpen={toSearchOpen}
              setToSearchOpen={setToSearchOpen}
              toSearchQuery={toSearchQuery}
              setToSearchQuery={setToSearchQuery}
              setCreateGroupOpen={setCreateGroupOpen}
              setNewGroupName={setNewGroupName}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <div className="rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden">
              <Input
                placeholder="Enter email subject. You can use variables from the contact, like {{name}} or {{email}}."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              placeholder="Enter email content (HTML supported). You can use variables from the contact, like {{name}} or {{email}}."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] bg-zinc-900 border-zinc-700 rounded-xl resize-none"
            />
          </div>

          <Button
            disabled={isSending}
            onClick={() => setIsOpenSendModal(true)}
            size="sm"
            className="ml-auto"
          >
            Send bulk email
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <AddSenderModal
        isOpen={createSenderOpen}
        onClose={() => setCreateSenderOpen(false)}
        onCreated={(sender) => {
          setFrom(sender.email);
          setCreateSenderOpen(false);
        }}
        defaultUsername={fromSearchQuery.split('@')[0]?.trim()}
        defaultName={fromSearchQuery.split('@')[0]?.trim()}
        defaultDomain={fromSearchQuery.split('@')[1]?.trim()}
      />

      <CreateContactGroupModal
        isOpen={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        defaultName={newGroupName}
      />

      <SendModal
        isOpen={isOpenSendModal}
        onClose={() => setIsOpenSendModal(false)}
        onSend={handleSendEmail}
        from={from}
        to={toGroupId}
        subject={subject}
        content={content}
        contactGroup={
          contactGroupsPagination?.contactGroups.find(
            (g) => g.id === toGroupId,
          ) || null
        }
      />
    </Container>
  );
}

function SendModal({
  isOpen,
  onClose,
  onSend,
  contactGroup,
  from,
  to,
  subject,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  contactGroup: ContactGroup | null;
  from: string;
  to: string;
  subject: string;
  content: string;
}) {
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const messages = [];

    if (!from) {
      messages.push('No from (sender) selected');
    }

    if (!to) {
      messages.push('No to (contact group) selected');
    }

    if (!subject) {
      messages.push('No subject selected');
    }

    if (!content) {
      messages.push('No content selected');
    }

    if (!contactGroup) {
      messages.push('No contact group selected');
    } else if (contactGroup.contactsCount === 0) {
      messages.push(`No contacts in ${contactGroup?.name}`);
    }

    setValidationMessages(messages);
  }, [from, to, subject, content, contactGroup]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateDragPosition(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateDragPosition(e.clientX);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      if (dragProgress > 0.9) {
        // If dragged more than 90% of the way
        onSend();
        onClose();
      }
      setIsDragging(false);
      setDragProgress(0);
    }
  }, [isDragging, dragProgress, onSend, onClose]);

  const updateDragPosition = (clientX: number) => {
    if (!sliderRef.current || !buttonRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const maxDrag = sliderRect.width - buttonRect.width;

    const dragX = Math.max(
      0,
      Math.min(clientX - sliderRect.left - buttonRect.width / 2, maxDrag),
    );
    const progress = dragX / maxDrag;
    setDragProgress(progress);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ready to send?</DialogTitle>
          {contactGroup && (
            <DialogDescription>
              Are you sure you want to send this email to{' '}
              {contactGroup?.contactsCount} contacts from {contactGroup?.name}?
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {validationMessages.map((message, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-amber-500 text-sm"
            >
              <AlertTriangle size={16} />
              <span>{message}</span>
            </div>
          ))}

          {validationMessages.length === 0 && (
            <div
              ref={sliderRef}
              className="relative h-12 bg-zinc-800 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400 pointer-events-none">
                Slide to send
              </div>
              <button
                ref={buttonRef}
                className={cn(
                  'absolute left-0 top-0 h-full px-4 bg-zinc-700 rounded-lg cursor-grab active:cursor-grabbing transition-colors',
                  isDragging && 'bg-zinc-600',
                )}
                style={{
                  transform: `translateX(${dragProgress * (sliderRef.current?.offsetWidth || 0)}px)`,
                  maxWidth: 'calc(100% - 8px)',
                }}
                onMouseDown={handleMouseDown}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SenderSelector({
  from,
  setFrom,
  fromSearchOpen,
  setFromSearchOpen,
  fromSearchQuery,
  setFromSearchQuery,
  setCreateSenderOpen,
}: {
  from: string;
  setFrom: (from: string) => void;
  fromSearchOpen: boolean;
  setFromSearchOpen: (fromSearchOpen: boolean) => void;
  fromSearchQuery: string;
  setFromSearchQuery: (fromSearchQuery: string) => void;
  setCreateSenderOpen: (createSenderOpen: boolean) => void;
}) {
  const { data: senders } = useSenders();

  const fromSearchQueryClean = useMemo(() => {
    return fromSearchQuery.trim().toLowerCase();
  }, [fromSearchQuery]);

  const filteredSenders = useMemo(() => {
    const result =
      senders?.filter((sender) => {
        return (
          sender.email.toLowerCase().includes(fromSearchQueryClean) ||
          sender.name.toLowerCase().includes(fromSearchQueryClean)
        );
      }) || [];

    return result;
  }, [senders, fromSearchQueryClean]);

  return (
    <div className="flex-1">
      <label className="text-sm font-medium mb-2 block">From</label>
      <Popover open={fromSearchOpen} onOpenChange={setFromSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={fromSearchOpen}
            className="justify-between bg-zinc-900 border border-zinc-700 h-12 w-full rounded-xl text-sm"
          >
            {from ? from : 'Select a sender'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search senders..."
              value={fromSearchQuery}
              onValueChange={setFromSearchQuery}
            />
            <CommandList>
              {filteredSenders.length > 0 && (
                <CommandGroup heading="Senders">
                  {filteredSenders.map((sender) => (
                    <CommandItem
                      key={sender.id}
                      value={sender.email}
                      onSelect={(value) => {
                        setFrom(value);
                        setFromSearchOpen(false);
                        setFromSearchQuery('');
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {from === sender.email ? (
                          <Check className="size-4" />
                        ) : (
                          <div className="w-4" />
                        )}
                        <div className="flex flex-col">
                          <span>{sender.email}</span>
                          <span className="text-xs text-zinc-400">
                            {sender.name}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {filteredSenders.length === 0 && (
                <CommandGroup>
                  <CommandItem>
                    <button
                      className="p-2 w-full flex items-center gap-2 hover:bg-zinc-800"
                      onClick={() => {
                        setCreateSenderOpen(true);
                        setFromSearchOpen(false);
                      }}
                    >
                      <div className="flex text-left">
                        <span>
                          Create new sender
                          {fromSearchQuery.length > 0 ? ': ' : ''}
                        </span>
                        <span className="font-medium ml-1">
                          {fromSearchQuery}
                        </span>
                      </div>
                    </button>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ContactGroupSelector({
  toGroupId,
  setToGroupId,
  toSearchOpen,
  setToSearchOpen,
  toSearchQuery,
  setToSearchQuery,
  setCreateGroupOpen,
  setNewGroupName,
}: {
  toGroupId: string;
  setToGroupId: (toGroupId: string) => void;
  toSearchOpen: boolean;
  setToSearchOpen: (toSearchOpen: boolean) => void;
  toSearchQuery: string;
  setToSearchQuery: (toSearchQuery: string) => void;
  setCreateGroupOpen: (createGroupOpen: boolean) => void;
  setNewGroupName: (newGroupName: string) => void;
}) {
  const { data: contactGroupsPagination } = useContactGroups();

  const toSearchQueryClean = useMemo(() => {
    return toSearchQuery.trim().toLowerCase();
  }, [toSearchQuery]);

  const filteredContactGroups = useMemo(() => {
    const result =
      contactGroupsPagination?.contactGroups.filter((group) => {
        return group.name.toLowerCase().includes(toSearchQueryClean);
      }) || [];

    return result;
  }, [contactGroupsPagination, toSearchQueryClean]);

  return (
    <div className="flex-1">
      <label className="text-sm font-medium mb-2 block">To</label>
      <Popover open={toSearchOpen} onOpenChange={setToSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={toSearchOpen}
            className="justify-between bg-zinc-900 border border-zinc-700 h-12 w-full rounded-xl text-sm"
          >
            {toGroupId
              ? contactGroupsPagination?.contactGroups.find(
                  (g) => g.id === toGroupId,
                )?.name || 'Loading...'
              : 'Select a contact group'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search contact groups..."
              value={toSearchQuery}
              onValueChange={setToSearchQuery}
            />
            <CommandList>
              {filteredContactGroups.length > 0 && (
                <CommandGroup heading="Contact Groups">
                  {filteredContactGroups.map((group) => (
                    <CommandItem
                      key={group.id}
                      value={group.name}
                      onSelect={() => {
                        setToGroupId(group.id);
                        setToSearchOpen(false);
                        setToSearchQuery('');
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {toGroupId === group.id ? (
                          <Check className="size-4" />
                        ) : (
                          <div className="w-4" />
                        )}
                        <div className="flex flex-col">
                          <span>{group.name}</span>
                          <span className="text-xs text-zinc-400">
                            {group.contactsCount} contacts
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {filteredContactGroups.length === 0 && (
                <CommandGroup>
                  <CommandItem>
                    <button
                      className="p-2 w-full flex items-center gap-2 hover:bg-zinc-800"
                      onClick={() => {
                        setNewGroupName(toSearchQuery);
                        setCreateGroupOpen(true);
                        setToSearchOpen(false);
                      }}
                    >
                      <div className="flex text-left">
                        <span>
                          Create new contact group
                          {toSearchQuery.length > 0 ? ': ' : ''}
                        </span>
                        <span className="font-medium ml-1">
                          {toSearchQuery}
                        </span>
                      </div>
                    </button>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
