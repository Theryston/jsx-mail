import styled from 'styled-components';

export const Container = styled.div<{
  bg?: string;
}>`
  width: 100%;
  background-color: ${props => props.bg || 'red'};
`;
