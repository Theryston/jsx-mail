'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/container';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContactGroups, useCreateContactGroup } from '@/hooks/contact-group';
import { useSenders } from '@/hooks/sender';
import { Check, ChevronsUpDown, ArrowRight } from 'lucide-react';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import { Textarea } from '@jsx-mail/ui/textarea';
import { toast } from '@jsx-mail/ui/sonner';
import { cn } from '@jsx-mail/ui/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@jsx-mail/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';
import { PaginationControls } from '@jsx-mail/ui/pagination-controls';
import { AddSenderModal } from '../../senders/add-sender-modal';

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
  const [groupRedirectOpen, setGroupRedirectOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [sendProgress, setSendProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [contactGroupPage, setContactGroupPage] = useState(1);
  const [fromSearchOpen, setFromSearchOpen] = useState(false);
  const [toSearchOpen, setToSearchOpen] = useState(false);
  const [fromSearchQuery, setFromSearchQuery] = useState('');
  const [toSearchQuery, setToSearchQuery] = useState('');

  const { data: contactGroupsPagination } = useContactGroups(contactGroupPage);
  const { mutateAsync: createContactGroup, isPending: isCreatingGroup } =
    useCreateContactGroup();

  useEffect(() => {
    if (initialContactGroupId) {
      setToGroupId(initialContactGroupId);
    }
  }, [initialContactGroupId]);

  const filteredContactGroups =
    contactGroupsPagination?.contactGroups.filter((group) =>
      group.name.toLowerCase().includes(toSearchQuery.toLowerCase()),
    ) || [];

  const handlePageChange = (page: number) => {
    setContactGroupPage(page);
  };

  const handleCreateGroup = async () => {
    if (!newGroupName) {
      toast.error('Please provide a group name');
      return;
    }

    try {
      const created = await createContactGroup(newGroupName);
      setToGroupId(created.id);
      setCreateGroupOpen(false);
      toast.success(`Contact group "${newGroupName}" created`);
      setGroupRedirectOpen(true);
    } catch (error) {
      toast.error('Failed to create contact group');
      console.error(error);
    }
  };

  const handleSendEmail = useCallback(() => {
    if (!from || !subject || !toGroupId || !content) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSending(true);

    const interval = setInterval(() => {
      setSendProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setSendProgress(100);
      setIsSending(false);

      toast.success('Email sent successfully');
      router.push('/sending-history');
    }, 3000);
  }, [from, subject, toGroupId, content, router]);

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

            {/* To field - Contact Group selection */}
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
                  <Command>
                    <CommandInput
                      placeholder="Search contact groups..."
                      value={toSearchQuery}
                      onValueChange={setToSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {toSearchQuery ? (
                          <button
                            className="p-2 w-full flex items-center gap-2 hover:bg-zinc-800"
                            onClick={() => {
                              setNewGroupName(toSearchQuery);
                              setCreateGroupOpen(true);
                              setToSearchOpen(false);
                            }}
                          >
                            <div className="flex text-left">
                              <span>Create group: </span>
                              <span className="font-medium ml-1">
                                {toSearchQuery}
                              </span>
                            </div>
                          </button>
                        ) : (
                          'No contact groups found'
                        )}
                      </CommandEmpty>
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
                    </CommandList>
                    {contactGroupsPagination &&
                      contactGroupsPagination.totalPages > 1 && (
                        <div className="flex justify-center p-2 border-t border-zinc-700">
                          <PaginationControls
                            currentPage={contactGroupPage}
                            totalPages={contactGroupsPagination.totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <Input
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-zinc-900 border-zinc-700 h-12 rounded-xl"
            />
          </div>

          {/* Content field */}
          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              placeholder="Enter email content (HTML supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] bg-zinc-900 border-zinc-700 rounded-xl resize-none"
            />
          </div>

          {/* Send button */}
          <div className="mt-6">
            <div
              className={cn(
                'bg-zinc-800 rounded-full h-14 flex items-center cursor-pointer relative overflow-hidden',
                isSending ? 'pointer-events-none' : '',
              )}
              onMouseDown={(e) => {
                const container = e.currentTarget;
                const initialX = e.clientX;
                const containerWidth = container.getBoundingClientRect().width;

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const deltaX = moveEvent.clientX - initialX;
                  const progress = Math.min(
                    100,
                    Math.max(0, (deltaX / (containerWidth * 0.75)) * 100),
                  );
                  setSendProgress(progress);

                  if (progress >= 100) {
                    handleSendEmail();
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  }
                };

                const handleMouseUp = () => {
                  if (sendProgress < 100) {
                    setSendProgress(0);
                  }
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-green-600/20 transition-all"
                style={{ width: `${sendProgress}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <span className="font-medium">
                  {isSending ? 'Sending...' : 'Slide to send'}
                </span>
                <ArrowRight className="size-4" />
              </div>
            </div>
          </div>
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

      <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Contact Group</DialogTitle>
            <DialogDescription>
              Add a new contact group for your recipients.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                placeholder="My Newsletter Subscribers"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="bg-zinc-900 border-zinc-700"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateGroupOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={isCreatingGroup || !newGroupName}
            >
              {isCreatingGroup ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Group Redirect Dialog */}
      <Dialog open={groupRedirectOpen} onOpenChange={setGroupRedirectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Group Created</DialogTitle>
            <DialogDescription>
              Your contact group has been created successfully.
            </DialogDescription>
          </DialogHeader>

          <p className="py-2">Do you want to add contacts to this group now?</p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGroupRedirectOpen(false)}
            >
              No, Continue Here
            </Button>
            <Button
              onClick={() => {
                router.push(`/contacts/${toGroupId}`);
              }}
            >
              Yes, Add Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
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
