'use client';

import { Container } from '@/components/container';
import { useMessage, useMessageStatuses } from '@/hooks/message';
import { useForceSendMessageWebhook } from '@/hooks/user';
import { FullMessage } from '@/types/message';
import { Button } from '@jsx-mail/ui/button';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@jsx-mail/ui/dialog';
import { Dialog } from '@jsx-mail/ui/dialog';
import { Input } from '@jsx-mail/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jsx-mail/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@jsx-mail/ui/tabs';
import { ArrowLeft, File, Download, Bell } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SendingHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: message, isPending } = useMessage(id);

  if (isPending) {
    return (
      <Container header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Container>
    );
  }

  if (!message) {
    return (
      <Container header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-zinc-400">Message not found</div>
        </div>
      </Container>
    );
  }

  return (
    <Container header>
      <div className="w-full space-y-4 md:max-w-4xl md:mx-auto md:space-y-6 md:px-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back to previous page
        </Button>

        <EmailHeader message={message} />

        {message.statusHistory.length > 0 && (
          <EmailEventsTimeline message={message} />
        )}

        <EmailAttachments message={message} />

        <EmailContent message={message} />
      </div>
    </Container>
  );
}

function EmailContent({ message }: { message: FullMessage }) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <iframe
            src={`data:text/html;charset=utf-8,${encodeURIComponent(
              message.body,
            )}`}
            className="w-full h-[500px] rounded-lg"
          />
        </TabsContent>
        <TabsContent value="code">
          <pre className="text-sm text-zinc-400 bg-zinc-950 rounded-lg p-4 overflow-auto">
            {message.body}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmailEventsTimeline({ message }: { message: FullMessage }) {
  const getStatusColor = (statusValue: string) => {
    let color = 'rgb(34, 197, 94)';

    if (['queued', 'processing'].includes(statusValue)) {
      color = 'rgb(161, 161, 170)';
    }

    if (['bounce', 'failed', 'complaint'].includes(statusValue)) {
      color = 'rgb(239, 68, 68)';
    }

    return color;
  };

  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6">
      <h2 className="text-sm font-medium text-zinc-400 uppercase mb-4">
        EMAIL EVENTS
      </h2>
      <div className="space-y-4">
        {message.statusHistory.map((event, index) => (
          <div key={event.id} className="grid grid-cols-[20px_1fr] gap-3">
            <div className="relative flex-shrink-0 h-full">
              <div
                className={`w-3 h-3 rounded-full ring-3 ring-zinc-800`}
                style={{
                  marginTop: '0.4rem',
                  backgroundColor: getStatusColor(event.status),
                }}
              />
              {index !== message.statusHistory.length - 1 && (
                <div
                  className="absolute w-[2px] bg-zinc-800"
                  style={{
                    top: 'calc(0.4rem + 0.75rem)',
                    bottom: '-20px',
                    left: '0.375rem',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{event.status}</p>
              <p className="text-xs sm:text-sm text-zinc-400">
                {moment(event.createdAt).format('DD/MM/YYYY HH:mm')}
              </p>
              {event.description && (
                <p className="text-xs sm:text-sm text-zinc-400">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailHeader({ message }: { message: FullMessage }) {
  const [isOpenWebhookModal, setIsOpenWebhookModal] = useState(false);

  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <div className="bg-emerald-600 rounded-lg p-2 sm:p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div className="w-full overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Message
          </h1>
          <p className="text-sm text-zinc-400 overflow-hidden text-ellipsis">
            {message.to.join(', ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="w-full flex flex-col gap-1">
          <h2 className="text-sm font-medium text-zinc-400 uppercase">FROM</h2>
          <p className="text-sm text-white break-all">{message.sender.email}</p>
        </div>
        <div className="w-full flex flex-col gap-1">
          <h2 className="text-sm font-medium text-zinc-400 uppercase">
            SUBJECT
          </h2>
          <p className="text-sm text-white break-words">{message.subject}</p>
        </div>
        <div className="w-full flex flex-col gap-1">
          <h2 className="text-sm font-medium text-zinc-400 uppercase">TO</h2>
          <p className="text-sm text-white break-all">
            {message.to.join(', ')}
          </p>
        </div>
        {message.webhookUrl && (
          <div className="w-full flex flex-col gap-1">
            <h2 className="text-sm font-medium text-zinc-400 uppercase">
              WEBHOOK
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-white truncate overflow-hidden text-ellipsis">
                {message.webhookUrl}
              </p>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpenWebhookModal(true)}
              >
                <Bell />
              </Button>
            </div>
          </div>
        )}
      </div>

      <WebhookModal
        isOpen={isOpenWebhookModal}
        onClose={() => setIsOpenWebhookModal(false)}
        message={message}
      />
    </div>
  );
}

function WebhookModal({
  isOpen,
  onClose,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: FullMessage;
}) {
  const [customStatus, setCustomStatus] = useState<string>(message.status);
  const [statuses, setStatuses] = useState<string[]>(message.webhookStatus);
  const { data: messageStatuses } = useMessageStatuses();
  const {
    mutateAsync: forceSendMessageWebhook,
    isPending: isForceSendMessageWebhookPending,
  } = useForceSendMessageWebhook();

  useEffect(() => {
    if (message.webhookStatus.length > 0) {
      setStatuses(message.webhookStatus);
    } else {
      setStatuses(messageStatuses?.map((status) => status.value) || []);
    }
  }, [message.webhookStatus, messageStatuses]);

  const handleCallWebhook = useCallback(async () => {
    await forceSendMessageWebhook({
      id: message.id,
      status: customStatus,
    });
    toast.success('Webhook called successfully');
    onClose();
  }, [forceSendMessageWebhook, message.id, customStatus, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Webhook</DialogTitle>
          <DialogDescription>
            Manual webhook call for message {message.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white">Webhook URL</p>
            <Input value={message.webhookUrl} disabled className="w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white">Status to webhook</p>
            <Select value={customStatus} onValueChange={setCustomStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleCallWebhook}
            disabled={isForceSendMessageWebhookPending}
          >
            {isForceSendMessageWebhookPending
              ? 'Calling webhook...'
              : 'Call webhook'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmailAttachments({ message }: { message: FullMessage }) {
  if (!message.messageFiles.length && !message.attachments.length) {
    return null;
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6">
      <h2 className="text-sm font-medium text-zinc-400 uppercase mb-4">
        ATTACHMENTS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {message.messageFiles.map(({ file }) => (
          <a
            key={file.id}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <File className="w-5 h-5 text-zinc-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{file.originalName}</p>
              <p className="text-xs text-zinc-400">{file.mimeType}</p>
            </div>
            <Download className="w-4 h-4 text-zinc-400" />
          </a>
        ))}
        {message.attachments.map((attachment) => (
          <button
            key={attachment.id}
            onClick={() => {
              toast.info(
                'This is a temporary attachment, so the file is not saved',
              );
            }}
            className="w-full flex items-center gap-3 p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <File className="w-5 h-5 text-zinc-400" />
            <div className="w-fit">
              <p className="text-sm text-left text-white truncate">
                {attachment.fileName}
              </p>
              <p className="text-xs text-zinc-400">Temporary attachment</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
