import * as S from './layout.styles';

export default function Layout({
  children,
}: {
  children: JSX.ElementChildren;
}) {
  return (
    <html>
      <head>
        <font href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
      </head>
      <body style={S.Body}>
        <div container style={{ width: '100%' }}>
          <div section alignX="center">
            <div style={S.Container}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
