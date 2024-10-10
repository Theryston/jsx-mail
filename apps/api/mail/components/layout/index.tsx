import * as S from './styles';
import LogoImg from '../../assets/jsxmail-logo.png';

export default function Layout({
  children,
}: {
  children: JSX.ElementChildren;
}) {
  return (
    <html>
      <head>
        <font href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" />
      </head>
      <body style={S.Body}>
        <div container style={{ width: '100%' }}>
          <div section alignX="center">
            <div style={S.Header}>
              <img src={LogoImg} alt="JSX Mail" style={S.Logo} />
            </div>
          </div>
          <div section alignX="center">
            <div style={S.Container}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
