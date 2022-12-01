import React from 'react';
import styled from 'styled-components';

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  href?: string;
}

export const Button = ({ children, href, ...rest }: IButtonProps) => {
  if (href && !href.startsWith('{{') && !href.startsWith('http')) {
    console.log(
      '\x1b[31m',
      'Error: Button href should start with http:// or https://',
      '\x1b[0m',
    );
  }

  return (
    <StyledAnchor href={href} target="_blank" {...rest}>
      {children}
    </StyledAnchor>
  );
};

const StyledAnchor = styled.a`
  background-color: #fcfcfc;
  border: 1px solid #d9d9d9;
  color: #0a0a0a;
  padding: 5px 20px;
  text-align: center;
  text-decoration: none;
`;
