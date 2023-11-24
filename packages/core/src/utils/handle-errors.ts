import CoreError from "./error";

export default function handleErrors(error: unknown, log?: boolean, load?: any) {
  let newError;
  if (error instanceof CoreError) {
    newError = error;
  } else {
    newError = new CoreError('unknown');
  }

  if (log) {
    load.fail(newError.message)
  }

  throw newError;
}