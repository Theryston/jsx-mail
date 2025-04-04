import { useState } from 'react';
import { Button } from '@jsx-mail/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@jsx-mail/ui/dialog';
import { Loader2 } from 'lucide-react';
import {
  useCreateBulkEmailCheck,
  useEstimateBulkEmailCheck,
} from '@/hooks/bulk-sending';
import { BulkEmailCheck } from '@/types/bulk-sending';

type BulkEmailCheckStep = 'info' | 'estimate';

export function BulkEmailCheckBanner({
  bulkEmailChecks,
}: {
  bulkEmailChecks: BulkEmailCheck[];
}) {
  const processingCheck = bulkEmailChecks.find(
    (check) => check.status === 'pending' || check.status === 'processing',
  );

  if (!processingCheck) return null;

  return (
    <div className="rounded-md p-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
      <div className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        <p className="text-sm">
          Processing Bulk Email Check: {processingCheck._count.results}/
          {processingCheck.totalEmails} emails checked
        </p>
      </div>
    </div>
  );
}

export function BulkEmailCheckModal({
  isOpen,
  onOpenChange,
  contactGroupId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contactGroupId: string;
}) {
  const [step, setStep] = useState<BulkEmailCheckStep>('info');
  const { data: estimate, isLoading: isEstimating } =
    useEstimateBulkEmailCheck(contactGroupId);
  const { mutate: createBulkEmailCheck, isPending: isCreating } =
    useCreateBulkEmailCheck();

  const handleConfirm = () => {
    if (step === 'info') {
      setStep('estimate');
    } else {
      createBulkEmailCheck({ contactGroupId });
      onOpenChange(false);
    }
  };

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
                  <p className="text-sm font-medium">Estimated Time</p>
                  <p className="text-sm text-muted-foreground">
                    {estimate?.friendlyEstimatedTime}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Estimated Cost</p>
                  <p className="text-sm text-muted-foreground">
                    {estimate?.friendlyEstimatedCost}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Total Emails</p>
                  <p className="text-sm text-muted-foreground">
                    {estimate?.contactsCount}
                  </p>
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
