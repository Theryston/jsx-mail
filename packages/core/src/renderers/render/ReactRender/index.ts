import { ServerStyleSheet } from 'styled-components';
import { renderToStaticMarkup } from 'react-dom/server';

export class ReactRender {
  sheet: ServerStyleSheet;

  constructor(
    // eslint-disable-next-line
    private inicialCode: (props?: any) => JSX.Element,
    // eslint-disable-next-line
    private variables?: any
  ) {
    this.sheet = new ServerStyleSheet();
  }

  async run(): Promise<{
    htmlCode: string;
    styleTag: string;
  }> {
    const code = this.sheet.collectStyles(this.inicialCode(this.variables));
    const htmlCode = renderToStaticMarkup(code);
    const styleTag = this.sheet.getStyleTags();
    return {
      htmlCode,
      styleTag,
    };
  }
}
