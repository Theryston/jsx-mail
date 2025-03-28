'use client';

import { Container } from '@/components/container';
import { useMe, useUpdateOnboarding } from '@/hooks/user';
import { useCreateDomain, useDomains, useVerifyDomain } from '@/hooks/domain';
import {
  useCreateSender,
  useSenders,
  useVerifiedDomains,
  useSendEmail,
} from '@/hooks/sender';
import { Button } from '@jsx-mail/ui/button';
import { Input } from '@jsx-mail/ui/input';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@jsx-mail/ui/sonner';
import { Loader2, ArrowRight, Copy, Check, CheckCircle2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@jsx-mail/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jsx-mail/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Domain } from '@/types/domain';
import { DomainStatus } from '@/components/domain-status';
import { cn } from '@jsx-mail/ui/lib/utils';
import { Sender } from '@/types/sender';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@jsx-mail/ui/table';
import Link from 'next/link';

// Define onboarding steps with titles and descriptions
const ONBOARDING_STEPS = [
  {
    id: 'create_domain',
    title: 'Create a Domain',
    description: 'Add a domain that you own to send emails from.',
  },
  {
    id: 'verify_domain',
    title: 'Verify Domain',
    description: 'Verify ownership of your domain by adding DNS records.',
  },
  {
    id: 'create_sender',
    title: 'Create a Sender',
    description: 'Create a sender to send emails from.',
  },
  {
    id: 'send_test_email',
    title: 'Send a Test Email',
    description: 'Send a test email to verify everything is set up correctly.',
  },
];

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Invalid domain format',
    ),
});

const senderSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' }),
  domainName: z.string().min(3, { message: 'Please select a domain' }),
});

export default function OnboardingPage() {
  const { data: user, isLoading: isLoadingUser } = useMe();
  const { mutateAsync: updateOnboarding } = useUpdateOnboarding();
  const router = useRouter();

  if (isLoadingUser) {
    return (
      <Container loggedHeaderNoActions>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  if (user.onboardingStep === 'completed') {
    router.push('/');
    return null;
  }

  // Helper function to determine if a step is completed
  const isStepCompleted = (stepId: string) => {
    const stepOrder = ONBOARDING_STEPS.map((s) => s.id);
    const currentStepIndex = stepOrder.indexOf(user.onboardingStep);
    const stepIndex = stepOrder.indexOf(stepId);
    return stepIndex < currentStepIndex;
  };

  return (
    <Container loggedHeaderNoActions>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Welcome to JSX Mail</h1>
          <p className="text-muted-foreground">
            Let&apos;s set up your account to start sending emails. Follow these
            steps to get started.
          </p>
        </div>

        <div className="relative flex flex-col">
          {ONBOARDING_STEPS.map((step, index) => {
            const isActive = user.onboardingStep === step.id;
            const isCompleted = isStepCompleted(step.id);
            const isLast = index === ONBOARDING_STEPS.length - 1;

            return (
              <div key={step.id} className="relative z-10 flex flex-col mb-5">
                {/* Vertical connection line (only for non-last items) */}
                {!isLast && (
                  <div
                    className="absolute left-4 top-10 w-[1px] bg-border"
                    style={{ height: 'calc(100% - 1rem)' }}
                  />
                )}

                {/* Step indicator and title row */}
                <div className="flex items-start gap-4 mb-2">
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full w-8 h-8 mt-1 z-10 bg-background',
                      isActive
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={cn(
                          'font-medium text-lg',
                          isActive
                            ? 'text-foreground'
                            : isCompleted
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                        )}
                      >
                        {step.title}
                      </h3>
                      {isCompleted && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    {!isActive && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content area (only for active step) */}
                {isActive && (
                  <div className="ml-[3rem] bg-card border rounded-lg p-5 mb-5">
                    {step.id === 'create_domain' && (
                      <CreateDomainStep
                        onSkip={() => updateOnboarding('create_sender')}
                      />
                    )}
                    {step.id === 'verify_domain' && <VerifyDomainStep />}
                    {step.id === 'create_sender' && <CreateSenderStep />}
                    {step.id === 'send_test_email' && <SendTestEmailStep />}
                  </div>
                )}
              </div>
            );
          })}

          <Button
            variant="ghost"
            onClick={() => updateOnboarding('completed')}
            className="w-fit"
          >
            Skip onboarding
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Container>
  );
}

function CreateDomainStep({ onSkip }: { onSkip: () => void }) {
  const { mutateAsync: createDomain, isPending } = useCreateDomain();
  const { mutateAsync: updateOnboarding } = useUpdateOnboarding();
  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof domainSchema>) => {
    try {
      await createDomain(values.domain);
      await updateOnboarding('verify_domain');
      toast.success('Domain created successfully');
    } catch (error) {
      toast.error('Failed to create domain');
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain Name</FormLabel>
                <FormControl>
                  <Input placeholder="example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a domain that you own. You&apos;ll need to verify
                  ownership in the next step.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-2">
            <Button variant="outline" type="button" onClick={onSkip}>
              Skip domain creation
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function VerifyDomainStep() {
  const { data: domains, isLoading } = useDomains();
  const { mutateAsync: updateOnboarding } = useUpdateOnboarding();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const { data: verificationData } = useVerifyDomain({
    id: selectedDomain || '',
    enabled: !!selectedDomain,
  });
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (domains && domains.length > 0) {
      setSelectedDomain(domains[0].id);
    }
  }, [domains]);

  useEffect(() => {
    if (verificationData && verificationData.status === 'verified') {
      updateOnboarding('create_sender');
      toast.success('Domain verified successfully');
    }
  }, [verificationData, updateOnboarding]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!domains || domains.length === 0) {
    return (
      <div className="space-y-4">
        <p>No domains found. Please create a domain first.</p>
        <Button onClick={() => updateOnboarding('create_domain')}>
          Go Back
        </Button>
      </div>
    );
  }

  const domain = domains.find((d) => d.id === selectedDomain);

  return (
    <div className="space-y-4">
      {domain && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Records for {domain.name}</p>
            <div
              className={cn(
                'text-xs flex items-center gap-2',
                verificationData?.status === 'pending' && 'animate-pulse',
              )}
            >
              <Loader2 className="size-4 animate-spin" />
              <DomainStatus domain={domain} />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Copy</TableHead>
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(record.value)}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => updateOnboarding('create_sender')}
            >
              Skip Verification
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateSenderStep() {
  const { data: verifiedDomains, isLoading: isLoadingDomains } =
    useVerifiedDomains();
  const { mutateAsync: createSender, isPending } = useCreateSender();
  const { mutateAsync: updateOnboarding } = useUpdateOnboarding();
  const [domains, setDomains] = useState<Domain[]>([]);

  const form = useForm<z.infer<typeof senderSchema>>({
    resolver: zodResolver(senderSchema),
    defaultValues: {
      name: '',
      username: '',
      domainName: '',
    },
  });

  const realtimeName = form.watch('name');

  useEffect(() => {
    if (verifiedDomains) {
      const hasJsxMailOrg = verifiedDomains.some(
        (domain: Domain) => domain.name === 'jsxmail.org',
      );

      if (!hasJsxMailOrg) {
        setDomains([
          ...verifiedDomains,
          {
            id: 'jsxmail-org',
            name: 'jsxmail.org',
            userId: '',
            status: 'verified',
            dnsRecords: [],
            createdAt: new Date(),
          },
        ]);
      } else {
        setDomains(verifiedDomains);
      }
    }
  }, [verifiedDomains]);

  useEffect(() => {
    if (realtimeName) {
      const slugifiedName = realtimeName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      form.setValue('username', slugifiedName);
    }
  }, [realtimeName, form]);

  useEffect(() => {
    if (domains && domains.length > 0) {
      form.setValue('domainName', domains[0].name);
    }
  }, [domains, form]);

  const onSubmit = async (values: z.infer<typeof senderSchema>) => {
    try {
      await createSender({
        name: values.name,
        username: values.username,
        domainName: values.domainName,
      });
      await updateOnboarding('send_test_email');
      toast.success('Sender created successfully');
    } catch (error) {
      toast.error('Failed to create sender');
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="domainName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <Select
                  disabled={
                    isLoadingDomains || !domains || domains.length === 0
                  }
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {domains?.map((domain) => (
                      <SelectItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a verified domain for your sender.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This name will appear as the sender name in emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="flex items-center w-full">
                    <Input
                      {...field}
                      placeholder="username"
                      className={cn(
                        'w-full',
                        form.watch('domainName') && 'rounded-r-none',
                      )}
                    />
                    {form.watch('domainName') && (
                      <div className="bg-zinc-900 h-12 px-3 py-2 rounded-r-md flex items-center text-sm max-w-[120px] md:max-w-[200px]">
                        <span className="text-xs overflow-hidden truncate">
                          @{form.watch('domainName')}
                        </span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  This will be the username part of your email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-4">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Sender
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function SendTestEmailStep() {
  const { data: senders, isLoading } = useSenders();
  const { mutateAsync: updateOnboarding } = useUpdateOnboarding();
  const { mutateAsync: sendEmail, isPending: isSending } = useSendEmail();
  const router = useRouter();
  const { data: user } = useMe();
  const [isCopied, setIsCopied] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [hasSentTestEmail, setHasSentTestEmail] = useState(false);
  const { data: me } = useMe();

  const emailForm = useForm({
    defaultValues: {
      recipientEmail: '',
    },
    resolver: zodResolver(
      z.object({
        recipientEmail: z.string().email('Please enter a valid email address'),
      }),
    ),
  });

  useEffect(() => {
    const cookies = document.cookie;
    const token = cookies.split('; ').find((row) => row.startsWith('token='));

    if (token) {
      setCurrentToken(token.split('=')[1]);
    }
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getEmailHtml = (sender: Sender) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h1 style="color: #0070f3; margin-bottom: 20px;">Welcome to JSX Mail!</h1>
        <p>Hello${user ? ` ${user.name}` : ''},</p>
        <p>This is a test email sent from your new JSX Mail account. If you're receiving this, your email setup is working correctly!</p>
        <p>You can now start sending emails programmatically through our API (<a href="https://docs.jsxmail.org/api-reference/endpoint/sender/send" style="color: #0070f3; text-decoration: none;">docs</a>) or using the JSX Mail framework (<a href="https://docs.jsxmail.org/framework/learning/getting-started" style="color: #0070f3; text-decoration: none;">docs</a>)</p>
        <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold;">Your sender address:</p>
          <p style="margin: 5px 0 0; color: #0070f3;">${sender.email}</p>
        </div>
        <p>Thank you for choosing JSX Mail for your email needs!</p>
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          The JSX Mail Team<br>
          <a href="https://jsxmail.org" style="color: #0070f3; text-decoration: none;">jsxmail.org</a>
        </p>
      </div>
    `;
  };

  const getApiExample = (sender: Sender, recipientEmail: string) => {
    const emailHtml = getEmailHtml(sender).trim().replace(/\n\s*/g, ' ');

    const jsonData = {
      subject: 'Test Email from JSX Mail',
      html: emailHtml,
      to: [recipientEmail || 'recipient@example.com'],
      sender: sender.email,
    };

    const jsonString = JSON.stringify(jsonData);

    const shellSafeJson = jsonString.replace(/'/g, "'\\''");

    return `curl --request POST \\
    --url https://api.jsxmail.org/sender/send \\
    --header 'Authorization: Bearer ${currentToken}' \\
    --header 'Content-Type: application/json' \\
    --data '${shellSafeJson}'`;
  };

  const handleSendTestEmail = async () => {
    if (
      !emailForm.getValues().recipientEmail ||
      !senders ||
      senders.length === 0
    )
      return;

    try {
      const sender = senders[0];
      await sendEmail({
        subject: 'Test Email from JSX Mail',
        html: getEmailHtml(sender),
        to: [emailForm.getValues().recipientEmail],
        sender: sender.email,
      });

      toast.success(
        `Test email sent successfully! Check your inbox at ${emailForm.getValues().recipientEmail}`,
      );
      setHasSentTestEmail(true);
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  const handleSkip = async () => {
    try {
      await updateOnboarding('completed');
      toast.success('Onboarding completed');
      router.push('/');
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  useEffect(() => {
    if (me?.email) {
      emailForm.setValue('recipientEmail', me.email);
    }
  }, [me, emailForm]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!senders || senders.length === 0) {
    return (
      <div className="space-y-4">
        <p>No senders found. Please create a sender first.</p>
        <Button onClick={() => updateOnboarding('create_sender')}>
          Go Back
        </Button>
      </div>
    );
  }

  const recipientEmail = emailForm.getValues().recipientEmail;

  return (
    <div className="space-y-6">
      <form
        onSubmit={emailForm.handleSubmit(handleSendTestEmail)}
        className="space-y-2"
      >
        <label htmlFor="recipientEmail" className="text-sm font-medium">
          Send a test email to
        </label>

        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            {...emailForm.register('recipientEmail')}
            id="recipientEmail"
          />
          {hasSentTestEmail ? (
            <div className="h-9 w-9 bg-green-500 rounded-full flex shrink-0 items-center justify-center">
              <Check className="size-4 text-white" />
            </div>
          ) : (
            <Button
              size="icon"
              className="h-9 w-9"
              type="submit"
              disabled={isSending}
            >
              {isSending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {emailForm.formState.errors.recipientEmail?.message ? (
            <span className="text-red-500">
              {emailForm.formState.errors.recipientEmail?.message}
            </span>
          ) : (
            "We'll send a test email to this address."
          )}
        </p>
      </form>

      <div className="space-y-4">
        <p className="text-sm font-medium">Send using API</p>

        <p className="text-sm text-muted-foreground">
          Here&apos;s how to send emails using our API. You can use this example
          to integrate email sending into your applications.{' '}
          <Link
            href="https://docs.jsxmail.org/api-reference/endpoint/sender/send"
            className="text-primary"
            target="_blank"
          >
            Learn more
          </Link>
        </p>

        <div className="relative">
          <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-xl overflow-x-auto text-xs">
            <code>{getApiExample(senders[0], recipientEmail)}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() =>
              handleCopy(getApiExample(senders[0], recipientEmail))
            }
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          To use in production, replace the Authorization header with your
          actual API key from the Account settings. The value{' '}
          <code>{currentToken?.slice(0, 10)}...</code> is a temporary token for
          the onboarding process.
        </p>
      </div>

      <Button onClick={handleSkip} className="w-full">
        Complete Onboarding
      </Button>
    </div>
  );
}
