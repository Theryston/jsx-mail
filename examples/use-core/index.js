const core = require('@jsx-mail/core').default;

core.build('test').then((resultBuild) => {
	console.log(`resultBuild: ${resultBuild}`);

	core
		.render({
			builtDirPath: resultBuild,
			templateName: 'test',
		})
		.then((resultRender) => {
			console.log(`resultRender: ${resultRender}`);
		});
});
