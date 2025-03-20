'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Container } from '@/components/container';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContactGroups, useCreateBulkSending } from '@/hooks/bulk-sending';
import { useSenders } from '@/hooks/sender';
import {
  Check,
  ChevronsUpDown,
  ArrowRight,
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import { toast } from '@jsx-mail/ui/sonner';
import { cn } from '@jsx-mail/ui/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@jsx-mail/ui/tabs';
import EditorCode from '@monaco-editor/react';

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
import { BulkSendingVariable, ContactGroup } from '@/types/bulk-sending';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Badge } from '@jsx-mail/ui/badge';
import { Label } from '@jsx-mail/ui/label';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@jsx-mail/ui/select';

const defaultVariables: Omit<BulkSendingVariable, 'placements'>[] = [
  {
    key: 'name',
    from: 'contact',
    fromKey: 'name',
    isMapped: true,
    isDefault: true,
    description: 'The name of the contact',
  },
  {
    key: 'email',
    from: 'contact',
    fromKey: 'email',
    isMapped: true,
    isDefault: true,
    description: 'The email of the contact',
  },
  {
    key: 'unsubscribeUrl',
    from: 'contact',
    fromKey: 'unsubscribeUrl',
    isMapped: true,
    isDefault: true,
    description: 'The unsubscribe url of the contact',
  },
  {
    key: 'contactCreatedAt',
    from: 'contact',
    fromKey: 'createdAt',
    isMapped: true,
    isDefault: true,
    description: 'The created at date of the contact',
  },
  {
    key: 'bulkSendingCreatedAt',
    from: 'bulk_sending',
    fromKey: 'createdAt',
    isMapped: true,
    isDefault: true,
    description: 'The created at date of the bulk sending',
  },
];

const AVAILABLE_KEYS = {
  contact: ['name', 'email', 'unsubscribeUrl', 'createdAt'],
  bulk_sending: ['createdAt'],
};

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
  const { mutateAsync: createBulkSending } = useCreateBulkSending();
  const [isHtml, setIsHtml] = useState(false);
  const [variables, setVariables] = useState<BulkSendingVariable[]>([]);
  const [selectedVariable, setSelectedVariable] =
    useState<BulkSendingVariable | null>(null);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);

  const allVariables = useMemo(() => {
    const variablesSet = new Set<string>();

    (content.match(/{{[^}]+}}/g) || []).forEach((v) =>
      variablesSet.add(v.replace(/{{|}}/g, '')),
    );

    (subject.match(/{{[^}]+}}/g) || []).forEach((v) =>
      variablesSet.add(v.replace(/{{|}}/g, '')),
    );

    return Array.from(variablesSet);
  }, [content, subject]);

  useEffect(() => {
    const variablesWithDefault = allVariables
      .map((v) => {
        const variable = defaultVariables.find((v2) => v2.key === v);

        if (variable) return variable;

        return false;
      })
      .filter((v) => v) as BulkSendingVariable[];
    const variablesWithoutDefault = allVariables
      .filter((v) => !defaultVariables.find((v2) => v2.key === v))
      .map((v) => ({
        key: v,
        from: '',
        fromKey: v,
        isMapped: false,
      }));

    setVariables((prev) => {
      let newVariables = [...prev];

      for (const v of variablesWithDefault) {
        const existingVariable = newVariables.find((v2) => v2.key === v.key);

        if (existingVariable) continue;

        newVariables.push({
          ...v,
          placements: [],
        });
      }

      for (const v of variablesWithoutDefault) {
        const existingVariable = newVariables.find((v2) => v2.key === v.key);

        if (existingVariable) continue;

        newVariables.push({
          ...v,
          placements: [],
        });
      }

      newVariables = newVariables.filter((v) => allVariables.includes(v.key));

      return newVariables;
    });
  }, [allVariables]);

  useEffect(() => {
    if (initialContactGroupId) setToGroupId(initialContactGroupId);
  }, [initialContactGroupId]);

  const handleSendEmail = useCallback(async () => {
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

    if (
      variables.some((v) => v.placements.includes('subject') && !v.isMapped)
    ) {
      toast.error('Please map all variables in the subject');
      return;
    }

    setIsSending(true);

    try {
      await createBulkSending({
        subject,
        content,
        sender: from,
        contactGroupId: toGroupId,
        variables: variables.map((v) => ({
          key: v.key,
          from: v.from,
          fromKey: v.fromKey,
          customValue: v.customValue,
        })),
      });

      toast.success('Bulk sending started');
      router.push(`/bulk-sending`);
    } finally {
      setIsSending(false);
    }
  }, [
    from,
    subject,
    toGroupId,
    content,
    router,
    contactGroupsPagination,
    variables,
  ]);

  useEffect(() => {
    setSelectedVariable((prev) => {
      const variable = variables.find((v) => prev?.key === v.key);

      if (variable) return variable;

      return prev;
    });
  }, [variables]);

  useEffect(() => {
    setVariables((prev) => {
      return prev.map((v) => ({
        ...v,
        placements: [
          subject.includes(`{{${v.key}}}`) ? 'subject' : null,
          content.includes(`{{${v.key}}}`) ? 'content' : null,
        ].filter(Boolean) as ('subject' | 'content')[],
      }));
    });
  }, [content, subject]);

  return (
    <Container header>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">New Bulk Email</h1>
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 flex flex-col divide-y divide-zinc-800">
          <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 items-start sm:items-center pb-4">
            <div className="text-sm text-zinc-400 sm:w-20">From</div>
            <div className="w-full overflow-hidden">
              <SenderSelector
                from={from}
                setFrom={setFrom}
                fromSearchOpen={fromSearchOpen}
                setFromSearchOpen={setFromSearchOpen}
                fromSearchQuery={fromSearchQuery}
                setFromSearchQuery={setFromSearchQuery}
                setCreateSenderOpen={setCreateSenderOpen}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 items-start sm:items-center py-4">
            <div className="text-sm text-zinc-400 sm:w-20">To</div>
            <div className="w-full overflow-hidden">
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
          </div>

          <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 items-start sm:items-center py-4">
            <div className="text-sm text-zinc-400 sm:w-20">Subject</div>
            <div className="w-full overflow-hidden">
              <Input
                placeholder="Enter email subject. You can use {{name}}... check the variables below."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-transparent border-0 h-10 px-0 text-sm placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:bg-transparent overflow-ellipsis"
              />
            </div>
          </div>

          <div className="pt-4">
            <ContentEditor
              content={content}
              setContent={setContent}
              setIsHtml={setIsHtml}
              variables={variables}
            />
          </div>

          <div className="py-2 flex flex-col gap-2">
            {variables.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-zinc-400">Using variables:</span>
                {variables.map((v) => (
                  <Badge
                    key={v.key}
                    className="!text-xs text-white cursor-pointer"
                    variant="outline"
                    onClick={() => {
                      setSelectedVariable(v);
                      setIsVariableModalOpen(true);
                    }}
                  >
                    {v.isMapped ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-red-500" />
                    )}
                    {v.key}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="text-xs text-zinc-400">
                Available default variables:{' '}
                {defaultVariables.map((v) => v.key).join(', ')}
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              disabled={isSending}
              onClick={() => setIsOpenSendModal(true)}
              size="sm"
            >
              Send bulk email
              <ArrowRight size={16} />
            </Button>
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
        isHtml={isHtml}
        contactGroup={
          contactGroupsPagination?.contactGroups.find(
            (g) => g.id === toGroupId,
          ) || null
        }
        variables={variables}
      />

      <VariableModal
        isOpen={isVariableModalOpen}
        onClose={() => setIsVariableModalOpen(false)}
        variable={selectedVariable}
        setVariables={setVariables}
      />
    </Container>
  );
}

function VariableModal({
  isOpen,
  onClose,
  variable,
  setVariables,
}: {
  isOpen: boolean;
  onClose: () => void;
  variable: BulkSendingVariable | null;
  setVariables: React.Dispatch<React.SetStateAction<BulkSendingVariable[]>>;
}) {
  const updateVariable = useCallback(
    (key: string, valueKey: string, value: string) => {
      setVariables((prev) => {
        const newVariables = [...prev];
        const index = newVariables.findIndex((v) => v.key === key);

        if (index === -1) return prev;

        newVariables[index] = {
          ...newVariables[index],
          [valueKey]: value,
        };

        const isCustom = newVariables[index].from === 'custom';
        const isAValidCustom =
          isCustom && (newVariables[index].customValue || '').length > 0;

        if (
          !isCustom
            ? newVariables[index].from.length > 0 &&
              newVariables[index].fromKey.length > 0 &&
              AVAILABLE_KEYS[
                newVariables[index].from as keyof typeof AVAILABLE_KEYS
              ]?.includes(newVariables[index].fromKey)
            : isAValidCustom
        ) {
          newVariables[index].isMapped = true;
        } else {
          newVariables[index].isMapped = false;
        }

        return newVariables;
      });
    },
    [setVariables],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Variable</DialogTitle>
          <DialogDescription>
            Select the variable mapping for variable:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <pre className="bg-zinc-900 rounded-md h-12 w-full flex items-center justify-center">
            {`{{${variable?.key}}}`}
          </pre>
          {variable?.isDefault ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-zinc-400">
                This variable a default variable, which means it is
                automatically mapped to the contact or bulk sending. So you
                can't change.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <Label>From</Label>
                <Select
                  defaultValue={variable?.from}
                  onValueChange={(value) => {
                    const newFromKey =
                      value === 'custom'
                        ? Date.now().toString()
                        : variable?.fromKey || value;

                    updateVariable(variable?.key || '', 'from', value);
                    updateVariable(variable?.key || '', 'fromKey', newFromKey);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="bulk_sending">Bulk sending</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {variable?.from === 'custom' ? (
                <div className="flex flex-col gap-2">
                  <Label>Custom value</Label>
                  <Input
                    value={variable?.customValue || ''}
                    onChange={(e) =>
                      updateVariable(
                        variable?.key || '',
                        'customValue',
                        e.target.value,
                      )
                    }
                    placeholder="Enter a custom value"
                  />
                </div>
              ) : (
                (variable?.from || '').length > 0 && (
                  <div className="flex flex-col gap-2">
                    <Label>From key</Label>
                    <Select
                      defaultValue={variable?.fromKey}
                      onValueChange={(value) => {
                        updateVariable(variable?.key || '', 'fromKey', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select the item witch represent your variable" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_KEYS[
                          variable?.from as keyof typeof AVAILABLE_KEYS
                        ]?.map((key) => (
                          <SelectItem key={key} value={key}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ContentEditor({
  content,
  setContent,
  setIsHtml,
  variables,
}: {
  content: string;
  setContent: (content: string) => void;
  setIsHtml: (isHtml: boolean) => void;
  variables: BulkSendingVariable[];
}) {
  const processedContent = useMemo(() => {
    let processedContent = content;

    variables.forEach((variable) => {
      if (variable.from === 'custom') {
        processedContent = processedContent.replaceAll(
          `{{${variable.key}}}`,
          variable.customValue || '',
        );
      }

      processedContent = processedContent.replaceAll(
        `{{unsubscribeUrl}}`,
        '/unsubscribe?key=sample-key',
      );
    });

    return processedContent;
  }, [content, variables]);

  return (
    <div className="w-full relative">
      <Tabs
        defaultValue="editor"
        onValueChange={(value) => setIsHtml(value === 'html')}
      >
        <TabsList className="w-fit ml-auto">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <RichTextEditor setContent={setContent} />
        </TabsContent>
        <TabsContent value="html">
          <div className="w-full h-[200vh] md:h-[500px] flex flex-col md:flex-row gap-4">
            <EditorCode
              language="html"
              theme="vs-dark"
              value={content}
              onChange={(value) => setContent(value || '')}
              className="w-full h-full"
              options={{
                minimap: {
                  enabled: false,
                },
              }}
            />

            <div className="w-full h-full bg-zinc-900 rounded-xl">
              <iframe srcDoc={processedContent} className="w-full h-full" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
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
  isHtml,
  variables,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSend: () => Promise<void>;
  contactGroup: ContactGroup | null;
  from: string;
  to: string;
  subject: string;
  content: string;
  isHtml: boolean;
  variables: BulkSendingVariable[];
}) {
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const messages = [];

    if (!from) {
      messages.push('No from (sender) selected');
    }

    if (!subject) {
      messages.push('No subject selected');
    }

    if (!content) {
      messages.push('No content selected');
    }

    if (!to) {
      messages.push('No to (contact group) selected');
    } else if (!contactGroup) {
      messages.push('No contact group selected');
    } else if (contactGroup.contactsCount === 0) {
      messages.push(`No contacts in contact group ${contactGroup?.name}`);
    }

    const hasUnsubscribeLink = variables?.some(
      (v) => v.placements.includes('content') && v.key === 'unsubscribeUrl',
    );

    if (isHtml && !hasUnsubscribeLink) {
      messages.push(
        'Please add some <a> tag when the href is {{unsubscribeUrl}}',
      );
    }

    if (!isHtml && !hasUnsubscribeLink) {
      messages.push(
        'Please add in the content a link to unsubscribe or add a text with the link to {{unsubscribeUrl}}',
      );
    }

    const notMappedVariables = variables.filter(
      (v) => !v.isMapped,
    ) as BulkSendingVariable[];

    if (notMappedVariables.length > 0) {
      messages.push(
        `Please map the following variables: ${notMappedVariables.map((v) => v.key).join(', ')}`,
      );
    }

    setValidationMessages(messages);
  }, [from, to, subject, content, contactGroup, isHtml, variables]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateDragPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateDragPosition(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      updateDragPosition(e.touches[0].clientX);
    },
    [isDragging],
  );

  const handleTouchEnd = useCallback(async () => {
    if (isDragging) {
      if (dragProgress > 0.9) {
        setIsSending(true);
        try {
          await onSend();
          onClose();
        } finally {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setIsSending(false);
        }
      }
      setIsDragging(false);
      setDragProgress(0);
    }
  }, [isDragging, dragProgress, onSend, onClose]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateDragPosition(e.clientX);
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(async () => {
    if (isDragging) {
      if (dragProgress > 0.9) {
        setIsSending(true);
        try {
          await onSend();
          onClose();
        } finally {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setIsSending(false);
        }
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
    const progress = Math.min(dragX / maxDrag, 1);
    setDragProgress(progress);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ready to send?</DialogTitle>
          {contactGroup && (
            <DialogDescription>
              Are you sure you want to send this email to{' '}
              <b>{contactGroup?.contactsCount}</b> contacts from{' '}
              <b>{contactGroup?.name}</b>?
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

          {isSending && (
            <div className="flex items-center justify-center gap-2 text-amber-500 text-sm animate-pulse">
              <Loader2 className="size-5 animate-spin" />
              <span>Creating sending queue...</span>
            </div>
          )}

          {validationMessages.length === 0 && !isSending && (
            <div
              ref={sliderRef}
              className="relative h-12 bg-zinc-800 rounded-full overflow-hidden"
            >
              <div
                className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400 pointer-events-none"
                style={{
                  opacity: 1 - dragProgress * 2,
                }}
              >
                Slide to send
              </div>

              <button
                ref={buttonRef}
                className={cn(
                  'absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-700 h-8 w-16 rounded-full cursor-grab active:cursor-grabbing transition-colors duration-150 flex items-center justify-center',
                  isDragging && 'bg-zinc-600',
                  dragProgress === 1 && 'h-7 w-14',
                )}
                style={{
                  transform: `translateX(${dragProgress * ((sliderRef.current?.offsetWidth || 0) - (buttonRef.current?.offsetWidth || 0)) * 0.96}px)`,
                  maxWidth: 'calc(100% - 8px)',
                  backgroundColor:
                    dragProgress > 0.1
                      ? `rgba(0, 111, 238, ${dragProgress})`
                      : undefined,
                  touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <ArrowRight
                  className={cn('size-5', dragProgress === 1 && 'size-4')}
                />
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
    <Popover open={fromSearchOpen} onOpenChange={setFromSearchOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={fromSearchOpen}
          className="justify-between h-auto w-full px-0 font-normal hover:bg-transparent active:scale-100 text-sm !pl-0 truncate"
        >
          {from ? from : 'Select a sender'}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
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
    <Popover open={toSearchOpen} onOpenChange={setToSearchOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={toSearchOpen}
          className="justify-between h-auto w-full px-0 font-normal hover:bg-transparent active:scale-100 text-sm !pl-0 truncate"
        >
          {toGroupId
            ? contactGroupsPagination?.contactGroups.find(
                (g) => g.id === toGroupId,
              )?.name || 'Loading...'
            : 'Select a contact group'}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
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
                      <span className="font-medium ml-1">{toSearchQuery}</span>
                    </div>
                  </button>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
