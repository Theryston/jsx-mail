import styled from 'styled-components';
import { VerifyEmail } from './templates/VerifyEmail';

export const App = props => {
  return <Container>{props}</Container>;
};

const Container = styled.div`
  background-color: red;
`;

export const templates = [VerifyEmail];
