import babel from '@babel/cli/lib/babel/dir';

export async function transform(sourcePath: string, outputDir: string) {
  console.log(babel);

  await babel({
    babelOptions: {
      presets: [
        '@babel/preset-typescript',
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        [
          'babel-plugin-styled-components',
          {
            ssr: false,
          },
        ],
      ],
    },
    cliOptions: {
      filenames: [sourcePath],
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
      outDir: outputDir,
      copyFiles: true,
      copyIgnored: true,
    },
  });
}
