import styled from 'styled-components';

const { Header } = require('../../components/Header');

export const VerifyEmail = () => {
  return (
    <Container>
      <Header />
      <h1>Verify Email</h1>
    </Container>
  );
};

const Container = styled.div`
  background-color: blue;
`;
