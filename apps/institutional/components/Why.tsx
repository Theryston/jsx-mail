import { getTranslations } from 'next-intl/server';

const REASON_KEYS = [
  'fully-integrated',
  'simple-usage',
  'compatibility',
  'developer-friendly',
] as const;

export default async function Why() {
  const t = await getTranslations('Why');

  return (
    <div
      id="why"
      className="my-20 md:my-0 md:h-[80vh] flex justify-center items-center flex-col md:flex-row gap-20"
    >
      <h1 className="text-primary font-bold text-7xl md:text-8xl">
        {t('title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {REASON_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-3 w-full md:max-w-80">
            <h2 className="text-base font-medium">
              {t(`reasons.${key}.title`)}
            </h2>
            <p className="text-sm text-gray-500">
              {t(`reasons.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
