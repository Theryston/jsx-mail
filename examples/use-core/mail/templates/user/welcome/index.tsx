import Layout from '../../../components/Layout/index';

export const props = {
	name: String(),
	price: Number(),
	createdAt: Date(),
};

export default function UserWelcomeTemplate({
	name,
	price,
	createdAt,
}: typeof props) {
	return (
		<Layout>
			<div>
				<div>
					<div
						style={{
							width: '10px',
							backgroundColor: 'red',
						}}
					>
						Hello, {name.toLocaleUpperCase()}
					</div>
					<div>Price: {price}</div>
					<div>Price: {createdAt}</div>
				</div>
			</div>
		</Layout>
	);
}
