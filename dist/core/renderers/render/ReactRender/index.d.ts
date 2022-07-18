/// <reference types="react" />
import { ServerStyleSheet } from 'styled-components';
export declare class ReactRender {
    private inicialCode;
    private variables?;
    sheet: ServerStyleSheet;
    constructor(inicialCode: (props?: any) => JSX.Element, variables?: any);
    run(): Promise<{
        htmlCode: string;
        styleTag: string;
    }>;
}
