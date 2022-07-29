import { IComponentJson, IComponentJsonRender } from './IComponentJsonRender';

export class ComponentJsonRender implements IComponentJsonRender {
  async fromComponent(
    componentFunction: (...props: any) => React.ReactElement,
    props: any,
  ): Promise<IComponentJson> {
    let response: IComponentJson = {
      type: '',
      children: [],
      props: {},
    };

    const result = await componentFunction(props);

    if (Array.isArray(result.props['children'])) {
      for (let child of result.props['children']) {
        response.children.push(await this.handleChild(child));
      }
    } else {
      response.children = [await this.handleChild(result.props['children'])];
    }

    response.props = { ...result.props };

    if ((result.type as any).componentStyle) {
      const styleResult = await this.handleStyle(result);
      Object.keys(response.props).forEach(propKey => {
        if (styleResult.usedProps.includes(propKey)) {
          delete response.props[propKey];
        }
      });
      response.styles = styleResult.styleArr;
      response.type = (result.type as any).target;
    } else {
      response.type = result.type as string;
    }

    if (response.props.children) {
      delete response.props.children;
    }

    return response;
  }

  async handleStyle(
    component: React.ReactElement<
      any,
      string | React.JSXElementConstructor<any>
    >,
  ) {
    const usedProps: string[] = [];
    const styleString = (component.type as any).componentStyle.rules
      .map(rule => {
        if (typeof rule === 'string') {
          return rule;
        } else {
          const propValue = rule(component.props);
          Object.keys(component.props).forEach(propKey => {
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
      .filter(s => s.length > 0)
      .map(style => {
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

  async handleChild(child: any) {
    if (!child['$$typeof']) {
      return child;
    } else if (typeof child.type !== 'function') {
      let children = [];
      const props = { ...child.props };
      delete props.children;

      if (child.props.children) {
        if (Array.isArray(child.props.children)) {
          for (let c of child.props.children) {
            children.push(await this.handleChild(c));
          }
        } else {
          children.push(await this.handleChild(child.props.children));
        }
      }

      const result = {
        type: child.type as string,
        children: children,
        props,
      };

      if (typeof result.type !== 'string') {
        result.type = (result.type as any).target;
      }

      return result;
    } else {
      const result = await this.fromComponent(child.type as any, child.props);
      return result;
    }
  }
}
