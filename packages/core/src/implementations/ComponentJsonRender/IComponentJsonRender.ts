import * as React from 'react';

export interface IComponentJsonRender {
  fromComponent(
    // eslint-disable-next-line
    componentFunction: (...props: any) => React.ReactElement,
    // eslint-disable-next-line
    props: any
  ): Promise<IComponentJson>;
}

export interface IComponentJson {
  type: string;
  // eslint-disable-next-line
  children: any[];
  // eslint-disable-next-line
  props: any;
  styles?: {
    key: string;
    value: string;
  }[];
}
