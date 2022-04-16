import styled from 'styled-components';

export const Header = () => {
  return (
    <Container className="header" style="border: none;">
      <Title>Header text here</Title>
      <p>Ok</p>
    </Container>
  );
};

const Container = styled.div`
  background-color: blue;
  color: red;
`;

const Title = styled.h1`
  color: green;
`;
