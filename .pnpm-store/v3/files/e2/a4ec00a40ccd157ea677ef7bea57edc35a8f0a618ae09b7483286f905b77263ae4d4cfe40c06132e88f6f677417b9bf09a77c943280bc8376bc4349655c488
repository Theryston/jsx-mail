function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

const themes = {
  default: 'bg-orange-100 text-orange-800 dark:text-orange-300 dark:bg-orange-200 dark:bg-opacity-10',
  error: 'bg-red-200 text-red-900 dark:text-red-200 dark:bg-red-600 dark:bg-opacity-30',
  warning: 'bg-yellow-200 text-yellow-900 dark:text-yellow-200 dark:bg-yellow-700 dark:bg-opacity-30'
};
var callout = (({
  children,
  type = 'default',
  emoji = '💡'
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: `${themes[type]} flex rounded-lg callout mt-6`
  }, /*#__PURE__*/React.createElement("div", {
    className: "pl-3 pr-2 py-2 select-none text-xl",
    style: {
      fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    }
  }, emoji), /*#__PURE__*/React.createElement("div", {
    className: "pr-4 py-2"
  }, children));
});

module.exports = callout;
