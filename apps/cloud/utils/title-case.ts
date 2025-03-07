export function titleCase(str: string): string {
  return (str || '')
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (word.length < 3) return word;

      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(' ');
}
