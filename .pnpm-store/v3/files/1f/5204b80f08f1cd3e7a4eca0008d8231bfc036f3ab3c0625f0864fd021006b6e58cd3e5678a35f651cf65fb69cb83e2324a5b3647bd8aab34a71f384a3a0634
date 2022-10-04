import { PromptOptions, Choice } from './prompt-enquirer-types';
declare const Enquirer: any;
export declare type GluegunEnquirer = typeof Enquirer;
export declare const GluegunEnquirer: any;
export interface GluegunAskResponse {
    [key: string]: string;
}
export interface GluegunPrompt {
    confirm(message: string, initial?: boolean): Promise<boolean>;
    ask<T = GluegunAskResponse>(questions: PromptOptions | ((this: GluegunEnquirer) => PromptOptions) | (PromptOptions | ((this: GluegunEnquirer) => PromptOptions))[]): Promise<T>;
    separator(): string;
}
export declare type GluegunQuestionChoices = Choice;
export declare type GluegunQuestionType = PromptOptions;
export {};
