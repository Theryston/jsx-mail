import { Toolbox } from './toolbox';
import { Plugin } from './plugin';
export interface GluegunCommand<TContext extends Toolbox = Toolbox> {
    /** The name of your command */
    name?: string;
    /** A tweet-sized summary of your command */
    description?: string;
    /** The function for running your command, can be async */
    run: (toolbox: TContext) => void;
    /** Should your command be shown in the listings  */
    hidden?: boolean;
    /** The command path, an array that describes how to get to this command */
    commandPath?: string[];
    /** Potential other names for this command */
    alias?: string | string[];
    /** Lets you run the command as a dashed command, like `--version` or `-v`. */
    dashed?: boolean;
    /** The path to the file name for this command. */
    file?: string;
    /** A reference to the plugin that contains this command. */
    plugin?: Plugin;
}
/**
 * A command is user-callable function that runs stuff.
 */
export declare class Command implements GluegunCommand<Toolbox> {
    name: any;
    description: any;
    file: any;
    run: any;
    hidden: any;
    commandPath: any;
    alias: any;
    dashed: any;
    plugin: any;
    constructor(props?: GluegunCommand);
    /**
     * Returns normalized list of aliases.
     *
     * @returns list of aliases.
     */
    get aliases(): string[];
    /**
     * Checks if the command has any aliases at all.
     *
     * @returns whether the command has any aliases
     */
    hasAlias(): boolean;
    /**
     * Checks if a given alias matches with this command's aliases, including name.
     * Can take a list of aliases too and check them all.
     *
     * @param alias
     * @returns whether the alias[es] matches
     */
    matchesAlias(alias: string | string[]): boolean;
}
