import React from 'react';
import { IComponentJson, IComponentJsonRender } from './IComponentJsonRender';

export class ComponentJsonRender implements IComponentJsonRender {
  async fromComponent(
    // eslint-disable-next-line
    componentFunction: (...props: any) => React.ReactElement,
    // eslint-disable-next-line
    props: any
  ): Promise<IComponentJson> {
    let response: IComponentJson = {
      type: '',
      children: [],
      props: {},
    };

    const result = await componentFunction(props);

    if (Array.isArray(result.props['children'])) {
      for (const child of result.props['children']) {
        response.children.push(await this.handleChild(child));
      }
    } else {
      response.children = [await this.handleChild(result.props['children'])];
    }

    response.props = { ...result.props };

    // eslint-disable-next-line
    if ((result.type as any).componentStyle) {
      const styleResult = await this.handleStyle(result);
      Object.keys(response.props).forEach((propKey) => {
        if (styleResult.usedProps.includes(propKey)) {
          delete response.props[propKey];
        }
      });
      response.styles = styleResult.styleArr;
      // eslint-disable-next-line
      response.type = (result.type as any).target;
    } else {
      response.type = result.type as string;
    }

    if (typeof response.type !== 'string') {
      response = await this.fromComponent(response.type, response.props);
    }

    if (response.props.children) {
      delete response.props.children;
    }

    return response;
  }

  async handleStyle(
    component: React.ReactElement<
      // eslint-disable-next-line
      any,
      // eslint-disable-next-line
      string | React.JSXElementConstructor<any>
    >
  ) {
    const usedProps: string[] = [];
    // eslint-disable-next-line
    const styleString: any = (component.type as any).componentStyle.rules
      // eslint-disable-next-line
      .map((rule: any) => {
        if (typeof rule === 'string') {
          return rule;
        } else {
          const propValue = rule(component.props);
          Object.keys(component.props).forEach((propKey) => {
            if (component.props[propKey] === propValue) {
              usedProps.push(propKey);
            }
          });
          return propValue;
        }
      })
      .join('');
    const styleArr = styleString
      .split(';')
      // eslint-disable-next-line
      .filter((s: any) => s.length > 0)
      // eslint-disable-next-line
      .map((style: any) => {
        const [key, value] = style.split(':');
        return {
          key,
          value,
        };
      });
    return {
      styleArr,
      usedProps,
    };
  }

  // eslint-disable-next-line
  async handleChild(child: any): Promise<any> {
    if (!child) {
      return null;
    }

    if (!child['$$typeof']) {
      return child;
    }

    if (typeof child.type !== 'function') {
      const children = [];
      const props = { ...child.props };
      delete props.children;

      if (child.props.children) {
        if (Array.isArray(child.props.children)) {
          for (const c of child.props.children) {
            children.push(await this.handleChild(c));
          }
        } else {
          children.push(await this.handleChild(child.props.children));
        }
      }

      const result = {
        styles: child.styles,
        type: child.type as string,
        children: children,
        props,
      };

      if (
        typeof result.type !== 'string' &&
        // eslint-disable-next-line
        typeof (result.type as any).target === 'string'
      ) {
        // eslint-disable-next-line
        result.type = (result.type as any).target;
      }

      if (
        typeof result.type !== 'string' &&
        // eslint-disable-next-line
        typeof (result.type as any).target !== 'string'
      ) {
        const targetResult = await this.fromComponent(
          // eslint-disable-next-line
          (result.type as any).target,
          result.props
        );
        result.children.push(targetResult);
        result.type = targetResult.type;
      }

      return result;
    } else {
      // eslint-disable-next-line
      const result = await this.fromComponent(child.type as any, child.props);
      return result;
    }
  }
}
