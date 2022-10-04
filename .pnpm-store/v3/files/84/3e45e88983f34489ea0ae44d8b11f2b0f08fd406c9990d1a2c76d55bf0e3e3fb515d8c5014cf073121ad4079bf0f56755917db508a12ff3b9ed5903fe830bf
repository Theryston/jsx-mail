import { Runtime } from '../runtime/runtime';
import { GluegunCommand } from './command';
import { GluegunLoadOptions, GluegunMultiLoadOptions } from './options';
/**
 * Provides a cleaner way to build a runtime.
 *
 * @class Builder
 */
export declare class Builder {
    private data;
    constructor(brand?: string);
    /**
     * Ideally named after the command line, the brand will be used
     * when searching for configuration files.
     *
     * @param name The name should be all lowercase and contains only numbers, letters, and dashes.
     */
    brand(value: string): Builder;
    /**
     * Excludes core libraries if they're not needed, for performance reasons.
     */
    exclude(excludes: string[]): this;
    /**
     * Specifies where the default commands and extensions live.
     *
     * @param value The path to the source directory.
     * @param options Additional plugin loading options.
     * @return self.
     */
    src(value: string, options?: GluegunLoadOptions): Builder;
    /**
     * Add a plugin to the list.
     *
     * @param value   The plugin directory.
     * @param options Additional loading options.
     * @return self.
     */
    plugin(value: string, options?: GluegunLoadOptions): Builder;
    /**
     * Add a plugin group to the list.
     *
     * @param value   The directory with sub-directories.
     * @param options Additional loading options.
     * @return self.
     */
    plugins(value: string, options?: GluegunLoadOptions & GluegunMultiLoadOptions): Builder;
    /**
     * Add a default help handler.
     * @param command An optional command function or object
     * @return self.
     */
    help(command?: any): Builder;
    /**
     * Add a default version handler.
     * @param command An optional command function or object
     * @return self.
     */
    version(command?: any): Builder;
    /**
     * Add a default command that runs if none other is found.
     * @param command An optional command function or object
     * @return self.
     */
    defaultCommand(command?: any): Builder;
    /**
     * Add a way to add an arbitrary command when building the CLI.
     * @param command command to add
     * @return self.
     */
    command(command: GluegunCommand): Builder;
    /**
     * Check for updates randomly.
     *
     * @param frequency % frequency of checking
     * @return self.
     */
    checkForUpdates(frequency: number): Builder;
    /**
     * Hand over the runtime.
     */
    create(): Runtime;
}
/**
 * Export it as a factory function.
 */
export declare function build(brand?: string): Builder;
