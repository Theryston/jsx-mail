import type { MouseEventHandler } from 'react';

export function CTAButton({
  children,
  outline,
  onClick,
}: {
  outline?: boolean;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const outlineClasses = 'border border-blue-700 hover:border-blue-900';
  const filledClasses =
    'text-white border-transparent bg-blue-700 hover:bg-blue-900';

  return (
    <div className="relative w-full group">
      <button
        className={`w-full min-w-[120px] text-base font-medium no-underline ${
          outline ? outlineClasses : filledClasses
        } md:leading-6 transition-all duration-300`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
