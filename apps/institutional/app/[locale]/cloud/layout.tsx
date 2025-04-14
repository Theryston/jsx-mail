import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'JSX Mail Cloud - The most efficient and cost-effective cloud for email delivery',
  description:
    'The best cloud for email delivery, with the most efficient and cost-effective infrastructure.',
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
