export const props = ['name'];

type propsType = {
	name: string;
};

export default function UserWelcomeTemplate({ name }: propsType) {
	return (
		<div>
			<h1>Hello {name}</h1>
		</div>
	);
}
