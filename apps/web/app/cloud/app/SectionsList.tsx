export default function SectionsList({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return <ul className="flex flex-col gap-10 w-full">{children}</ul>;
}
