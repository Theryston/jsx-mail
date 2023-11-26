export default function camelToDash(str: string) {
  return str.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
}
