'use client';

import { useCallback, useState } from 'react';
import { File } from './types';
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import Link from 'next/link';
import axios from '@/utils/axios';
import { PER_PAGE } from './constants';
import DeleteForm from '../DeleteForm';
import { toast } from 'react-toastify';
import { formatSize } from '@/utils/format';
import { UploadFileModal } from './UploadFileModal';

export function Content({
  files: initialFiles,
  totalPages,
}: {
  files: File[];
  totalPages: number;
}) {
  const [files, setFiles] = useState(initialFiles);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const {
    isOpen: isUploadModalOpen,
    onOpen: onUploadModalOpen,
    onOpenChange: onUploadModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchFiles = useCallback(async (nextPage: number) => {
    setIsLoading(true);

    try {
      const response = await axios.get('/file', {
        params: {
          page: nextPage,
          take: PER_PAGE,
        },
      });

      setFiles(response.data.files);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteFile = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/file/${id}`);
        await fetchFiles(page);
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [fetchFiles, page],
  );

  return (
    <>
      <div className="flex w-full justify-between items-center mb-4 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Files</h1>
          <p className="text-sm">
            Here is a list of all your files. These files are automatically sent
            here by JSX Mail
          </p>
        </div>
        <Button
          color="primary"
          className="max-w-max"
          onPress={onUploadModalOpen}
        >
          Upload File
        </Button>
      </div>
      <Table
        aria-label="List of files"
        className="overflow-x-auto min-h-[60vh]"
        removeWrapper
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>LINK</TableColumn>
          <TableColumn>SIZE</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>MIME TYPE</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          loadingContent={<Spinner />}
          emptyContent="No file found"
        >
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.id}</TableCell>
              <TableCell>
                {(() => {
                  const fileExtension = file.originalName.split('.').pop();
                  // eslint-disable-next-line turbo/no-undeclared-env-vars
                  const link = `${process.env.NEXT_PUBLIC_API_URL}/file/${file.id}.${fileExtension}`;

                  return (
                    <Link
                      href={link}
                      className="text-blue-500 underline"
                      target="_blank"
                    >
                      {link}
                    </Link>
                  );
                })()}
              </TableCell>
              <TableCell>{formatSize(file.size)}</TableCell>
              <TableCell>{file.originalName}</TableCell>
              <TableCell>{file.mimeType}</TableCell>
              <TableCell>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setSelectedFile(file);
                    onDeleteModalOpen();
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full justify-center mt-4">
        <Pagination
          isCompact
          showControls
          showShadow
          page={page}
          total={totalPages}
          onChange={(nextPage) => {
            setPage(nextPage);
            fetchFiles(nextPage);
          }}
        />
      </div>
      <DeleteForm
        confirmKey={selectedFile?.id ?? ''}
        id={selectedFile?.id ?? ''}
        isOpen={isDeleteModalOpen}
        onDelete={deleteFile}
        onOpenChange={(value) => {
          if (!value) setSelectedFile(null);
          onDeleteModalOpenChange();
        }}
      />
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onOpenChange={onUploadModalOpenChange}
        fetchFiles={async () => {
          setPage(1);
          await fetchFiles(page);
        }}
      />
    </>
  );
}
