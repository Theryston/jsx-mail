import { JSXMailVirtualDOM } from '..';
import CoreError from '../utils/error';
import {
  getFileUrl,
  getTemplateFolder,
  isDirectory,
  joinPath,
} from '../utils/file-system';
import handleErrors from '../utils/handle-errors';

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
    const { virtualDOM } = await getVirtualDOM(template, builtDirPath, props);

    const templateHTML = convertToHTML(virtualDOM);

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

  return `<${node}${propsHTML}>${childrenHTML}</${node}>`;
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
  }

  let virtualDOM;
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

  return {
    virtualDOM,
    templateName,
  };
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
    templatePath = await joinPath(templatePath, 'index.js');
  }

  return {
    templatePath,
    templateName,
  };
}
