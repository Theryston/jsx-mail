/// <reference types="node" />
/// <reference types="handlebars" />
import type { UnknownObject, FunctionObject, ConfigOptions, Engine, TemplateSpecificationObject, TemplateDelegateObject, FsCache, PartialTemplateOptions, PartialsDirObject, RenderOptions, RenderViewOptions, RenderCallback, HandlebarsImport, CompiledCache, PrecompiledCache } from "../types";
export default class ExpressHandlebars {
    config: ConfigOptions;
    engine: Engine;
    encoding: BufferEncoding;
    layoutsDir: string;
    extname: string;
    compiled: CompiledCache;
    precompiled: PrecompiledCache;
    _fsCache: FsCache;
    partialsDir: string | PartialsDirObject | (string | PartialsDirObject)[];
    compilerOptions: CompileOptions;
    runtimeOptions: RuntimeOptions;
    helpers: FunctionObject;
    defaultLayout: string;
    handlebars: HandlebarsImport;
    constructor(config?: ConfigOptions);
    getPartials(options?: PartialTemplateOptions): Promise<TemplateSpecificationObject | TemplateDelegateObject>;
    getTemplate(filePath: string, options?: PartialTemplateOptions): Promise<HandlebarsTemplateDelegate | TemplateSpecification>;
    getTemplates(dirPath: string, options?: PartialTemplateOptions): Promise<HandlebarsTemplateDelegate | TemplateSpecification>;
    render(filePath: string, context?: UnknownObject, options?: RenderOptions): Promise<string>;
    renderView(viewPath: string): Promise<string>;
    renderView(viewPath: string, options: RenderViewOptions): Promise<string>;
    renderView(viewPath: string, callback: RenderCallback): Promise<null>;
    renderView(viewPath: string, options: RenderViewOptions, callback: RenderCallback): Promise<null>;
    protected _compileTemplate(template: string, options?: RuntimeOptions): HandlebarsTemplateDelegate;
    protected _precompileTemplate(template: string, options?: RuntimeOptions): TemplateSpecification;
    protected _renderTemplate(template: HandlebarsTemplateDelegate, context?: UnknownObject, options?: RuntimeOptions): string;
    private _getDir;
    private _getFile;
    private _getTemplateName;
    private _resolveViewsPath;
    private _resolveLayoutPath;
}
