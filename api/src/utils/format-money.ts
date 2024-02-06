import { CURRENCY, MONEY_SCALE, STORAGE_GB_PRICE } from "./contants";

export function friendlyMoney(amount: number) {
	const usd = amount ? amount / MONEY_SCALE : 0;
	const decimals = amount ? Math.max(Math.abs(Math.min(Math.floor(Math.log10(usd)), 0)), 2) : 2;

	return usd.toLocaleString('en-US', {
		style: 'currency',
		currency: CURRENCY,
		minimumFractionDigits: decimals
	})
}

export function storageToMoney(bytes: number) {
	const sizeGb = bytes / (1024 * 1024 * 1024);
	return Math.round(sizeGb * STORAGE_GB_PRICE);
}