import { CURRENCY, MONEY_SCALE } from "./contants";

export default function friendlyMoney(amount: number) {
	const usd = amount / MONEY_SCALE;
	const decimals = Math.max(Math.abs(Math.min(Math.floor(Math.log10(usd)), 0)), 2);

	return usd.toLocaleString('en-US', {
		style: 'currency',
		currency: CURRENCY,
		minimumFractionDigits: decimals
	})
}