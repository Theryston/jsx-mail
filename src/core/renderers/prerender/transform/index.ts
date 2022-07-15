import babel from '@babel/cli/lib/babel/dir';

export class Transform {
  async run(sourcePath: string, outputDir: string) {
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
}
