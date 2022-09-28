import { Command } from './command';
import { Extension } from './extension';
import { Options } from './options';
/**
 * Extends the environment with new commands.
 */
export declare class Plugin {
    /** The name of the plugin. */
    name?: string;
    /** A description used in the cli. */
    description?: string;
    /** Default configuration values. */
    defaults: Options;
    /** The directory this plugin lives in. */
    directory?: string;
    /** Should we hide this command from the cli? */
    hidden: boolean;
    /** The commands in this plugin. */
    commands: Command[];
    /** The extensions in this plugin. */
    extensions: Extension[];
    constructor();
}
