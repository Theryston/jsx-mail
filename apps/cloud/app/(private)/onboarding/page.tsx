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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@jsx-mail/ui/card';
import { Loader2, ArrowRight, Copy, Check } from 'lucide-react';
import { Separator } from '@jsx-mail/ui/separator';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@jsx-mail/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Domain } from '@/types/domain';
import { ControllerRenderProps } from 'react-hook-form';
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

        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${user.onboardingStep === 'create_domain' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            1
          </div>
          <Separator className="flex-1" />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${user.onboardingStep === 'verify_domain' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            2
          </div>
          <Separator className="flex-1" />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${user.onboardingStep === 'create_sender' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            3
          </div>
          <Separator className="flex-1" />
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${user.onboardingStep === 'send_test_email' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            4
          </div>
        </div>

        {user.onboardingStep === 'create_domain' && (
          <CreateDomainStep onSkip={() => updateOnboarding('create_sender')} />
        )}
        {user.onboardingStep === 'verify_domain' && <VerifyDomainStep />}
        {user.onboardingStep === 'create_sender' && <CreateSenderStep />}
        {user.onboardingStep === 'send_test_email' && <SendTestEmailStep />}
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
    <Card>
      <CardHeader>
        <CardTitle>Create a Domain</CardTitle>
        <CardDescription>
          Add a domain that you own to send emails from. This domain will be
          used to verify your identity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="domain"
              render={({
                field,
              }: {
                field: ControllerRenderProps<{ domain: string }, 'domain'>;
              }) => (
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
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
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
      <Card>
        <CardHeader>
          <CardTitle>Verify Domain</CardTitle>
          <CardDescription>Loading your domains...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!domains || domains.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verify Domain</CardTitle>
          <CardDescription>
            No domains found. Please create a domain first.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => updateOnboarding('create_domain')}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const domain = domains.find((d) => d.id === selectedDomain);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Domain</CardTitle>
        <CardDescription>
          Verify ownership of your domain by adding DNS records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>Create a Sender</CardTitle>
        <CardDescription>
          Create a sender to send emails from. This will be the &quot;From&quot;
          address in your emails.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="domainName"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  { name: string; username: string; domainName: string },
                  'domainName'
                >;
              }) => (
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
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  { name: string; username: string; domainName: string },
                  'name'
                >;
              }) => (
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
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  { name: string; username: string; domainName: string },
                  'username'
                >;
              }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="flex items-center w-full">
                      <Input
                        {...field}
                        placeholder="username"
                        className="rounded-r-none w-full"
                      />
                      <div className="bg-zinc-900 h-12 px-3 py-2 rounded-r-md flex items-center text-sm">
                        @{form.watch('domainName')}
                      </div>
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
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SendTestEmailStep() {
  const { data: senders, isLoading } = useSenders();
  const { mutateAsync: updateOnboarding } = useUpdateOnboarding();
  const { mutateAsync: sendEmail, isPending: isSending } = useSendEmail();
  const router = useRouter();
  const { data: user } = useMe();
  const [activeTab, setActiveTab] = useState('send');
  const [isCopied, setIsCopied] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

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
        <p>You can now start sending emails programmatically through our API or using the JSX Mail framework.</p>
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

      await updateOnboarding('completed');
      toast.success('Test email sent successfully');
      router.push('/');
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send a Test Email</CardTitle>
          <CardDescription>Loading your senders...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!senders || senders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send a Test Email</CardTitle>
          <CardDescription>
            No senders found. Please create a sender first.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => updateOnboarding('create_sender')}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a Test Email</CardTitle>
        <CardDescription>
          Send a test email to verify that everything is set up correctly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          defaultValue="send"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="send">Send Email</TabsTrigger>
            <TabsTrigger value="api">API Example</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <Form {...emailForm}>
              <form className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="recipientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We&apos;ll send a test email to this address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={isSending || !emailForm.formState.isValid}
                    className="w-full"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Test Email
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="preview">
            <div className="border bg-white rounded-md p-4 overflow-auto max-h-[400px]">
              <div
                dangerouslySetInnerHTML={{ __html: getEmailHtml(senders[0]) }}
              />
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Here&apos;s how to send emails using our API. You can use this
                example to integrate email sending into your applications.
              </p>

              <div className="relative">
                <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-xl overflow-x-auto text-xs">
                  <code>
                    {getApiExample(
                      senders[0],
                      emailForm.getValues().recipientEmail,
                    )}
                  </code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    handleCopy(
                      getApiExample(
                        senders[0],
                        emailForm.getValues().recipientEmail,
                      ),
                    )
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
                <code>{currentToken?.slice(0, 10)}...</code> is a temporary
                token for the onboarding process.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button variant="outline" onClick={handleSkip} className="w-full">
          Skip & Complete Onboarding
        </Button>
      </CardContent>
    </Card>
  );
}
