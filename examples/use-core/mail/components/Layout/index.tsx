import * as S from './styles';
import LogoImg from '../../assets/logu.png';

export default function Layout({
  children,
  title,
}: {
  children: JSX.Element;
  title: string;
}) {
  return (
    <html lang="en-US">
      <head>
        <title>{title}</title>
      </head>
      <body style={S.BodyStyles}>
        <div style={S.Container} container>
          <div style={S.Header} section alignX="center" alignY="center">
            <img style={S.Logo} src={LogoImg} alt="JSX Mail" />
          </div>
          <div style={S.Content} section>
            {children}
          </div>
        </div>
        <div container>
          <div style={S.Footer} section alignX="center" alignY="center">
            @ {new Date().getFullYear()} JSX Mail
          </div>
        </div>
      </body>
    </html>
  );
}
