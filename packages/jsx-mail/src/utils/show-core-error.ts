import { showError } from './show-error';

export default function showCoreError(error: any) {
  showError({
    ...(error.name ? { name: error.name } : {}),
    message: error.message,
    ...(error.customJson ? error.customJson : {}),
    ...(error.solutions ? { solutions: error.solutions } : {}),
  });
}
