import * as S from './styles';

export default function Layout({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) {
  return (
    <div>
      <title>{title}</title>
      <styling
        style={{
          body: {
            margin: '0',
            padding: '0',
          },
          '.footer': {
            width: '100%',
            height: '50px',
            fontSize: '12px',
            background: '#D9D9D9',
            color: '#000',
          },
        }}
      />
      <div style={S.Container} container>
        <div style={S.Header} section alignX="center" alignY="center">
          JSX Mail
        </div>
        <div style={S.Content} section>
          {children}
        </div>
      </div>
      <div container>
        <div className="footer" section alignX="center" alignY="center">
          @ {new Date().getFullYear()} JSX Mail
        </div>
      </div>
    </div>
  );
}
