import styled from 'styled-components';

export const Container = styled.div<{
  bg?: string;
}>`
  width: 100%;
  background-color: ${props => props.bg || 'red'};
  display: flex;
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Image = styled.img`
  width: 500px;
  height: 500px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid black;
`;
