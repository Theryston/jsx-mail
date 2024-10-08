'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Link } from '@nextui-org/link';

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

const faqData: FaqItem[] = [
  {
    question: 'Is the pricing a subscription?',
    answer:
      'No, the JSX Mail Cloud is a pay-as-you-go service. You only pay for what you use, and there are no subscription fees.',
  },
  {
    question: 'Can I use JSX Mail Cloud with other frameworks?',
    answer: (
      <>
        Yes, you can see into the{' '}
        <Link href="https://docs.jsxmail.org/api-reference" isExternal>
          API Reference
        </Link>{' '}
        the JSX Mail Cloud if just a API that you call by giving a HTML body,
        and we will send it for you. So you can use any framework to build your
        email, and then just send it to JSX Mail Cloud.
      </>
    ),
  },
  {
    question: 'Can I use JSX Mail framework with other sending providers?',
    answer: (
      <>
        Yes, as you can see into the{' '}
        <Link
          href="https://docs.jsxmail.org/framework/learning/rendering"
          isExternal
        >
          rendering documentation
        </Link>
        , you can use the JSX Mail framework just for generating the HTML body,
        and then you can use any sending provider to send your email. You can
        also{' '}
        <Link href="https://docs.jsxmail.org/cli/zip" isExternal>
          zip your email
        </Link>{' '}
        and get the files as images and then add it to any email platform that
        need a zip file.
      </>
    ),
  },
  {
    question: 'Can I use the JSX Mail Cloud with other languages?',
    answer:
      'Yes, you can use the JSX Mail Cloud with any language that can send a HTTP request, like: JavaScript/Node.js, Python, PHP, Ruby, Go, Rust, Java, C#, etc.',
  },
  {
    question: 'Is JSX Mail Cloud suitable for large-scale email campaigns?',
    answer:
      'Yes, JSX Mail is designed to handle large-scale email campaigns efficiently. You can leverage the Cloud features to manage and send bulk emails seamlessly.',
  },
  {
    question: 'What kind of support is available for JSX Mail?',
    answer: (
      <>
        We offer community support through our{' '}
        <Link
          href="https://github.com/Theryston/jsx-mail/discussions"
          isExternal
        >
          GitHub Discussions
        </Link>{' '}
        and you can also contact our{' '}
        <Link href="https://docs.jsxmail.org/cloud/support">support team</Link>{' '}
        for more personalized assistance.
      </>
    ),
  },
  {
    question: 'Is there a limit to the number of emails I can send?',
    answer:
      'There are no hard limits on the number of emails you can send, but we recommend checking our pricing page for any applicable usage policies.',
  },
  {
    question: 'Does JSX Mail comply with email marketing regulations?',
    answer:
      'Yes, JSX Mail is designed to comply with major email marketing regulations, including the CAN-SPAM Act and GDPR. We provide features that help you manage consent and ensure that your email campaigns adhere to legal requirements.',
  },
];

export default function Faq() {
  return (
    <div id="faq" className="flex flex-col gap-9 items-center mb-20 w-full">
      <h2 className="text-4xl font-bold text-center">FAQ</h2>

      <div className="w-full md:w-8/12">
        <Accordion variant="splitted">
          {faqData.map((item, index) => (
            <AccordionItem
              key={`${item}-${index}`}
              title={<p className="text-base font-medium">{item.question}</p>}
            >
              <p className="text-sm text-zinc-300">{item.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
