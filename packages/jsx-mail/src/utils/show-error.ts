import { print } from 'gluegun';

const BREAK_TWO_LINES = '\n\n';
const BREAK_ONE_LINE = '\n';

export function showError(object: any) {
  function formatObject(obj: any, indent: string = ''): string {
    let result = '';

    if (typeof obj === 'string') {
      return `${indent}${print.colors.error(obj)}${BREAK_TWO_LINES}`;
    }

    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (!Array.isArray(value) && typeof value === 'object') {
          result += `${indent}${handleKeyCollor(
            key,
          )}:${BREAK_TWO_LINES}${formatObject(
            value,
            indent + '  ',
          )}${BREAK_TWO_LINES}`;
        } else if (Array.isArray(value)) {
          result += `${indent}${handleKeyCollor(
            key,
          )}:${BREAK_ONE_LINE}${formatArray(
            value,
            indent + '  ',
          )}${BREAK_TWO_LINES}`;
        } else {
          result += `${indent}${handleKeyCollor(
            key,
          )}: ${value}${BREAK_TWO_LINES}`;
        }
      }
    }
    return result;
  }

  function handleKeyCollor(key: string) {
    if (key === 'solution' || key === 'solutions') {
      return print.colors.green(key);
    }

    if (typeof key === 'number') {
      return print.colors.yellow(key);
    }

    if (key === 'site') {
      return print.colors.cyan(key);
    }

    return print.colors.error(key);
  }

  function formatArray(arr: any[], indent: string = ''): string {
    let result = '';
    for (let index = 0; index < arr.length; index++) {
      const value = arr[index];
      if (typeof value === 'object') {
        result += `${indent}- ${formatObject(
          value,
          indent + '  ',
        )}${BREAK_TWO_LINES}`;
      } else if (Array.isArray(value)) {
        result += `${indent}- ${formatArray(
          value,
          indent + '  ',
        )}${BREAK_TWO_LINES}`;
      } else {
        result += `${indent}- ${value}${BREAK_ONE_LINE}`;
      }
    }
    return result;
  }

  const formattedObject = formatObject(object);
  print.info(formattedObject);
}
