import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';

const space_Grotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'JSX Mail',
	description: 'Building the future of email with JSX syntax 📜',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return (
		<html lang="en">
			<body className={space_Grotesk.className}>{children}</body>
		</html>
	);
}
