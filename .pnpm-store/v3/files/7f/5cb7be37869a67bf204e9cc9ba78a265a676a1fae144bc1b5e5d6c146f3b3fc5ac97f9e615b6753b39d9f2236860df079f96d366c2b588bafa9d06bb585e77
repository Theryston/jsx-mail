import { GluegunToolbox } from '../domain/toolbox';
import { PackageJSON, AbortSignals } from './meta-types';
/**
 * Finds the currently running CLI package.json
 *
 * @param toolbox
 * @returns Package.json contents as an object.
 */
export declare function getPackageJSON(toolbox: GluegunToolbox): PackageJSON;
/**
 * Finds the version for the currently running CLI.
 *
 * @param toolbox Currently running toolbox.
 * @returns Version as a string.
 */
export declare function getVersion(toolbox: GluegunToolbox): string;
/**
 * Gets the list of plugins.
 *
 * @param toolbox The toolbox
 * @param plugins The plugins holding the commands
 * @param commandRoot Optional, only show commands with this root
 * @return List of plugins.
 */
export declare function commandInfo(toolbox: GluegunToolbox, commandRoot?: string[]): string[][];
export declare function checkForUpdate(toolbox: GluegunToolbox): Promise<false | string>;
/**
 * Executes the given callback when a termination signal is received.
 * If callback returns a promise, it will wait for promise to resolve before aborting.
 *
 * @param callback Callback function for handling process termination
 */
export declare function onAbort(callback: (signal: AbortSignals) => void | Promise<void>): void;
