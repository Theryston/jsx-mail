import { Card, CardBody, CardHeader } from '@nextui-org/react';

export default function SectionItem({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col justify-center items-start">
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="text-gray-500">{description}</p>}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
