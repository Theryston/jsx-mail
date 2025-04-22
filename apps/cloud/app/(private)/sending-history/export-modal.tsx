import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@jsx-mail/ui/dialog';
import { Button } from '@jsx-mail/ui/button';
import { useExportMessages, useGetExportMessages } from '@/hooks/user';
import { Alert, AlertDescription } from '@jsx-mail/ui/alert';
import { Loader2 } from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMessages: number;
  filters: {
    startDate: moment.Moment;
    endDate: moment.Moment;
    statuses: string[];
  };
}

export function ExportModal({
  isOpen,
  onClose: onCloseProp,
  filters,
  totalMessages,
}: ExportModalProps) {
  const [step, setStep] = useState<
    'format' | 'error' | 'processing' | 'download'
  >('format');
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [error, setError] = useState<string | null>(null);

  const { mutate: exportMessages, isPending: isExporting } =
    useExportMessages();

  const [exportId, setExportId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const { data: exportData } = useGetExportMessages(exportId, status);

  useEffect(() => {
    if (exportData?.exportStatus === 'completed' && step === 'processing') {
      setStep('download');
    } else if (exportData?.exportStatus === 'failed' && step === 'processing') {
      setError(
        exportData.errorMessage ||
          'An error occurred while processing the export',
      );
      setStep('error');
    }
  }, [exportData, step]);

  const handleExport = () => {
    setError(null);
    exportMessages(
      {
        format,
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        statuses: filters.statuses.join(','),
      },
      {
        onSuccess: (data) => {
          setExportId(data.id);
          setStatus(data.exportStatus);
          setStep('processing');
        },
      },
    );
  };

  const onClose = () => {
    if (step === 'processing') {
      toast.error('You cannot close the modal while the export is processing');
      return;
    }

    onCloseProp();
    setStep('format');
    setExportId(null);
    setStatus(null);
    setError(null);
  };

  const handleDownload = () => {
    if (exportData?.file?.url) {
      window.open(exportData.file.url, '_blank');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export {totalMessages} Messages</DialogTitle>
          <DialogDescription>
            Export your messages to a file. You can choose the format and the
            date range.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'format' && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button
                variant={format === 'json' ? 'default' : 'outline'}
                onClick={() => setFormat('json')}
              >
                JSON
              </Button>
              <Button
                variant={format === 'csv' ? 'default' : 'outline'}
                onClick={() => setFormat('csv')}
              >
                CSV
              </Button>
            </div>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting export...
                </>
              ) : (
                'Start Export'
              )}
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Processing your export...
            </p>
          </div>
        )}

        {step === 'download' && (
          <div className="flex flex-col gap-4">
            <p>Your export is ready!</p>
            <Button onClick={handleDownload}>Download File</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
