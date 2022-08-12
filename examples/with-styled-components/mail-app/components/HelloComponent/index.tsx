import React from 'react';
import * as S from './styles';

export function HelloComponent({ text }: { text: string }) {
  return (
    <S.Container bg="#fff022">
      <S.Image src="https://picsum.photos/1000" alt="picsum" />
      <S.Wrapper>
        <h1>{text}</h1>
        <h1>Hello World!</h1>
        <p>Hello World Paragraph!</p>
      </S.Wrapper>
    </S.Container>
  );
}
