import { MONEY_SCALE, CURRENCY } from './constants';

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

export function storageToMoney(bytes: number, storageGbPrice: number) {
  const sizeGb = bytes / (1024 * 1024 * 1024);
  return Math.round(sizeGb * storageGbPrice);
}
