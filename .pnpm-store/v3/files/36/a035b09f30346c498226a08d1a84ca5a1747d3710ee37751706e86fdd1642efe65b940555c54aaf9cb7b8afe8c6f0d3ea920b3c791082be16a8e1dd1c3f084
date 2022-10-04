import { Command, GluegunCommand } from '../domain/command';
import { Extension } from '../domain/extension';
import { Plugin } from '../domain/plugin';
import { GluegunToolbox } from '../domain/toolbox';
import { Options, GluegunLoadOptions, GluegunMultiLoadOptions } from '../domain/options';
/**
 * Loads plugins, extensions, and invokes the intended command.
 */
export declare class Runtime {
    brand?: string;
    readonly plugins?: Plugin[];
    readonly extensions?: Extension[];
    readonly commands?: Command[];
    defaults: Options;
    defaultPlugin?: Plugin;
    defaultCommand?: Command;
    config: Options;
    checkUpdate: boolean;
    run: (rawCommand?: string | Options, extraOptions?: Options) => Promise<GluegunToolbox>;
    /**
     * Create and initialize an empty Runtime.
     */
    constructor(brand?: string);
    /**
     * Adds the core extensions.  These provide the basic features
     * available in gluegun, but follow a similar method
     * for extending the core as 3rd party extensions do.
     */
    addCoreExtensions(exclude?: string[]): void;
    /**
     * Adds a command to the runtime.
     *
     * @param command A GluegunCommand.
     * @returns This runtime.
     */
    addCommand(command: GluegunCommand): Runtime;
    /**
     * Adds an extension so it is available when commands run. They usually live
     * as the given name on the toolbox object passed to commands, but are able
     * to manipulate the toolbox object however they want. The second
     * parameter is a function that allows the extension to attach itself.
     *
     * @param name The toolbox property name.
     * @param setup The setup function.
     * @returns This runtime.
     */
    addExtension(name: string, setup: any): Runtime;
    /**
     * Loads a plugin from a directory and sets it as the default.
     *
     * @param directory The directory to load from.
     * @param options Additional loading options.
     * @returns This runtime.
     */
    addDefaultPlugin(directory: string, options?: GluegunLoadOptions): Runtime;
    /**
     * Loads a plugin from a directory.
     *
     * @param directory The directory to load from.
     * @param options Additional loading options.
     * @returns The plugin that was created or null.
     */
    addPlugin(directory: string, options?: GluegunLoadOptions): Plugin | null;
    /**
     * Loads a bunch of plugins from the immediate sub-directories of a directory.
     *
     * @param directory The directory to grab from.
     * @param options Addition loading options.
     * @return This runtime.
     */
    addPlugins(directory: string, options?: GluegunLoadOptions & GluegunMultiLoadOptions): Plugin[];
}
