function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var NextHead = _interopDefault(require('next/head'));

const renderComponent = (ComponentOrNode, props) => {
  if (!ComponentOrNode) return null;

  if (typeof ComponentOrNode === 'function') {
    return /*#__PURE__*/React.createElement(ComponentOrNode, props);
  }

  return ComponentOrNode;
};

function Head({
  config,
  title,
  locale,
  meta
}) {
  return /*#__PURE__*/React.createElement(NextHead, null, config.font ? /*#__PURE__*/React.createElement("link", {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css"
  }) : null, /*#__PURE__*/React.createElement("title", null, title, renderComponent(config.titleSuffix, {
    locale,
    config,
    title,
    meta
  })), config.font ? /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: `html{font-family:Inter,sans-serif}@supports(font-variation-settings:normal){html{font-family:'Inter var',sans-serif}}`
    }
  }) : null, renderComponent(config.head, {
    locale,
    config,
    title,
    meta
  }), config.unstable_faviconGlyph ? /*#__PURE__*/React.createElement("link", {
    rel: "icon",
    href: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${config.unstable_faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`
  }) : null);
}

module.exports = Head;
