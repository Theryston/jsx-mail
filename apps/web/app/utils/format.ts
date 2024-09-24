export function formatSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

export function formatNumber(num: number) {
  if (num < 1000) {
    return num.toString();
  } else if (num >= 1000 && num < 1_000_000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K';
  } else if (num >= 1_000_000 && num < 1_000_000_000) {
    return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  } else if (num >= 1_000_000_000 && num < 1_000_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
  } else {
    return (num / 1_000_000_000_000).toFixed(1).replace('.0', '') + 'T';
  }
}
