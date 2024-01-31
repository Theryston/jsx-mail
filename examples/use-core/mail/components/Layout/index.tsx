import * as S from './styles';
import LogoImg from '../../assets/logo.png';

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
        <font href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" />
      </head>
      <body style={S.BodyStyles}>
        <div style={S.Container} container>
          <div style={S.Header} section alignX="center" alignY="center">
            <div container>
              <div style={S.Header} section alignX="left">
                <img style={S.Logo} src={LogoImg} alt="JSX Mail" />
              </div>
            </div>
          </div>
          <div style={S.Content} section>
            {children}
          </div>
        </div>
        <div style={S.Footer} container>
          <div flex section alignY="center">
            <p>@ {new Date().getFullYear()}</p>
            <p>JSX Mail</p>
          </div>
        </div>
      </body>
    </html>
  );
}
