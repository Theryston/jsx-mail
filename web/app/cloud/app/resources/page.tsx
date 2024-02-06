import { Card, CardBody, CardHeader } from '@nextui-org/react';
import DomainPage from '../domains/page';
import PageFiles from '../files/page';

export default function Page() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Resources</h1>
      <p className="text-gray-500 mt-2">
        Here you can find all the resources you need to use JSX Mail.
      </p>
      <div className="mt-6">
        <SectionsList>
          <SectionItem
            title="Domains"
            description="Here is a list of all your domains. You can use them to create a sender for your emails"
          >
            <DomainPage />
          </SectionItem>
          <SectionItem
            title="Files"
            description="Here is a list of all your files. These files are automatically uploaded by JSX Mail when you import them and use them in your email templates"
          >
            <PageFiles />
          </SectionItem>
        </SectionsList>
      </div>
    </main>
  );
}

function SectionsList({ children }: { children: React.ReactNode[] }) {
  return <ul className="flex flex-col gap-10">{children}</ul>;
}

function SectionItem({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col justify-center items-start">
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="text-gray-500">{description}</p>}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
