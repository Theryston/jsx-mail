import { Runtime } from '../runtime/runtime';
import { Command } from './command';
import { Options } from './options';
import { Plugin } from './plugin';
import { GluegunFilesystem, GluegunStrings, GluegunPrint, GluegunSystem, GluegunSemver, GluegunHttp, GluegunPatching, GluegunPrompt, GluegunTemplate, GluegunMeta, GluegunPackageManager } from '..';
export interface GluegunParameters {
    array?: string[];
    /**
     * Any optional parameters. Typically coming from command-line
     * arguments like this: `--force -p tsconfig.json`.
     */
    options: Options;
    first?: string;
    second?: string;
    third?: string;
    string?: string;
    raw?: any;
    argv?: any;
    plugin?: string;
    command?: string;
}
export interface GluegunEmptyToolbox {
    [key: string]: any;
}
export interface GluegunToolbox extends GluegunEmptyToolbox {
    config: Options;
    result?: any;
    parameters: GluegunParameters;
    plugin?: Plugin;
    command?: Command;
    pluginName?: string;
    commandName?: string;
    runtime?: Runtime;
    filesystem: GluegunFilesystem;
    http: GluegunHttp;
    meta: GluegunMeta;
    patching: GluegunPatching;
    print: GluegunPrint;
    prompt: GluegunPrompt;
    semver: GluegunSemver;
    strings: GluegunStrings;
    system: GluegunSystem;
    template: GluegunTemplate;
    generate: any;
    packageManager: GluegunPackageManager;
}
export declare class EmptyToolbox implements GluegunEmptyToolbox {
    [x: string]: any;
    config: Options & {
        loadConfig?: (name: string, src: string) => Options;
    };
    result?: any;
    parameters?: GluegunParameters;
    plugin?: Plugin;
    command?: Command;
    pluginName?: string;
    commandName?: string;
    runtime?: Runtime;
    filesystem?: GluegunFilesystem;
    http?: GluegunHttp;
    meta?: GluegunMeta;
    patching?: GluegunPatching;
    print?: GluegunPrint;
    prompt?: GluegunPrompt;
    semver?: GluegunSemver;
    strings?: GluegunStrings;
    system?: GluegunSystem;
    template?: GluegunTemplate;
    generate?: any;
}
export declare class Toolbox extends EmptyToolbox implements GluegunToolbox {
    config: Options;
    parameters: GluegunParameters;
    filesystem: GluegunFilesystem;
    http: GluegunHttp;
    meta: GluegunMeta;
    patching: GluegunPatching;
    print: GluegunPrint;
    prompt: GluegunPrompt;
    semver: GluegunSemver;
    strings: GluegunStrings;
    system: GluegunSystem;
    template: GluegunTemplate;
    generate: any;
    packageManager: GluegunPackageManager;
}
export declare type GluegunRunContext = GluegunToolbox;
export declare type RunContext = Toolbox;
