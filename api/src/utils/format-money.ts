import { BANDWIDTH_GB_PRICE, CURRENCY, MONEY_SCALE, STORAGE_GB_PRICE } from "./contants";

export function friendlyMoney(amount: number, showAllDecimals = false) {
	const moneyInScale = amount ? amount / MONEY_SCALE : 0;
	const decimals = (moneyInScale && showAllDecimals) ? Math.max(Math.abs(Math.min(Math.floor(Math.log10(moneyInScale)), 0)), 2) : 2;

	return moneyInScale.toLocaleString('en-US', {
		style: 'currency',
		currency: CURRENCY,
		minimumFractionDigits: decimals
	})
}

export function storageToMoney(bytes: number) {
	const sizeGb = bytes / (1024 * 1024 * 1024);
	return Math.round(sizeGb * STORAGE_GB_PRICE);
}

export function bandwidthToMoney(bytes: number) {
	const sizeGb = bytes / (1024 * 1024 * 1024);
	return Math.round(sizeGb * BANDWIDTH_GB_PRICE);
}