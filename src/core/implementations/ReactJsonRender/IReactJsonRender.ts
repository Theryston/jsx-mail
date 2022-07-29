import React, { JSXElementConstructor } from 'react';

export interface IReactJsonRender {
  fromComponent(
    componentFunction: (...props: any) => React.ReactElement,
    props: any,
  ): Promise<IReactJson>;
}

export interface IReactJson {
  type: string;
  children: any[];
  props: any;
}
