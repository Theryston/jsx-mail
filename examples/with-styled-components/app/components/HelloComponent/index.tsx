import React from 'react';
import * as S from './styles';

export function HelloComponent({
  name,
  paragraph,
}: {
  name: string;
  paragraph: string;
}) {
  return (
    <S.Container bg="#fff222">
      <h1>Hello, {name}</h1>
      <p>{paragraph}</p>
    </S.Container>
  );
}
