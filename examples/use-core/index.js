const core = require('@jsx-mail/core').default;
const fs = require('fs');

core
	.prepare('./mail', {
		onProcessChange: (name, data) => {
			console.log(`Process ${name} was called`);

			if (name === 'ran_template') {
				fs.writeFileSync('./example-vd.json', JSON.stringify(data.virtualDOM));
				console.log(
					`Virtual DOM for ${data.path} is in file ./example-vd.json`
				);
			}
		},
	})
	.then((resultPrepare) => {
		console.log('resultPrepare', resultPrepare);

		core
			.render({
				builtDirPath: resultPrepare.outDir,
				templateName: 'test',
			})
			.then((resultRender) => {
				console.log(`resultRender: ${resultRender}`);
			});
	})
	.catch((error) => {
		console.log(error);
	});
