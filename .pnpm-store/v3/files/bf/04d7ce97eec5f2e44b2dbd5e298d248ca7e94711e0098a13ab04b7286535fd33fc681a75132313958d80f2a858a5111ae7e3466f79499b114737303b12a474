import { GluegunToolbox } from '../index';
import * as CLITable from 'cli-table3';
import * as importedColors from 'colors';
import { Toolbox } from '../domain/toolbox';
import ora = require('ora');
export declare type GluegunPrintColors = typeof importedColors & {
    highlight: (t: string) => string;
    info: (t: string) => string;
    warning: (t: string) => string;
    success: (t: string) => string;
    error: (t: string) => string;
    line: (t: string) => string;
    muted: (t: string) => string;
};
export declare type TableStyle = Partial<CLITable.TableInstanceOptions['style']>;
export interface GluegunPrintTableOptions {
    format?: 'markdown' | 'lean' | 'default';
    style?: TableStyle;
}
export interface GluegunPrint {
    colors: GluegunPrintColors;
    checkmark: string;
    xmark: string;
    info: (message: any) => void;
    warning: (message: any) => void;
    success: (message: any) => void;
    highlight: (message: any) => void;
    muted: (message: any) => void;
    error: (message: any) => void;
    debug: (value: any, title?: string) => void;
    fancy: (value: string) => void;
    divider: () => void;
    findWidths: (cliTable: CLITable) => number[];
    columnHeaderDivider: (cliTable: CLITable, style: TableStyle) => string[];
    newline: () => void;
    table: (data: string[][], options?: GluegunPrintTableOptions) => void;
    spin(options?: ora.Options | string): ora.Ora;
    printCommands(toolbox: Toolbox, commandRoot?: string[]): void;
    printHelp(toolbox: GluegunToolbox): void;
}
