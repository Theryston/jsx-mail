import { Container } from '@/components/container';
import { use } from 'react';

export default function ContactGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  console.log('id', id);

  return (
    <Container header>
      <div>ContactGroupPage</div>
    </Container>
  );
}
