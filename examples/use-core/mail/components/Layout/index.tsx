export default function Layout({ children }: { children: JSX.Element }) {
	return (
		<div>
			<div>I'm The layout</div>
			<div>{children}</div>
		</div>
	);
}
