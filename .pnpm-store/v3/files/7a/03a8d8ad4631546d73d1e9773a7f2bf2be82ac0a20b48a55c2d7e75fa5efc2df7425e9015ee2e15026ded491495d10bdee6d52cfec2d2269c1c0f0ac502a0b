/**
 * A Webpack (5+) loader for MDX.
 * See `webpack.cjs`, which wraps this, because Webpack loaders must currently
 * be CommonJS.
 *
 * @this {LoaderContext}
 * @param {string} value
 * @param {(error: Error|null|undefined, content?: string|Buffer, map?: Object) => void} callback
 */
export function loader(this: LoaderContext, value: string, callback: (error: Error | null | undefined, content?: string | Buffer, map?: Object) => void): void;
export type VFileCompatible = import('vfile').VFileCompatible;
export type VFile = import('vfile').VFile;
export type CompileOptions = import('@mdx-js/mdx').CompileOptions;
export type Defaults = Pick<CompileOptions, 'SourceMapGenerator'>;
export type Options = Omit<CompileOptions, 'SourceMapGenerator'>;
export type LoaderContext = import('webpack').LoaderContext<unknown>;
export type WebpackCompiler = import('webpack').Compiler;
export type Process = (vfileCompatible: VFileCompatible) => Promise<VFile>;
