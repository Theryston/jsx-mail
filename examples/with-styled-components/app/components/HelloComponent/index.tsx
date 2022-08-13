import React from 'react';
import * as S from './styles';

export function HelloComponent({ text }: { text: string }) {
  return (
    <S.Container bg="#fff222">
      <h1>{text}</h1>
      <h1>Hello World!</h1>
    </S.Container>
  );
}
