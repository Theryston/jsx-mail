import { Button } from 'jsx-mail/components';
import styled from 'styled-components';

export function MyButton({ children }) {
  return <ButtonStyled>{children}</ButtonStyled>;
}

const ButtonStyled = styled(Button)`
  background-color: red;
`;
