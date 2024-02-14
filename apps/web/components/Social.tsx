import { GitHubIcon } from 'nextra/icons';

export function Github() {
  return (
    <a
      className="hidden p-2 text-current sm:flex hover:opacity-75"
      href="https://github.com/Theryston/jsx-mail"
      rel="noreferrer"
      target="_blank"
      title="JSX Mail GitHub repo"
    >
      <GitHubIcon />
    </a>
  );
}
