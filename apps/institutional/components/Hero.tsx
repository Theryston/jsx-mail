import { Link } from '@nextui-org/link';
import { Button } from '@nextui-org/button';

export default function Hero() {
  return (
    <div className="flex flex-col gap-3 md:gap-5 items-center justify-start md:justify-center h-[calc(100vh-64px)]">
      <div className="flex flex-col items-center justify-end md:justify-center gap-2 h-full md:h-fit">
        <Link
          href="https://github.com/Theryston/jsx-mail"
          target="_blank"
          style={{
            fontSize: '10px',
            lineHeight: '10px',
          }}
        >
          Our github with the MIT code
        </Link>

        <div className="flex flex-col items-center gap-4">
          <h1 className="hidden md:block text-7xl 2xl:text-8xl font-bold text-center bg-gradient-to-br from-primary-900 to-primary-700 text-transparent bg-clip-text">
            One Tool. One Seamless <br /> Email Workflow
          </h1>

          <h1 className="md:hidden text-4xl font-bold text-center bg-gradient-to-br from-primary-900 to-primary-700 text-transparent bg-clip-text">
            One Tool.
            <br /> One Seamless <br /> Email Workflow
          </h1>

          <p className="text-center w-full text-xs 2xl:text-sm md:text-sm md:w-7/12">
            The complete solution for your email flow, combining a modern
            framework for template creation with the most efficient and
            cost-effective cloud for email delivery.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full md:w-4/12">
        <Button
          color="primary"
          variant="shadow"
          as={Link}
          href="https://cloud.jsxmail.org"
          target="_blank"
          fullWidth
        >
          Cloud
        </Button>
        <Button
          color="primary"
          variant="flat"
          as={Link}
          href="https://docs.jsxmail.org"
          target="_blank"
          fullWidth
        >
          Docs
        </Button>
      </div>
    </div>
  );
}
