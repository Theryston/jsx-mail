# strip-markdown

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin remove Markdown formatting.
This essentially removes everything but paragraphs and text nodes.

> This is one of the first remark plugins, before prefixing with `remark-` got
> cool.

## Note!

This plugin is ready for the new parser in remark
([`remarkjs/remark#536`](https://github.com/remarkjs/remark/pull/536)).
No change is needed: it works exactly the same now as it did before!

## Install

[npm][]:

```sh
npm install strip-markdown
```

## Use

```js
var remark = require('remark')
var strip = require('strip-markdown')

remark()
  .use(strip)
  .process('Some *emphasis*, **importance**, and `code`.', function(err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Yields:

```txt
Some emphasis, importance, and code.
```

## API

### `remark().use(strip)`

Plugin remove Markdown formatting.

*   Removes `html` ([*note*][gh-19]), `code`, `horizontalRule`, `table`, `yaml`,
    `toml`, and their content
*   Render everything else as simple paragraphs without formatting
*   Uses `alt` text for images

## Security

Use of `strip-markdown` does not involve [**rehype**][rehype] ([**hast**][hast])
or user content so there are no openings for [cross-site scripting (XSS)][xss]
attacks.

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/strip-markdown/workflows/main/badge.svg

[build]: https://github.com/remarkjs/strip-markdown/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/strip-markdown.svg

[coverage]: https://codecov.io/github/remarkjs/strip-markdown

[downloads-badge]: https://img.shields.io/npm/dm/strip-markdown.svg

[downloads]: https://www.npmjs.com/package/strip-markdown

[size-badge]: https://img.shields.io/bundlephobia/minzip/strip-markdown.svg

[size]: https://bundlephobia.com/result?p=strip-markdown

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast

[gh-19]: https://github.com/remarkjs/strip-markdown/issues/19
