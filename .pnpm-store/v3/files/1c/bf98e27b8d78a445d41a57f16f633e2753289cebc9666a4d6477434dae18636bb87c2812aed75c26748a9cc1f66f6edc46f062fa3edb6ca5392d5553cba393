import { GluegunPatchingPatchOptions, GluegunPatching } from './patching-types';
/**
 * Identifies if something exists in a file. Async.
 *
 * @param filename The path to the file we'll be scanning.
 * @param findPattern The case sensitive string or RegExp that identifies existence.
 * @return Boolean of success that findPattern was in file.
 */
export declare function exists(filename: string, findPattern: string | RegExp): Promise<boolean>;
/**
 * Updates a text file or json config file. Async.
 *
 * @param filename File to be modified.
 * @param callback Callback function for modifying the contents of the file.
 */
export declare function update(filename: string, callback: (contents: string | object) => string | object | false): Promise<string | object | false>;
/**
 * Convenience function for prepending a string to a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param prependedData  String to prepend
 */
export declare function prepend(filename: string, prependedData: string): Promise<string | false>;
/**
 * Convenience function for appending a string to a given file. Async.
 *
 * @param filename       File to be appended to
 * @param appendedData  String to append
 */
export declare function append(filename: string, appendedData: string): Promise<string | false>;
/**
 * Convenience function for replacing a string in a given file. Async.
 *
 * @param filename       File to be prepended to
 * @param oldContent     String to replace
 * @param newContent     String to write
 */
export declare function replace(filename: string, oldContent: string, newContent: string): Promise<string | false>;
/**
 * Conditionally places a string into a file before or after another string,
 * or replacing another string, or deletes a string. Async.
 *
 * @param filename        File to be patched
 * @param opts            Options
 * @param opts.insert     String to be inserted
 * @param opts.before     Insert before this string
 * @param opts.after      Insert after this string
 * @param opts.replace    Replace this string
 * @param opts.delete     Delete this string
 * @param opts.force      Write even if it already exists
 *
 * @example
 *   await toolbox.patching.patch('thing.js', { before: 'bar', insert: 'foo' })
 *
 */
export declare function patch(filename: string, ...opts: GluegunPatchingPatchOptions[]): Promise<string | false>;
export declare function readFile(filename: string): Promise<string>;
export declare function patchString(data: string, opts?: GluegunPatchingPatchOptions): string | false;
declare const patching: GluegunPatching;
export { patching, GluegunPatching, GluegunPatchingPatchOptions };
