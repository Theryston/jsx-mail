import CoreError from './error';

export default function handleErrors(error: any) {
  let newError;
  if (error instanceof CoreError) {
    newError = error;
  } else {
    newError = new CoreError('unknown', {
      ...(error.message ? { errorMessage: error.message } : {}),
      ...error,
    });
  }

  throw newError;
}
