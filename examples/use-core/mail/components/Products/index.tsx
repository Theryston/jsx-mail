export default function Products({
	products,
}: {
	products: {
		price: number;
		name: string;
	}[];
}) {
	return (
		<>
			{products.map((product) => (
				<>
					<div>Name: {product.name}</div>
					<div>Price: {product.price}</div>
				</>
			))}
		</>
	);
}
