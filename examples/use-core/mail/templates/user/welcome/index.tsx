import Layout from '../../../components/Layout/index';

export const props = ['name'];

type propsType = {
	name: string;
};

export default function UserWelcomeTemplate({ name }: propsType) {
	return (
		<Layout>
			<div>
				<div>
					<></>
					<div>Hello, {name}</div>
				</div>
			</div>
		</Layout>
	);
}
