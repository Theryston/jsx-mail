import styled from 'styled-components';
import { Group } from '@jsx-mail/components';

export const Container = styled(Group)<{
  bg?: string;
}>`
  width: 100%;
  background-color: ${(props) => props.bg || 'red'};
`;
