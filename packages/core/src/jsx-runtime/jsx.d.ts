/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-redeclare
declare namespace JSX {
	type Element = {
		type: string;
		props: { [key: string]: any };
	};

	type ElementChildrenAttribute = {
		children: Element | string | number | (Element | string)[];
	};

	interface IntrinsicElements {
		div: { children?: Element | string | number | (Element | string | number)[], t?: string, a?: string };
		h1: { children?: Element | string | number | (Element | string | number)[] };
	}
}
