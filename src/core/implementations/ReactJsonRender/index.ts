import { IReactJson, IReactJsonRender } from './IReactJsonRender';

export class ReactJsonRender implements IReactJsonRender {
  async fromComponent(
    componentFunction: (...props: any) => React.ReactElement,
    props: any,
  ): Promise<IReactJson> {
    let response: IReactJson = {
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
      response.children = await this.handleChild(result.props['children']);
    }

    response.props = { ...result.props };
    if (response.props.children) {
      delete response.props.children;
    }

    response.type = result.type as string;

    return response;
  }

  async handleChild(child: any) {
    if (!child['$$typeof']) {
      return child;
    } else {
      return await this.fromComponent(child.type as any, child.props);
    }
  }
}
