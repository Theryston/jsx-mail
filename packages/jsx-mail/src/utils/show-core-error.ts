import { showError } from './show-error';

export default function showCoreError(error: any) {
  const isForbidden = error.customJson?.isForbidden || false;

  if (isForbidden) {
    showError({
      message: `Type 'jsxm login' or change the 'storage' property to 'LOCAL' in your jsx-mail.config.js file`,
    });
    return;
  }

  showError({
    ...(error.name ? { name: error.name } : {}),
    message: error.message,
    ...(error.customJson ? error.customJson : {}),
    ...(error.solutions ? { solutions: error.solutions } : {}),
  });
}
