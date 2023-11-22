const core = require('@jsx-mail/core').default;

core
	.build('./mail')
	.then((resultBuild) => {
		console.log('resultBuild', resultBuild);

		core
			.render({
				builtDirPath: resultBuild.outDir,
				templateName: 'test',
			})
			.then((resultRender) => {
				console.log(`resultRender: ${resultRender}`);
			});
	})
	.catch((error) => {
		console.log(error);
	});
