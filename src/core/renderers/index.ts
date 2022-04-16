import { BuildFileJSXToJS } from './geral/BuildFileJSXToJS';
import { MountDirectoryTree } from '../../utils/MountDirectoryTree';
import { GetContentFilesInDirectories } from '../../utils/GetContentFilesInDirectories';

import { IDirectoryTree, IFileContentTree } from '../../interfaces/IDirectory';
import { JSDOM } from 'jsdom';

const specialAttributes = {
  className: 'class',
};

function transformSpecialAttributes(attributes: { [key: string]: string }) {
  const newAttributes = { ...attributes };

  for (const attribute in specialAttributes) {
    if (newAttributes[attribute]) {
      newAttributes[specialAttributes[attribute]] = newAttributes[attribute];
      delete newAttributes[attribute];
    }
  }

  return newAttributes;
}

function render(
  nodeName: string,
  attributes: { [key: string]: string },
  ...args
): JSDOM {
  if (typeof nodeName === 'string') {
    return renderDefaultElement(nodeName, attributes, ...args);
  } else {
    return renderStyledComponentElement(nodeName, attributes, ...args);
  }
}

function renderStyledComponentElement(
  nodeName,
  attributes: { [key: string]: string },
  ...args
): JSDOM {
  const children = args.length ? [].concat(...args) : null;
  const dom = new JSDOM();
  let styleString = '';

  for (const rule of nodeName.componentStyle.rules) {
    if (typeof rule === 'string') {
      styleString += rule;
    } else {
      styleString += rule(attributes);
    }
  }

  const element = dom.window.document.createElement(nodeName.target);

  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(dom.window.document.createTextNode(child));
    } else {
      element.appendChild(child.window.document.body.firstChild);
    }
  }

  element.setAttribute('style', styleString);

  attributes = transformSpecialAttributes(attributes);

  for (const attribute in attributes) {
    if (attribute === 'style') {
      element.setAttribute(attribute, attributes[attribute] + styleString);
    } else {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }

  dom.window.document.body.appendChild(element);

  return dom;
}

function renderDefaultElement(
  nodeName: string,
  attributes: { [key: string]: string },
  ...args
): JSDOM {
  const children = args.length ? [].concat(...args) : null;

  const dom = new JSDOM();

  const element = dom.window.document.createElement(nodeName);

  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(dom.window.document.createTextNode(child));
    } else {
      element.appendChild(child.window.document.body);
    }
  }

  for (const attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }

  dom.window.document.body.appendChild(element);

  return dom;
}

export class App {
  private appPath: string;

  public appDirectoryTree: IDirectoryTree;

  private appFileContentTree: IFileContentTree;

  constructor(path: string) {
    this.appPath = path;
  }

  async build() {
    this.appDirectoryTree = await MountDirectoryTree.execute(this.appPath);
    this.appFileContentTree = await GetContentFilesInDirectories.execute(
      this.appDirectoryTree,
    );
    const data = await BuildFileJSXToJS.execute(this.appFileContentTree);
    const fileTestContent = data.folders[0].folders[0].files[0].fileJSXMail;
    const result = eval(fileTestContent);
    const dom = result() as JSDOM;
    console.log(dom.serialize());
  }
}
