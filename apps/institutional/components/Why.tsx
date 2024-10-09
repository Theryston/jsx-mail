const REASONS = [
  {
    title: 'Fully integrated',
    description:
      'JSX Mail is a complete email workflow tool that lets you do everything in one place without needing other tools.',
  },
  {
    title: 'Simple usage',
    description:
      'With full integration, JSX Mail is easy to use; for example: with images, just add images to your project, and it optimizes, hosts, and inserts them automatically into the final email.',
  },
  {
    title: 'Compatibility',
    description:
      'JSX Mail is compatible with all email clients, converting JSX code into HTML and adapting tags for universal support.',
  },
  {
    title: 'Developer friendly',
    description:
      'Designed with developers in mind, JSX Mail enhances the coding experience, focusing on efficient email development.',
  },
];

export default function Why() {
  return (
    <div
      id="why"
      className="my-20 md:my-0 md:h-[80vh] flex justify-center items-center flex-col md:flex-row gap-20"
    >
      <h1 className="text-primary font-bold text-7xl md:text-8xl">Why?</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {REASONS.map((reason, index) => (
          <div key={index} className="flex flex-col gap-3 w-full md:max-w-80">
            <h2 className="text-base font-medium">{reason.title}</h2>
            <p className="text-sm text-gray-500">{reason.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
