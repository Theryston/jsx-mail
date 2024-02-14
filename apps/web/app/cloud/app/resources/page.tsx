import DomainPage from '../domains/page';
import PageFiles from '../files/page';
import SendersPage from '../senders/page';
import SectionsList from '../SectionsList';
import SectionItem from '../SectionItem';

export default function Page() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Resources</h1>
      <p className="text-gray-500">
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
            title="Senders"
            description="Here is a list of all your senders. You can use them to send emails"
          >
            <SendersPage />
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
