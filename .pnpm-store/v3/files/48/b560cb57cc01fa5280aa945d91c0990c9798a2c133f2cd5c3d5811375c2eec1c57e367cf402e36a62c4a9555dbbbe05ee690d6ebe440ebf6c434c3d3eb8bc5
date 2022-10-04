function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var router = require('next/router');
var Link = _interopDefault(require('next/link'));
var cn = _interopDefault(require('classnames'));

var useMounted = (() => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
});

function LocaleSwitch({
  options,
  isRTL
}) {
  const {
    locale,
    asPath
  } = router.useRouter();
  const mounted = useMounted();
  return /*#__PURE__*/React__default.createElement("details", {
    className: "locale-switch relative"
  }, /*#__PURE__*/React__default.createElement("summary", {
    className: "text-current p-2 cursor-pointer outline-none",
    tabIndex: "0"
  }, /*#__PURE__*/React__default.createElement("svg", {
    fill: "none",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    stroke: "currentColor"
  }, /*#__PURE__*/React__default.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
  }))), mounted ? /*#__PURE__*/React__default.createElement("ul", {
    className: cn('locale-dropdown absolute block bg-white dark:bg-dark border dark:border-gray-700 py-1 rounded shadow-lg', {
      'right-0': !isRTL,
      'left-0': isRTL
    })
  }, options.map(l => /*#__PURE__*/React__default.createElement("li", {
    key: l.locale
  }, /*#__PURE__*/React__default.createElement(Link, {
    href: asPath,
    locale: l.locale
  }, /*#__PURE__*/React__default.createElement("a", {
    className: cn('block no-underline text-current py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-800 whitespace-nowrap', {
      'font-semibold': locale === l.locale,
      'bg-gray-100 dark:bg-gray-900': locale === l.locale
    })
  }, l.text))))) : null);
}

module.exports = LocaleSwitch;
