function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var cn = _interopDefault(require('classnames'));
var Slugger = _interopDefault(require('github-slugger'));
var innerText = _interopDefault(require('react-innertext'));

const ActiveAnchorContext = React.createContext();
const ActiveAnchorSetterContext = React.createContext(); // Separate the state as 2 contexts here to avoid
// re-renders of the content triggered by the state update.

const useActiveAnchor = () => React.useContext(ActiveAnchorContext);

const indent = level => {
  switch (level) {
    case 'h3':
      return {
        marginLeft: '1rem '
      };

    case 'h4':
      return {
        marginLeft: '2rem '
      };

    case 'h5':
      return {
        marginLeft: '3rem '
      };

    case 'h6':
      return {
        marginLeft: '4rem '
      };
  }

  return {};
};

function ToC({
  titles
}) {
  const slugger = new Slugger();
  const activeAnchor = useActiveAnchor();
  return /*#__PURE__*/React__default.createElement("div", {
    className: "w-64 hidden xl:block text-sm pl-4"
  }, titles ? /*#__PURE__*/React__default.createElement("ul", {
    className: "overflow-y-auto sticky max-h-[calc(100vh-4rem)] top-16 pt-8 pb-10 m-0 list-none"
  }, titles.filter(item => item.props.mdxType !== 'h1').map(item => {
    const text = innerText(item.props.children) || '';
    const slug = slugger.slug(text);
    const state = activeAnchor[slug];
    return /*#__PURE__*/React__default.createElement("li", {
      key: slug,
      style: indent(item.props.mdxType)
    }, /*#__PURE__*/React__default.createElement("a", {
      href: `#${slug}`,
      className: cn('no-underline hover:text-gray-900 dark:hover:text-gray-100', state && state.isActive ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-600')
    }, text));
  })) : null);
}

module.exports = ToC;
