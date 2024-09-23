import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  height?: string;
  width?: string;
};

export default function Card({ children, height, width }: Props) {
  return (
    <div
      className={clsx('p-5 bg-zinc-900 rounded-2xl', {
        'w-full': !width,
        'h-full': !height,
      })}
      style={{
        height,
        width,
      }}
    >
      {children}
    </div>
  );
}
