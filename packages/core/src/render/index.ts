import { JSXMailVirtualDOM } from '..';
import factory from '../jsx-runtime/factory';
import CoreError from '../utils/error';
import {
  exists,
  getFileUrl,
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
};

export default async function render({
  template,
  builtDirPath,
  props,
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

    const { virtualDOM } = await getVirtualDOM(template, builtDirPath, props);

    const templateHTML = convertToHTML(virtualDOM);

    cleanAllGlobalVariables();

    return {
      code: `<!DOCTYPE html>\n${templateHTML}`,
    };
  } catch (error) {
    handleErrors(error);
  }
}

function convertToHTML(virtualDOM: JSXMailVirtualDOM) {
  const { node, props, children } = virtualDOM;

  const childrenHTML: string = children
    .map((child) => {
      if (!child) {
        throw new CoreError('undefined_child');
      }

      if ((child as JSXMailVirtualDOM).__jsx_mail_vdom) {
        return convertToHTML(child as JSXMailVirtualDOM);
      } else {
        return child;
      }
    })
    .join('');

  const propsHTML = Object.keys(props)
    .map((key) => ` ${key}="${props[key]}"`)
    .join('');

  let html = `<${node}${propsHTML}`;

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
) {
  const { templatePath, templateName } = await getTemplatePath(
    template,
    builtDirPath,
  );

  insertGlobalVariableItem('fileContext', {
    id: templatePath,
  });

  const templateFileUrl = await getFileUrl(templatePath);

  const { default: templateImport } = await import(templateFileUrl);

  const component = templateImport.default;
  const onRender = templateImport.onRender;

  if (!component || typeof component !== 'function') {
    throw new CoreError('export_a_component_as_default', {
      template,
    });
  }

  let newProps = { ...props };

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

  if (virtualDOM.node !== 'html') {
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
  virtualDOM: JSXMailVirtualDOM,
): Promise<JSXMailVirtualDOM> {
  const headVirtualDOM = factory('head', {});
  const bodyVirtualDOM = factory('body', {
    style: {
      margin: '0',
      padding: '0',
    },
    children: [virtualDOM as any],
  });
  const htmlVirtualDOM = factory('html', {
    children: [headVirtualDOM as any, bodyVirtualDOM as any],
    lang: 'en',
  });

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
