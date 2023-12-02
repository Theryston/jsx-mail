import prepare from './prepare';
import render from './render';
import { jsx } from './jsx-runtime';
import cleanCache from './clean-cache';
import { getAllTemplates, getBuiltPath } from './utils/file-system';

const core = {
  render,
  prepare,
  jsx,
  getAllTemplates,
  getBuiltPath,
  cleanCache,
};

export type ImageInfo = {
  path: string;
  url: string;
  status: 'pending_upload' | 'uploaded' | 'error';
  error?: any;
  hash: string;
};

export type JSXMailVirtualDOM = {
  node: string;
  props: any;
  children: (JSXMailVirtualDOM | string | number)[];
  __jsx_mail_vdom: boolean;
};

export default core;
