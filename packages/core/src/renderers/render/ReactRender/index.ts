import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';

export class ReactRender {
  sheet: ServerStyleSheet;

  constructor(
    private inicialCode: (props?: any) => JSX.Element,
    private variables?: any
  ) {
    this.sheet = new ServerStyleSheet();
  }

  async run(): Promise<{
    htmlCode: string;
    styleTag: string;
  }> {
    const code = this.sheet.collectStyles(this.inicialCode(this.variables));
    const htmlCode = renderToString(code);
    const styleTag = this.sheet.getStyleTags();
    return {
      htmlCode,
      styleTag,
    };
  }
}
