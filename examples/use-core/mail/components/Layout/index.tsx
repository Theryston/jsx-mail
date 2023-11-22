export default function Layout({ children }: { children: JSX.Element }) {
	return (
		<div>
			<div t="ok">Ok</div>
			<div>{children}</div>
		</div>
	);
}
