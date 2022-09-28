module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	restoreMocks: true,
	clearMocks: true,
	collectCoverageFrom: [
		"lib/**/*.ts",
	],
	coverageDirectory: "coverage",
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	testRegex: /\.test\.tsx?/.source,
	globals: {
		"ts-jest": {
			diagnostics: false,
		},
	},
	moduleFileExtensions: ["js", "json", "jsx", "d.ts", "ts", "tsx", "node"],
};
