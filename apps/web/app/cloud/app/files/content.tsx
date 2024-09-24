'use client';

import { useCallback, useState } from 'react';
import { File } from './types';
import { Button, Pagination, Skeleton, useDisclosure } from '@nextui-org/react';
import axios from '@/app/utils/axios';
import { PER_PAGE } from './constants';
import DeleteForm from '../DeleteForm';
import { toast } from 'react-toastify';
import { formatSize } from '@/app/utils/format';
import { UploadFileModal } from './UploadFileModal';
import { Add } from 'iconsax-react';
import Table from '../Table';
import moment from 'moment';

export function Content({
  files: initialFiles,
  totalPages: initialTotalPages,
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
  const [totalPages, setTotalPages] = useState(initialTotalPages);

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
      setTotalPages(response.data.totalPages);
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
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl">
          <span className="font-bold">Your</span> files
        </h1>
        <Button
          size="sm"
          isIconOnly
          color="primary"
          onClick={onUploadModalOpen}
        >
          <Add />
        </Button>
      </div>

      <div>
        {!isLoading ? (
          <Table
            columns={['ID', 'Name', 'Size', 'Created at', <></>]}
            rows={files.map((file) => [
              file.id,
              file.originalName,
              formatSize(file.size),
              moment(file.createdAt).format('DD/MM/YYYY'),
              <div className="flex gap-3">
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onClick={() => {
                    window.open(file.url, '_blank');
                  }}
                >
                  Download
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => {
                    setSelectedFile(file);
                    onDeleteModalOpen();
                  }}
                >
                  Delete
                </Button>
              </div>,
            ])}
          />
        ) : (
          <div className="w-full flex items-center justify-center">
            <Table
              columns={['ID', 'Name', 'Size', 'Created at', <></>]}
              rows={Array.from({ length: 6 }).map((_, index) => [
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
                <Skeleton className="rounded-xl h-10 w-full" key={index} />,
              ])}
            />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 items-center">
          <Pagination
            size="sm"
            page={page}
            total={totalPages}
            onChange={(nextPage) => {
              setPage(nextPage);
              fetchFiles(nextPage);
            }}
          />
        </div>
      )}
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
