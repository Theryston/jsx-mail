const core = require('@jsx-mail/core').default;

core
	.prepare('./mail', {
		onProcessChange: (name, data) => {
			console.log(name, data);
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
