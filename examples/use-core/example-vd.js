const fs = require('fs');
const virtualDOM = require('./example-vd.json');

function camelToDash(str) {
	return str.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
}

function convertToHTML(virtualDOM) {
	if (!virtualDOM) {
		return '';
	}

	const { node, props, children } = virtualDOM;

	const childrenHTML = children
		.map((child) => {
			if (typeof child === 'string' || typeof child === 'number') {
				return child;
			} else {
				return convertToHTML(child);
			}
		})
		.join('');

	const propsHTML = Object.keys(props)
		.map((key) => ` ${camelToDash(key)}="${props[key]}"`)
		.join('');

	return `<${node}${propsHTML}>${childrenHTML}</${node}>`;
}

const htmlOutput = convertToHTML(virtualDOM);

fs.writeFileSync('example-vd.html', htmlOutput);
