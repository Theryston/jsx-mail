import CoreError from './error';

export default function handleErrors(error: unknown) {
  let newError;
  if (error instanceof CoreError) {
    newError = error;
  } else {
    newError = new CoreError('unknown');
  }

  throw newError;
}
