import LogoImg from '../assets/logo.png';
import CodeImg from '../assets/code.png';
import * as S from './featured.styles';

export default function Featured() {
  return (
    <div style={S.Container} section alignX="center">
      <img style={S.Logo} src={LogoImg} alt="JSX Mail Image" />
      <h1 style={S.Title}>Welcome to JSX Mail</h1>
      <p style={S.Paragraph}>
        The smartest, easiest and most compatible way to create email templates
        with JSX syntax. Transform complexity into creativity!
      </p>
      <img style={S.Code} src={CodeImg} alt="JSX Mail Code" />
    </div>
  );
}
