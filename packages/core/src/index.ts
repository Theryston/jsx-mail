import prepare from './prepare';
import render from './render';
import { jsx } from './jsx-runtime';
import cleanCache from './clean-cache';
import {
  getAllTemplates,
  getBuiltPath,
  getBaseCorePath,
} from './utils/file-system';
import client from './cloud/client';
import { getToken } from './cloud/get-token';
import { setToken } from './cloud/set-token';
import { API_URL, WEBSITE_URL } from './utils/cloud';
import { logout } from './cloud/logout';

const core = {
  render,
  prepare,
  jsx,
  getAllTemplates,
  getBuiltPath,
  getBaseCorePath,
  cleanCache,
  cloudClient: client,
  getToken,
  setToken,
  logout,
  WEBSITE_URL,
  API_URL
};

export type ImageInfo = {
  path: string;
  url: string;
  status: 'pending_upload' | 'uploaded' | 'error';
  error?: any;
  hash: string;
};

export type ChildrenJSXMailVirtualDOM = JSXMailVirtualDOM | string | number;

export type JSXMailVirtualDOM = {
  node: string;
  props: any;
  children: ChildrenJSXMailVirtualDOM[];
  __jsx_mail_vdom: boolean;
};

export default core;
