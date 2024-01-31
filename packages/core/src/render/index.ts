/* eslint-disable no-undef */
import { JSXMailVirtualDOM } from '..';
import factory from '../jsx-runtime/factory';
import CoreError from '../utils/error';
import {
  clearModuleFromCache,
  exists,
  getTemplateFolder,
  isDirectory,
  joinPath,
} from '../utils/file-system';
import {
  cleanAllGlobalVariables,
  insertGlobalVariableItem,
} from '../utils/global';
import handleErrors from '../utils/handle-errors';
import handleImagesImport from '../utils/handle-images-import';

handleImagesImport();

type renderInputType = {
  template: string;
  builtDirPath: string;
  props?: any;
  useMock?: boolean;
};

export default async function render({
  template,
  builtDirPath,
  props,
  useMock,
}: renderInputType) {
  try {
    insertGlobalVariableItem('state', {
      id: 'render',
    });

    const builtDirPathExists = await exists(builtDirPath);

    if (!builtDirPathExists) {
      throw new CoreError('no_built_dir', {
        builtDirPath,
      });
    }

    const isBuiltDirPathDirectory = await isDirectory(builtDirPath);

    if (!isBuiltDirPathDirectory) {
      throw new CoreError('built_dir_is_not_directory', {
        builtDirPath,
      });
    }

    const { virtualDOM } = await getVirtualDOM(
      template,
      builtDirPath,
      props,
      useMock,
    );

    const templateHTML = convertToHTML(virtualDOM);

    cleanAllGlobalVariables();

    return {
      code: `<!DOCTYPE html>\n${templateHTML}`,
    };
  } catch (error) {
    handleErrors(error);
  }
}

function convertToHTML(virtualDOM: JSXMailVirtualDOM | JSXMailVirtualDOM[]) {
  let html = '';

  if (Array.isArray(virtualDOM)) {
    for (const virtualD of virtualDOM) {
      html += convertToHTML(virtualD);
    }

    return html;
  }

  const { node, props, children } = virtualDOM;

  const childrenHTML: string = children
    .map((childItem) => {
      const child: JSXMailVirtualDOM | JSXMailVirtualDOM[] = childItem as any;
      if (typeof child === 'undefined') {
        throw new CoreError('undefined_child');
      }

      if (Array.isArray(child) || child.__jsx_mail_vdom) {
        return convertToHTML(child);
      } else {
        return child;
      }
    })
    .join('');

  const propsHTML = Object.keys(props)
    .map((key) => {
      let value = props[key];

      if (typeof value === 'string' && value.startsWith('__jsx_default_')) {
        value = value.replace('__jsx_default_', '');
      }

      return ` ${key}="${value}"`;
    })
    .join('');

  html = `<${node}${propsHTML}`;

  if (childrenHTML) {
    html += `>${childrenHTML}</${node}>`;
  } else {
    html += ` />`;
  }

  return html;
}

async function getVirtualDOM(
  template: string,
  builtDirPath: string,
  props: any,
  useMock?: boolean,
) {
  const { templatePath, templateName } = await getTemplatePath(
    template,
    builtDirPath,
  );

  insertGlobalVariableItem('fileContext', {
    id: templatePath,
  });

  clearModuleFromCache(templatePath);
  const templateImport = require(templatePath);

  const component = templateImport.default;
  const onRender = templateImport.onRender;

  if (!component || typeof component !== 'function') {
    throw new CoreError('export_a_component_as_default', {
      template,
    });
  }

  let newProps = { ...props };

  if (useMock) {
    const defaultProps = templateImport.props;
    newProps = { ...defaultProps, ...newProps };
  }

  if (onRender) {
    try {
      const onRenderResult = await onRender(newProps);
      newProps = { ...newProps, ...onRenderResult };
    } catch (error) {
      throw new CoreError('on_render_error', {
        error,
        template,
      });
    }

    verifyProps(newProps);
  }

  let virtualDOM: JSXMailVirtualDOM;
  try {
    virtualDOM = component(newProps);
  } catch (error) {
    throw new CoreError('compilation_error', {
      template,
      error,
    });
  }

  if (virtualDOM instanceof Promise) {
    throw new CoreError('promise_not_allowed');
  }

  if (Array.isArray(virtualDOM) || virtualDOM.node !== 'html') {
    virtualDOM = await insertHTMLStructure(virtualDOM);
  }

  return {
    virtualDOM,
    templateName,
  };
}

function verifyProps(onRenderResult: any) {
  if (!onRenderResult || typeof onRenderResult !== 'object') {
    return;
  }

  if ('__jsx_mail_image' in onRenderResult) {
    throw new CoreError('on_image_as_props', onRenderResult);
  }

  for (let key in onRenderResult) {
    verifyProps(onRenderResult[key]);
  }
}

async function insertHTMLStructure(
  virtualDOM: JSXMailVirtualDOM | JSXMailVirtualDOM[],
): Promise<JSXMailVirtualDOM> {
  const headVirtualDOM: JSXMailVirtualDOM = factory(
    'head',
    {},
  ) as JSXMailVirtualDOM;

  const bodyVirtualDOM: JSXMailVirtualDOM = factory('body', {
    style: {
      margin: '0',
      padding: '0',
    },
    children: Array.isArray(virtualDOM) ? virtualDOM : [virtualDOM],
  }) as JSXMailVirtualDOM;

  const htmlVirtualDOM: JSXMailVirtualDOM = factory('html', {
    children: [headVirtualDOM, bodyVirtualDOM],
    lang: 'en',
  }) as JSXMailVirtualDOM;

  return htmlVirtualDOM;
}

async function getTemplatePath(template: string, builtDirPath: string) {
  const contexts = template.split(':');

  const templateName = contexts.pop();

  if (!templateName) {
    throw new CoreError('no_template_name');
  }

  const templateFolderPath = await getTemplateFolder(builtDirPath);

  if (!templateFolderPath) {
    throw new CoreError('no_template_folder', {
      builtDirPath,
    });
  }

  let templatePath = await joinPath(
    templateFolderPath,
    ...contexts,
    templateName,
  );

  const isTemplateDirectory = await isDirectory(templatePath);

  if (isTemplateDirectory) {
    templatePath = joinPath(templatePath, 'index.js');
  } else {
    if (!templatePath.endsWith('.js')) {
      templatePath += '.js';
    }
  }

  const existsTemplatePath = await exists(templatePath);

  if (!existsTemplatePath) {
    throw new CoreError('template_not_found', {
      templatePath,
    });
  }

  return {
    templatePath,
    templateName,
  };
}
