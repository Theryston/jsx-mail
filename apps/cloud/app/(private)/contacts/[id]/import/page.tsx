'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/container';
import { Button } from '@jsx-mail/ui/button';
import { useParams } from 'next/navigation';
import { useUploadFile } from '@/hooks/file';
import { useCreateContactImport } from '@/hooks/bulk-sending';
import { toast } from '@jsx-mail/ui/sonner';
import { ArrowLeft, FileUp, Import, MoveRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jsx-mail/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@jsx-mail/ui/table';
import { useDropzone } from 'react-dropzone';

enum ImportSteps {
  UPLOAD = 'upload',
  MAP_COLUMNS = 'map_columns',
}

const FIELD_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'email', label: 'Email' },
  { value: 'name', label: 'Name' },
];

function parseCSV(text: string, maxRows = 5) {
  const lines = text.split('\n').slice(0, maxRows + 1);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map((header) => header.trim());

  const rows = lines.slice(1, maxRows + 1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    return values;
  });

  return { headers, rows };
}

export default function ImportContactsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [step, setStep] = useState<ImportSteps>(ImportSteps.UPLOAD);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files) => setFile(files[0]),
    accept: { csv: ['*'] },
    multiple: false,
  });
  const [csvData, setCSVData] = useState<{
    headers: string[];
    rows: string[][];
  }>({ headers: [], rows: [] });
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    {},
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutateAsync: createContactImport, isPending: isCreatingImport } =
    useCreateContactImport(id);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const back = searchParams.get('back') || `/contacts/${id}`;

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsProcessing(true);
    try {
      const uploadedFile = await uploadFile(file);
      setUploadedFileId(uploadedFile.id);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const content = e.target.result as string;
          const { headers, rows } = parseCSV(content);
          setCSVData({ headers, rows });

          const newMappings: Record<string, string> = {};

          let emailColumn = '';
          let nameColumn = '';
          headers.forEach((header) => {
            const headerLower = header.toLowerCase();
            if (
              (headerLower.includes('email') || headerLower === 'e-mail') &&
              !emailColumn
            ) {
              newMappings[header] = 'email';
              emailColumn = header;
            } else if (
              (headerLower.includes('name') || headerLower === 'nome') &&
              !nameColumn
            ) {
              newMappings[header] = 'name';
              nameColumn = header;
            } else {
              newMappings[header] = 'none';
            }
          });

          setColumnMappings(newMappings);
          setStep(ImportSteps.MAP_COLUMNS);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error('Failed to upload file. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingChange = (columnName: string, mappingValue: string) => {
    if (mappingValue !== 'none') {
      const newMappings = { ...columnMappings };

      Object.keys(newMappings).forEach((col) => {
        if (col !== columnName && newMappings[col] === mappingValue) {
          newMappings[col] = 'none';
        }
      });

      newMappings[columnName] = mappingValue;
      setColumnMappings(newMappings);
    } else {
      setColumnMappings((prev) => ({
        ...prev,
        [columnName]: mappingValue,
      }));
    }
  };

  const getEmailColumn = (): string => {
    for (const [column, mapping] of Object.entries(columnMappings)) {
      if (mapping === 'email') return column;
    }
    return '';
  };

  const getNameColumn = (): string => {
    for (const [column, mapping] of Object.entries(columnMappings)) {
      if (mapping === 'name') return column;
    }
    return '';
  };

  const handleImport = async () => {
    if (!uploadedFileId) {
      toast.error('No file uploaded');
      return;
    }

    const emailColumn = getEmailColumn();
    if (!emailColumn) {
      toast.error('Please select a column for Email');
      return;
    }

    setIsProcessing(true);
    try {
      await createContactImport({
        fileId: uploadedFileId,
        emailColumn,
        nameColumn: getNameColumn(),
      });

      toast.success('Contacts import started successfully!');
      router.push(back);
    } catch (error) {
      toast.error('Failed to start import. Please try again.');
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    if (step === ImportSteps.MAP_COLUMNS) {
      setStep(ImportSteps.UPLOAD);
    } else {
      router.push(back);
    }
  };

  return (
    <Container header>
      <div className="flex flex-col gap-6 pb-14">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goBack}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold">Import Contacts</h1>
        </div>

        <div>
          <p className="text-sm font-medium">
            {step === ImportSteps.UPLOAD
              ? 'Upload CSV File'
              : 'Map CSV Columns'}
          </p>

          <p className="text-xs text-zinc-400">
            {step === ImportSteps.UPLOAD
              ? 'Upload a CSV file containing your contacts'
              : 'Select which columns from your file should be mapped to contact fields'}
          </p>
        </div>

        {step === ImportSteps.UPLOAD ? (
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept="csv"
              className="hidden"
              id="upload-file-input"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files?.[0]);
              }}
              ref={inputFileRef}
            />
            <label
              htmlFor="upload-file-input"
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-md p-8 cursor-pointer"
              {...getRootProps()}
            >
              <FileUp className="size-12 text-zinc-500 mb-4" />
              <p className="text-xs text-zinc-400 mb-4 text-center">
                {isDragActive
                  ? 'Drop your CSV file here'
                  : 'Click here or drag and drop your CSV file'}
              </p>
            </label>
            {file && (
              <p className="text-xs text-zinc-400 text-center">
                Selected file: {file.name}
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-zinc-900 p-4 ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Your File Column</TableHead>
                  <TableHead>Destination Column</TableHead>
                  <TableHead>Your Sample Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.headers.map((header, index) => (
                  <TableRow key={header}>
                    <TableCell className="font-medium">{header}</TableCell>
                    <TableCell>
                      <Select
                        value={columnMappings[header] || 'none'}
                        onValueChange={(value) =>
                          handleMappingChange(header, value)
                        }
                      >
                        <SelectTrigger
                          className={
                            columnMappings[header] === 'email'
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                              : columnMappings[header] === 'name'
                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                : 'border border-zinc-700'
                          }
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_OPTIONS.map((option) => {
                            const isDisabled =
                              option.value !== 'none' &&
                              option.value !== columnMappings[header] &&
                              Object.entries(columnMappings).some(
                                ([col, mapping]) =>
                                  col !== header && mapping === option.value,
                              );

                            return (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                disabled={isDisabled}
                                className={
                                  isDisabled
                                    ? 'text-muted-foreground cursor-not-allowed'
                                    : ''
                                }
                              >
                                {option.label}
                                {isDisabled && ' (Already mapped)'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {csvData.rows[0] && csvData.rows[0][index] ? (
                        csvData.rows[0][index]
                      ) : (
                        <span className="text-muted-foreground">Empty</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex gap-2 justify-between">
          <Button variant="outline" onClick={goBack}>
            {step === ImportSteps.UPLOAD ? 'Cancel' : 'Back'}
          </Button>
          {step === ImportSteps.UPLOAD ? (
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading || isProcessing}
            >
              {isUploading || isProcessing ? 'Processing...' : 'Continue'}
              <MoveRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={handleImport}
              disabled={!getEmailColumn() || isCreatingImport || isProcessing}
            >
              {isCreatingImport || isProcessing ? 'Importing...' : 'Import'}
              <Import className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
