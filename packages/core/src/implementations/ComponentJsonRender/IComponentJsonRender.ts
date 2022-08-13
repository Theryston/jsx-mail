import * as React from 'react';

export interface IComponentJsonRender {
  fromComponent(
    componentFunction: (...props: any) => React.ReactElement,
    props: any
  ): Promise<IComponentJson>;
}

export interface IComponentJson {
  type: string;
  children: any[];
  props: any;
  styles?: {
    key: string;
    value: string;
  }[];
}
