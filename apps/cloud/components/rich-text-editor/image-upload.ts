import { uploadFile } from '@/hooks/file';
import { toast } from '@jsx-mail/ui/sonner';
import { createImageUpload } from 'novel';

const onUpload = async (file: File) => {
  const toastId = toast.loading('Uploading image...');
  const promise = await uploadFile(file);
  toast.success('Image uploaded successfully.', { id: toastId });

  return promise.url;
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes('image/')) {
      toast.error('File type not supported.');
      return false;
    }

    if (file.size / 1024 / 1024 > 20) {
      toast.error('File size too big (max 20MB).');
      return false;
    }

    return true;
  },
});
