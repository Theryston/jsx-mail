import styled from 'styled-components';

export const Header = () => {
  return (
    <Container num={54} className="header" style="border: none;">
      <Title>Header text here</Title>
      <p>Ok</p>
    </Container>
  );
};

const Container = styled.div`
  font-size: ${props => props.num}px;
  background-color: blue;
  color: red;
`;

const Title = styled.h1`
  color: green;
`;
