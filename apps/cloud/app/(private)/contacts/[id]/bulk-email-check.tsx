import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@jsx-mail/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import { CheckCircle, Loader2, Check, Info } from 'lucide-react';
import {
  useCreateBulkEmailCheck,
  useEstimateBulkEmailCheck,
  useMarkBulkEmailCheckAsRead,
} from '@/hooks/bulk-sending';
import { BulkEmailCheck, EmailCheckLevel } from '@/types/bulk-sending';
import moment from 'moment';
import { friendlyTime } from '@/utils/format';
import { cn } from '@jsx-mail/ui/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@jsx-mail/ui/tooltip';

type BulkEmailCheckStep = 'info' | 'estimate';

export function BulkEmailCheckBanner({
  bulkEmailChecks,
}: {
  bulkEmailChecks: BulkEmailCheck[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {bulkEmailChecks.map((check) => (
        <>
          {check.status === 'pending' || check.status === 'processing' ? (
            <ProcessingBulkEmailCheck check={check} key={check.id} />
          ) : (
            <BulkEmailCheckResult check={check} key={check.id} />
          )}
        </>
      ))}
    </div>
  );
}

function BulkEmailCheckResult({ check }: { check: BulkEmailCheck }) {
  const { mutate: markBulkEmailCheckAsRead, isPending: isMarkingAsRead } =
    useMarkBulkEmailCheckAsRead(check.id, check.contactGroupId);

  return (
    <div className="rounded-md p-4 bg-green-500/10 border border-green-500/20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 text-green-500 max-w-[80%]">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4" />
            <p className="text-sm truncate overflow-hidden text-ellipsis">
              Bulk Email Check: {check.processedEmails} email
              {check.processedEmails === 1 ? '' : 's'} checked
            </p>
          </div>
          <div className="flex flex-col gap-0">
            <p className="text-xs">
              Bounced: {check.bouncedEmails} email
              {check.bouncedEmails === 1 ? '' : 's'}
            </p>
            <p className="text-xs">
              Valid: {check.validEmails} email
              {check.validEmails === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => markBulkEmailCheckAsRead()}
          disabled={isMarkingAsRead}
        >
          <Check className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ProcessingBulkEmailCheck({ check }: { check: BulkEmailCheck }) {
  const [estimatedEndAt, setEstimatedEndAt] = useState<moment.Moment | null>(
    moment(check.estimatedEndAt),
  );
  const [isInPast, setIsInPast] = useState(false);
  const interval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    if (check.status !== 'processing') return;

    interval.current = setInterval(() => {
      const checkEstimatedEndAt = moment(check.estimatedEndAt);

      const isEstimatedInPast = checkEstimatedEndAt.isBefore(moment());

      if (isEstimatedInPast) {
        setEstimatedEndAt(null);
        setIsInPast(true);
      } else {
        setEstimatedEndAt(checkEstimatedEndAt);
        setIsInPast(false);
      }
    }, 1000);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [check]);

  return (
    <div className="rounded-md p-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        <p className="text-sm">Processing Bulk Email Check</p>
      </div>
      <div className="flex flex-col gap-0">
        {isInPast ? (
          <p className="text-xs">
            The process is taking longer than expected. Please wait a few
            minutes or contact support.
          </p>
        ) : (
          <>
            <p className="text-xs">
              Estimated End:{' '}
              {estimatedEndAt?.format('DD/MM/YYYY HH:mm:ss') || 'N/A'}
            </p>
            <p className="text-xs">
              Remaining:{' '}
              {estimatedEndAt
                ? friendlyTime(estimatedEndAt.diff(moment(), 'seconds'))
                : 'N/A'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function BulkEmailCheckModal({
  isOpen,
  onOpenChange,
  contactGroupId,
  totalEmails,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contactGroupId: string;
  totalEmails: number;
}) {
  const [step, setStep] = useState<BulkEmailCheckStep>('info');
  const { data: estimate, isLoading: isEstimating } = useEstimateBulkEmailCheck(
    contactGroupId,
    totalEmails,
  );
  const [level, setLevel] = useState<EmailCheckLevel>('valid');
  const { mutate: createBulkEmailCheck, isPending: isCreating } =
    useCreateBulkEmailCheck();

  const handleConfirm = useCallback(() => {
    if (step === 'info') {
      setStep('estimate');
    } else {
      createBulkEmailCheck({ contactGroupId, level });
      onOpenChange(false);
    }
  }, [contactGroupId, createBulkEmailCheck, level, onOpenChange, step]);

  const onClose = () => {
    onOpenChange(false);
    setStep('info');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pre-detect bounced emails</DialogTitle>
          <DialogDescription>
            Reduce your bounce rate by up to 99% and ensure your emails reach
            real inboxes!
          </DialogDescription>
        </DialogHeader>

        {step === 'info' ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              A high bounce rate can seriously damage your sender reputation,
              causing your emails to land in spam folders—or worse, not be
              delivered at all. This advanced tool helps you{' '}
              <strong>reduce your bounce rate by up to 99%</strong> and ensures
              your emails reach real inboxes!
            </p>
            <p className="text-sm text-muted-foreground">
              This feature performs an in-depth scan of your contact list,
              detecting invalid emails before you send. It identifies:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Invalid or inactive email addresses</li>
              <li>Fake and temporary accounts</li>
              <li>Bots and spam traps</li>
              <li>Unresponsive mail servers</li>
              <li>And much more...</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              By using this tool, you&apos;ll{' '}
              <strong>avoid being flagged as spam</strong>, improve{' '}
              <strong>email deliverability</strong>,{' '}
              <strong>save thousands of dollars</strong> by eliminating wasteful
              sends, and maximize the performance of your campaigns.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {isEstimating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Estimated Time</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs text-muted-foreground">
                          Estimated time to complete the bulk email check.
                          <br />
                          This is an estimate and may not be accurate.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {estimate?.friendlyEstimatedTime}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Estimated Cost</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs text-muted-foreground">
                          Estimated cost to complete the bulk email check.
                          <br />
                          This is an estimate and may not be accurate.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {estimate?.friendlyEstimatedCost}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Total Emails</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="size-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs text-muted-foreground">
                          Total number of emails to check.
                          <br />
                          If your contact group has less than 2 emails, it will
                          be automatically increased to 2.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {estimate?.contactsCount}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Mark as bounced</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div
                      onClick={() => setLevel('valid')}
                      className={cn(
                        'p-2 w-full rounded-md border border-input flex flex-col gap-1 cursor-pointer',
                        level === 'valid' && 'border-primary/50',
                      )}
                    >
                      <p className="text-sm">Valid emails</p>
                      <p className="text-xs text-muted-foreground">
                        It will only mark a contact as bounce if it is in fact
                        an invalid email and is not receiving emails.
                      </p>
                    </div>
                    <div
                      onClick={() => setLevel('safely')}
                      className={cn(
                        'p-2 w-full rounded-md border border-input flex flex-col gap-1 cursor-pointer',
                        level === 'safely' && 'border-primary/50',
                      )}
                    >
                      <p className="text-sm">Valid & safe emails</p>
                      <p className="text-xs text-muted-foreground">
                        It will mark contacts as bounce if the email is invalid
                        (as in the other option) or appears to be risky - such
                        as bots, temporary emails, etc.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isEstimating || isCreating}>
            {isEstimating || isCreating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : step === 'info' ? (
              'Next'
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
