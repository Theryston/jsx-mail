import { print } from 'gluegun';

const BREAK_LINE = '\n\n';

export function showError(object: any) {
  function formatObject(obj: any, indent: string = ''): string {
    let result = '';

    if (typeof obj === 'string') {
      return `${indent}${print.colors.error(obj)}${BREAK_LINE}`;
    }

    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object') {
          result += `${indent}${handleKeyCollor(
            key,
          )}:${BREAK_LINE}${formatObject(value, indent + '  ')}${BREAK_LINE}`;
        } else if (Array.isArray(value)) {
          result += `${indent}${handleKeyCollor(
            key,
          )}:${BREAK_LINE}${formatArray(value, indent + '  ')}${BREAK_LINE}`;
        } else {
          result += `${indent}${handleKeyCollor(key)}: ${value}${BREAK_LINE}`;
        }
      }
    }
    return result;
  }

  function handleKeyCollor(key: string) {
    if (key === 'solution') {
      return print.colors.green(key);
    }

    if (key === 'site') {
      return print.colors.cyan(key);
    }

    return print.colors.error(key);
  }

  function formatArray(arr: any[], indent: string = ''): string {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i];
      if (typeof value === 'object') {
        result += `${indent}- ${formatObject(
          value,
          indent + '  ',
        )}${BREAK_LINE}`;
      } else if (Array.isArray(value)) {
        result += `${indent}- ${formatArray(
          value,
          indent + '  ',
        )}${BREAK_LINE}`;
      } else {
        result += `${indent}- ${value}${BREAK_LINE}`;
      }
    }
    return result;
  }

  const formattedObject = formatObject(object);
  print.info('');
  print.info(formattedObject);
}
