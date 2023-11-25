export default async function Layout({ children }: { children: JSX.Element }) {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return (
		<div>
			<div t="ok">I'm The layout</div>
			<div>{children}</div>
		</div>
	);
}
