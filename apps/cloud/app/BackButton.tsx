import { Button } from '@nextui-org/react';
import { ArrowLeft } from 'iconsax-react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      isIconOnly
      onClick={() => router.back()}
      className="fixed top-5 left-5 z-50"
    >
      <ArrowLeft size="0.85rem" />
    </Button>
  );
}
