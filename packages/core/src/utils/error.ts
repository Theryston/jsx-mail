import { readGlobalVariable } from './global';
import WEBSITE_URL from './website-url';

interface IError {
  name: string;
  message: string;
  docsPageUrl: string;
  solutions?: string[];
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
  {
    name: 'fails_to_prepare_image',
    message: 'Error when optimizing or uploading image',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/fails-to-prepare-image`,
  },
  {
    name: 'aws_access_key_id_not_found',
    message: 'When using aws s3 storage, you must enter awsAccessKeyId',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/aws-access-key-id-not-found`,
  },
  {
    name: 'aws_secret_access_key_not_found',
    message: 'When using aws s3 storage, you must enter awsSecretAccessKey',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/aws-secret-access-key-not-found`,
  },
  {
    name: 'aws_bucket_not_found',
    message: 'When using aws s3 storage, you must enter awsBucket',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/aws-bucket-not-found`,
  },
  {
    name: 'aws_region_not_found',
    message: 'When using aws s3 storage, you must enter awsRegion',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/aws-region-not-found`,
  },
  {
    name: 'no_built_dir',
    message: 'You must to run the prepare command before the render',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/no-built-dir`,
  },
  {
    name: 'built_dir_is_not_directory',
    message: 'There is a problem with the builtDirPath you entered',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/built-dir-is-not-directory`,
  },
  {
    name: 'undefined_child',
    message: 'Some child is undefined. Please check your template',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/undefined-child`,
    solutions: [
      'Maybe you just forgot to return something in your onRender function',
      'Maybe you forgot to return something in your template function',
      'Maybe you forgot to pass a prop to the jsx mail render function',
      'Maybe you forgot to pass a prop to a component',
    ],
  },
  {
    name: 'template_not_found',
    message: 'Template not found',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/template-not-found`,
    solutions: [
      'Maybe you did not create a template with the name you passed',
      'Maybe you did not run the prepare command after creating the template',
    ],
  },
  {
    name: 'font_invalid_href',
    message:
      'You must pass a valid href to the font tag. It must be a string that starts with http',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/font-invalid-href`,
  },
];

export default class CoreError implements IError {
  message: string;
  name: string;
  docsPageUrl: string;
  solutions?: string[];
  fileContext?: string;
  customJson?: any;

  constructor(name: string, customJson?: any) {
    const hasAnotherError = getCoreErrorIntoCustomJson(customJson);

    if (hasAnotherError) {
      this.message = hasAnotherError.message;
      this.name = hasAnotherError.name;
      this.docsPageUrl = hasAnotherError.docsPageUrl;
      this.solutions = hasAnotherError.solutions;
      this.customJson = hasAnotherError.customJson;
      this.fileContext = hasAnotherError.fileContext;
      return;
    }

    let errorCustom = ERRORS.find((e) => e.name === name);

    const error: IError = (errorCustom ? errorCustom : ERRORS[0]) as IError;

    this.message = error.message;
    this.name = error.name;
    this.docsPageUrl = error.docsPageUrl;
    this.customJson = customJson;

    if (error.solutions) {
      this.solutions = error.solutions;
    }

    const globalFileContext = readGlobalVariable('fileContext');

    if (globalFileContext) {
      this.fileContext = globalFileContext[globalFileContext.length - 1]?.id;
    }
  }
}

export const getCoreErrorIntoCustomJson = (
  customJson?: any,
): CoreError | null => {
  if (!customJson) return null;

  if (customJson instanceof CoreError) return customJson;

  if (customJson.customJson)
    return getCoreErrorIntoCustomJson(customJson.customJson);

  return null;
};
