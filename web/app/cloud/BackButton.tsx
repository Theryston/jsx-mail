import { Button } from '@nextui-org/react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      isIconOnly
      onClick={() => router.push('/')}
      className="absolute top-5 left-5"
    >
      <ArrowLeftIcon />
    </Button>
  );
}
