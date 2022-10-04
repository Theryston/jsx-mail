function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var nextThemes = require('next-themes');

var useMounted = (() => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
});

function ThemeSwitch() {
  const {
    theme,
    setTheme
  } = nextThemes.useTheme();
  const mounted = useMounted(); // @TODO: system theme

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return /*#__PURE__*/React__default.createElement("a", {
    className: "text-current p-2 cursor-pointer",
    tabIndex: "0",
    onClick: toggleTheme,
    onKeyDown: e => {
      if (e.key === 'Enter') toggleTheme();
    }
  }, mounted && theme === 'dark' ? /*#__PURE__*/React__default.createElement("svg", {
    fill: "none",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    stroke: "currentColor"
  }, /*#__PURE__*/React__default.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
  })) : mounted && theme === 'light' ? /*#__PURE__*/React__default.createElement("svg", {
    fill: "none",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    stroke: "currentColor"
  }, /*#__PURE__*/React__default.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  })) : /*#__PURE__*/React__default.createElement("svg", {
    key: "undefined",
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision"
  }));
}

module.exports = ThemeSwitch;
