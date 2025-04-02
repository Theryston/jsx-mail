'use client';

import { Container } from '@/components/container';
import { useMessage, useMessageStatuses } from '@/hooks/message';
import { FullMessage } from '@/types/message';
import { Button } from '@jsx-mail/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@jsx-mail/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { use } from 'react';

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
  const { data: statuses } = useMessageStatuses();

  const getStatusColor = (statusValue: string) => {
    const status = statuses?.find((s) => s.value === statusValue);
    return status?.color || 'rgb(161 161 170)';
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
      </div>
    </div>
  );
}
