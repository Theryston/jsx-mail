export default function friendlyMoney(amount: number) {
	return (amount / 10000).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}