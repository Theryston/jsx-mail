interface IError {
  name: string;
  message: string;
  docsPageUrl: string
}

const WEBSITE_URL = 'https://jsxmail.org'

export const ERRORS: IError[] = [
  {
    name: 'unknown',
    message: 'This is an unknown error, please open an issue at https://github.com/Theryston/jsx-mail/issues reporting the entire process and its flow until reaching this error',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/unknown`
  },
  {
    name: 'no_template_folder',
    message: 'You should create a folder called `templates` in your email application, create a .tsx/.jsx file in the `templates` folder and export some component as default',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/no-template-folder`
  },
  {
    name: 'no_tsx_or_jsx_files',
    message: 'I didn\'t find any file with the extension .tsx/.jsx in your mail app, please create one and export a component as default',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/no-tsx-or-jsx-files`
  },
  {
    name: 'compilation_error',
    message: 'There was an error trying to compile your mail app',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/compilation-error`
  },
  {
    name: 'export_a_component_as_default',
    message: 'You must export by default a function that returns a jsx component',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/export-a-component-as-default`
  },
  {
    name: 'fails_to_run_template_in_prepare',
    message: 'The prepare process tried to run your template, but received an error',
    docsPageUrl: `${WEBSITE_URL}/docs/errors/fails-to-run-template-in-prepare`
  }
]

export default class CoreError implements IError {
  message: string;
  name: string;
  docsPageUrl: string;
  customJson?: any;

  constructor(name: string, customJson?: any) {
    let errorCustom = ERRORS.find(e => e.name === name)

    const error: IError = (errorCustom ? errorCustom : ERRORS[0]) as IError

    this.message = error.message
    this.name = error.name
    this.docsPageUrl = error.docsPageUrl
    this.customJson = customJson
  }
}