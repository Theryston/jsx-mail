import CoreError from "./error";

export default function handleErrors(error: unknown) {
  if (error instanceof CoreError) {
    throw error;
  } else {
    throw new CoreError('unknown');
  }
}