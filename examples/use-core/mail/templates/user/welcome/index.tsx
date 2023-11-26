import Layout from '../../../components/Layout/index';
import Products from '../../../components/Products/index';
import * as S from './styles';

export const props = {
	name: String(),
	products: Array({
		price: Number(),
		name: String(),
	}),
	createdAt: Date(),
};

// export const props = {
// 	name: 'Theryston',
// 	products: [
// 		{
// 			price: 100,
// 			name: 'Phone',
// 		},
// 		{
// 			price: 1000,
// 			name: 'macbook',
// 		},
// 	],
// 	createdAt: Date(),
// };

export default function UserWelcomeTemplate({
	name,
	products,
	createdAt,
}: typeof props) {
	return (
		<Layout>
			<div>
				<div style={S.NameWrapper}>
					<div style={S.NameText}>Hello, {name.toLocaleUpperCase()}</div>
				</div>
				<Products products={products} />
				<div>Buy at: {createdAt}</div>
			</div>
		</Layout>
	);
}
