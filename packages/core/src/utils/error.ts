import WEBSITE_URL from './website-url';

interface IError {
  name: string;
  message: string;
  docsPageUrl: string;
}

export const ERRORS: IError[] = [
  {
    name: 'unknown',
    message:
      'This is an unknown error, please open an issue at https://github.com/Theryston/jsx-mail/issues reporting the entire process and its flow until reaching this error',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/unknown`,
  },
  {
    name: 'no_template_folder',
    message:
      'You should create a folder called `templates` in your email application, create a .tsx/.jsx file in the `templates` folder and export some component as default',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/no-template-folder`,
  },
  {
    name: 'compile_files',
    message:
      "I didn't find any file with the extension .tsx/.jsx/.js/.ts in your mail app, please create one and export a component as default",
    docsPageUrl: `${WEBSITE_URL}/docs/errors/no-tsx-or-jsx-files`,
  },
  {
    name: 'compilation_error',
    message: 'There was an error trying to compile the template',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/compilation-error`,
  },
  {
    name: 'export_a_component_as_default',
    message:
      'You must export by default a function that returns a jsx component',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/export-a-component-as-default`,
  },
  {
    name: 'fails_to_run_template_in_prepare',
    message:
      'The prepare process tried to run your template, but received an error',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/fails-to-run-template-in-prepare`,
  },
  {
    name: 'not_supported_tag',
    message:
      "You used a tag not supported by email clients so it doesn't exist in jsx mail",
    docsPageUrl: `${WEBSITE_URL}/docs/errors/not-supported-tag`,
  },
  {
    name: 'not_supported_style',
    message:
      'You used css which is not supported by some email clients so it is not implemented in JSX Mail',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/not-supported-style`,
  },
  {
    name: 'not_supported_style_value',
    message:
      'The value you used in your css is not supported by some email clients',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/not-supported-style-value`,
  },
  {
    name: 'promise_not_allowed',
    message:
      'No component can return a promise, please do all the asynchronous things you have to do directly in "onRender"',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/promise-not-allowed`,
  },
  {
    name: 'not_supported_props',
    message: 'You used props that are not supported by this tag',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/not-supported-props`,
  },
  {
    name: 'no_template_name',
    message: 'You must enter a template name',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/no-template-name`,
  },
  {
    name: 'on_render_error',
    message: 'Error when executing onRender function',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/on-render-error`,
  },
  {
    name: 'prop_align_not_supported',
    message: 'Only a div with props section can have props alignX and alignY',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/prop-align-not-supported`,
  },
  {
    name: 'prop_padding_not_supported',
    message: 'Only a div with props container can have prop padding',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/prop-padding-not-supported`,
  },
  {
    name: 'only_one_head_tag',
    message: 'You can only have one head tag per template',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/only-one-head-tag`,
  },
  {
    name: 'src_is_required',
    message: 'You must enter a src for the img tag',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/src-is-required`,
  },
  {
    name: 'alt_is_required',
    message: 'You must enter a alt for the img tag',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/alt-is-required`,
  },
  {
    name: 'image_not_found',
    message: 'The image you are trying to use was not found',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/image-not-found`,
  },
  {
    name: 'on_image_as_props',
    message:
      'You passed an image as props in your template, this is not allowed',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/on-image-as-props`,
  },
  {
    name: 'href_is_required',
    message:
      'You must enter a href for the a/button tag and it must be a string that starts with http',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/href-is-required`,
  },
  {
    name: 'invalid_h_tag',
    message: 'You used an invalid h tag. It must be h1, h2, h3, h4, h5 or h6',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/invalid-h-tag`,
  },
  {
    name: 'invalid_storage_type',
    message: 'Invalid storage type',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/invalid-storage-type`,
  },
  {
    name: 'invalid_file_type',
    message: 'Invalid file type',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/invalid-file-type`,
  },
  {
    name: 'upload_error',
    message: 'Error uploading image',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/upload-error`,
  },
];

export default class CoreError implements IError {
  message: string;
  name: string;
  docsPageUrl: string;
  customJson?: any;

  constructor(name: string, customJson?: any) {
    let errorCustom = ERRORS.find((e) => e.name === name);

    const error: IError = (errorCustom ? errorCustom : ERRORS[0]) as IError;

    this.message = error.message;
    this.name = error.name;
    this.docsPageUrl = error.docsPageUrl;
    this.customJson = customJson;
  }
}
