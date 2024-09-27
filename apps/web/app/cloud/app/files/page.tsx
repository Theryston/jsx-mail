'use client';

import { useCallback, useState } from 'react';
import type { File } from './types';
import type { Pagination as PaginationType } from '../types';
import { Button, Pagination, useDisclosure } from '@nextui-org/react';
import axios from '@/app/utils/axios';
import { PER_PAGE } from './constants';
import DeleteForm from '../DeleteForm';
import { toast } from 'react-toastify';
import { formatSize } from '@/app/utils/format';
import { UploadFileModal } from './UploadFileModal';
import { Add } from 'iconsax-react';
import Table from '../Table';
import moment from 'moment';
import useSWR from 'swr';
import fetcher from '@/app/utils/fetcher';

type FilesPagination = PaginationType & {
  files: File[];
};

export default function Content() {
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
  const {
    data: filesPagination,
    mutate,
    isLoading,
  } = useSWR<FilesPagination>(`/file?page=${page}&take=${PER_PAGE}`, fetcher);

  const deleteFile = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/file/${id}`);
        await mutate();
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [mutate],
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
        <Table
          isLoading={isLoading}
          columns={['ID', 'Name', 'Size', 'Created at', <></>]}
          rows={
            filesPagination?.files.map((file) => [
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
            ]) || []
          }
        />
      </div>

      {(filesPagination?.totalPages || 0) > 1 && (
        <div className="flex gap-2 items-center">
          <Pagination
            size="sm"
            page={page}
            total={filesPagination?.totalPages || 0}
            onChange={(nextPage) => setPage(nextPage)}
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
        fetchFiles={async () => setPage(1)}
      />
    </>
  );
}
