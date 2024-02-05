import { MONEY_SCALE } from "./contants";

export default function friendlyMoney(amount: number) {
	return (amount / MONEY_SCALE).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}