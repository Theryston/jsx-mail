const core = require('@jsx-mail/core').default;

const resultBuild = core.build('test');

const resultRender = core.render({
	builtDirPath: resultBuild,
	templateName: 'test',
});

console.log(`Result: ${resultRender}`);
