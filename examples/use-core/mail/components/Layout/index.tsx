import * as S from './styles';

export default function Layout({
  children,
}: {
  children: JSX.Element;
  title: string;
}) {
  return (
    <div style={S.Container} container>
      <div style={S.Header} section alignX="center" alignY="center">
        JSX Mail
      </div>
      <div style={S.Content} section>
        {children}
      </div>
    </div>
  );
}
