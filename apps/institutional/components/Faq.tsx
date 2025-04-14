'use client';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { Link } from '@heroui/link';
import { useTranslations } from 'next-intl';

const QUESTION_KEYS = [
  'pricing-subscription',
  'use-with-other-frameworks',
  'use-framework-with-other-providers',
  'use-with-other-languages',
  'large-scale-campaigns',
  'support',
  'email-limits',
  'compliance',
] as const;

export default function Faq() {
  const t = useTranslations('Faq');

  const faqData = QUESTION_KEYS.map((key) => {
    const question = t(`questions.${key}.question`);
    let answer: any;

    if (key === 'use-with-other-frameworks') {
      answer = t.rich(`questions.${key}.answer`, {
        apiReference: (chunks: any) => (
          <Link
            href="https://docs.jsxmail.org/api-reference"
            isExternal
            aria-label="View API Reference documentation"
          >
            {chunks}
          </Link>
        ),
      });
    } else if (key === 'use-framework-with-other-providers') {
      answer = t.rich(`questions.${key}.answer`, {
        renderingDocs: (chunks: any) => (
          <Link
            href="https://docs.jsxmail.org/framework/learning/rendering"
            isExternal
            aria-label="View rendering documentation"
          >
            {chunks}
          </Link>
        ),
        zipDocs: (chunks: any) => (
          <Link
            href="https://docs.jsxmail.org/cli/zip"
            isExternal
            aria-label="Learn about zipping your email"
          >
            {chunks}
          </Link>
        ),
      });
    } else if (key === 'support') {
      answer = t.rich(`questions.${key}.answer`, {
        githubDiscussions: (chunks: any) => (
          <Link
            href="https://github.com/Theryston/jsx-mail/discussions"
            isExternal
            aria-label="Visit GitHub Discussions"
          >
            {chunks}
          </Link>
        ),
        supportTeam: (chunks: any) => (
          <Link
            href="https://docs.jsxmail.org/cloud/support"
            aria-label="Contact support team"
          >
            {chunks}
          </Link>
        ),
      });
    } else {
      answer = t(`questions.${key}.answer`);
    }

    return {
      question,
      answer,
    };
  });

  return (
    <div id="faq" className="flex flex-col gap-9 items-center mb-20 w-full">
      <h2 className="text-4xl font-bold text-center">{t('title')}</h2>

      <div className="w-full md:w-8/12">
        <Accordion variant="splitted">
          {faqData.map((item, index) => (
            <AccordionItem
              key={`${item.question}-${index}`}
              title={<p className="text-base font-medium">{item.question}</p>}
              textValue={item.question}
            >
              <p className="text-sm text-zinc-300">{item.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
