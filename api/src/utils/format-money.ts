import {
  BANDWIDTH_GB_PRICE,
  CURRENCY,
  MONEY_SCALE,
  STORAGE_GB_PRICE,
} from './contants';

export function friendlyMoney(amount: number, showAllDecimals = false) {
  const moneyInScale = amount ? amount / MONEY_SCALE : 0;
  let decimalCount = moneyInScale.toString().split('.')[1]?.length;

  if (!decimalCount || decimalCount < 2) {
    decimalCount = 2;
  }

  return moneyInScale.toLocaleString('en-US', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: showAllDecimals ? decimalCount : 2,
  });
}

export function storageToMoney(bytes: number) {
  const sizeGb = bytes / (1024 * 1024 * 1024);
  return Math.round(sizeGb * STORAGE_GB_PRICE);
}

export function bandwidthToMoney(bytes: number) {
  const sizeGb = bytes / (1024 * 1024 * 1024);
  return Math.round(sizeGb * BANDWIDTH_GB_PRICE);
}
