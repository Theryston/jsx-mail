import * as S from './info.styles';

export default function Info({ version }) {
  return (
    <div section alignX="left">
      <p style={S.Paragraph}>
        Start by editing the templates/welcome.tsx file and see how your
        template automatically updates in the preview
      </p>
      <button style={S.Button} href="https://docs.jsxmail.org/introduction">
        Read the documentation
      </button>
      <p>
        Are you on version {version}? This is the latest version available, by
        the way this information was loaded by your email template directly from
        github with a GET request
      </p>
    </div>
  );
}
