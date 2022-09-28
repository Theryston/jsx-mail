function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var cn = _interopDefault(require('classnames'));
var Link = _interopDefault(require('next/link'));
var Router = require('next/router');
var Router__default = _interopDefault(Router);
var matchSorter = _interopDefault(require('match-sorter'));
var GraphemeSplitter = _interopDefault(require('grapheme-splitter'));
var nextThemes = require('next-themes');

const renderComponent = (ComponentOrNode, props) => {
  if (!ComponentOrNode) return null;

  if (typeof ComponentOrNode === 'function') {
    return /*#__PURE__*/React__default.createElement(ComponentOrNode, props);
  }

  return ComponentOrNode;
};

const getFSRoute = (asPath, locale) => {
  if (!locale) return asPath.replace(new RegExp('/index(/|$)'), '$1');
  return asPath.replace(new RegExp(`\.${locale}(\/|$)`), '$1').replace(new RegExp('/index(/|$)'), '$1');
};

const MenuContext = React.createContext(false);
function useMenuContext() {
  return React.useContext(MenuContext);
}

const Item = ({
  title,
  active,
  href,
  onMouseOver,
  search
}) => {
  const highlight = title.toLowerCase().indexOf(search.toLowerCase());
  return /*#__PURE__*/React__default.createElement(Link, {
    href: href
  }, /*#__PURE__*/React__default.createElement("a", {
    className: "block no-underline",
    onMouseOver: onMouseOver
  }, /*#__PURE__*/React__default.createElement("li", {
    className: cn('p-2', {
      active
    })
  }, title.substring(0, highlight), /*#__PURE__*/React__default.createElement("span", {
    className: "highlight"
  }, title.substring(highlight, highlight + search.length)), title.substring(highlight + search.length))));
};

const UP = true;
const DOWN = false;

const Search = ({
  directories = []
}) => {
  const router = Router.useRouter();
  const [show, setShow] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [active, setActive] = React.useState(0);
  const input = React.useRef(null);
  const results = React.useMemo(() => {
    if (!search) return []; // Will need to scrape all the headers from each page and search through them here
    // (similar to what we already do to render the hash links in sidebar)
    // We could also try to search the entire string text from each page

    return matchSorter(directories, search, {
      keys: ['title']
    });
  }, [search]);

  const moveActiveItem = up => {
    const position = active + (up ? -1 : 1);
    const {
      length
    } = results; // Modulo instead of remainder,
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder

    const next = (position + length) % length;
    setActive(next);
  };

  const handleKeyDown = React.useCallback(e => {
    const {
      key,
      ctrlKey
    } = e;

    if (ctrlKey && key === 'n' || key === 'ArrowDown') {
      e.preventDefault();
      moveActiveItem(DOWN);
    }

    if (ctrlKey && key === 'p' || key === 'ArrowUp') {
      e.preventDefault();
      moveActiveItem(UP);
    }

    if (key === 'Enter') {
      router.push(results[active].route);
    }
  }, [active, results, router]);
  React.useEffect(() => {
    setActive(0);
  }, [search]);
  React.useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea'];

    const down = e => {
      if (document.activeElement && inputs.indexOf(document.activeElement.tagName.toLowerCase()) === -1) {
        if (e.key === '/') {
          e.preventDefault();
          input.current.focus();
        } else if (e.key === 'Escape') {
          setShow(false);
        }
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);
  const renderList = show && results.length > 0;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "nextra-search relative w-full md:w-64"
  }, renderList && /*#__PURE__*/React__default.createElement("div", {
    className: "search-overlay z-10",
    onClick: () => setShow(false)
  }), /*#__PURE__*/React__default.createElement("input", {
    onChange: e => {
      setSearch(e.target.value);
      setShow(true);
    },
    className: "appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:ring w-full",
    type: "search",
    placeholder: "Search (\"/\" to focus)",
    onKeyDown: handleKeyDown,
    onFocus: () => setShow(true),
    ref: input
  }), renderList && /*#__PURE__*/React__default.createElement("ul", {
    className: "shadow-md list-none p-0 m-0 absolute left-0 md:right-0 rounded mt-1 border top-100 divide-y z-20 w-full md:w-auto"
  }, results.map((res, i) => {
    return /*#__PURE__*/React__default.createElement(Item, {
      key: `search-item-${i}`,
      title: res.title,
      href: res.route,
      active: i === active,
      search: search,
      onMouseOver: () => setActive(i)
    });
  })));
};

const splitter = new GraphemeSplitter();
const TextWithHighlights = React__default.memo(({
  content,
  ranges
}) => {
  const splittedText = content ? splitter.splitGraphemes(content) : [];
  const res = [];
  let id = 0,
      index = 0;

  for (const range of ranges) {
    res.push( /*#__PURE__*/React__default.createElement(React.Fragment, {
      key: id++
    }, splittedText.splice(0, range.beginning - index).join('')));
    res.push( /*#__PURE__*/React__default.createElement("span", {
      className: "highlight",
      key: id++
    }, splittedText.splice(0, range.end - range.beginning).join('')));
    index = range.end;
  }

  res.push( /*#__PURE__*/React__default.createElement(React.Fragment, {
    key: id++
  }, splittedText.join('')));
  return res;
});

const Item$1 = ({
  title,
  active,
  href,
  onMouseOver,
  excerpt
}) => {
  return /*#__PURE__*/React__default.createElement(Link, {
    href: href
  }, /*#__PURE__*/React__default.createElement("a", {
    className: "block no-underline",
    onMouseOver: onMouseOver
  }, /*#__PURE__*/React__default.createElement("li", {
    className: cn('py-2 px-4', {
      active
    })
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "font-semibold"
  }, title), excerpt ? /*#__PURE__*/React__default.createElement("div", {
    className: "text-gray-600"
  }, /*#__PURE__*/React__default.createElement(TextWithHighlights, {
    content: excerpt.text,
    ranges: excerpt.highlight_ranges
  })) : null)));
}; // This can be global for better caching.


const stork = {};
function Search$1() {
  const router = Router.useRouter();
  const [show, setShow] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [active, setActive] = React.useState(0);
  const setStork = React.useState({})[1];
  const input = React.useRef(null);
  const results = React.useMemo(() => {
    if (!search) return [];
    const localeCode = Router__default.locale || 'default';
    if (!stork[localeCode]) return [];

    try {
      const json = stork[localeCode].wasm_search(`index-${localeCode}`, search);
      const obj = JSON.parse(json);
      if (!obj.results) return [];
      return obj.results.slice(0, 20).map(result => {
        return {
          title: result.entry.title,
          route: result.entry.url,
          excerpt: result.excerpts[0]
        };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [search]);
  const handleKeyDown = React.useCallback(e => {
    switch (e.key) {
      case 'ArrowDown':
        {
          e.preventDefault();

          if (active + 1 < results.length) {
            setActive(active + 1);
            const activeElement = document.querySelector(`.nextra-stork ul > :nth-child(${active + 2})`);

            if (activeElement && activeElement.scrollIntoViewIfNeeded) {
              activeElement.scrollIntoViewIfNeeded();
            }
          }

          break;
        }

      case 'ArrowUp':
        {
          e.preventDefault();

          if (active - 1 >= 0) {
            setActive(active - 1);
            const activeElement = document.querySelector(`.nextra-stork ul > :nth-child(${active})`);

            if (activeElement && activeElement.scrollIntoViewIfNeeded) {
              activeElement.scrollIntoViewIfNeeded();
            }
          }

          break;
        }

      case 'Enter':
        {
          router.push(results[active].route);
          break;
        }
    }
  }, [active, results, router]);

  const load = async () => {
    const localeCode = Router__default.locale || 'default';

    if (!stork[localeCode]) {
      stork[localeCode] = await new Promise(function (resolve) { resolve(require('./wasm-loader-b9b546ac.js')); });
      setStork({});
      const init = stork[localeCode].init('/stork.wasm');
      const res = await fetch(`/index-${localeCode}.st`);
      const buf = await res.arrayBuffer();
      await init;
      stork[localeCode].wasm_register_index(`index-${localeCode}`, new Uint8Array(buf));
    }
  };

  React.useEffect(() => {
    setActive(0);
  }, [search]);
  React.useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea'];

    const down = e => {
      if (document.activeElement && inputs.indexOf(document.activeElement.tagName.toLowerCase()) === -1) {
        if (e.key === '/') {
          e.preventDefault();
          input.current.focus();
        } else if (e.key === 'Escape') {
          setShow(false);
        }
      }
    };

    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, []);
  const renderList = show && results.length > 0;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "nextra-search nextra-stork relative w-full md:w-64"
  }, renderList && /*#__PURE__*/React__default.createElement("div", {
    className: "search-overlay z-10",
    onClick: () => setShow(false)
  }), /*#__PURE__*/React__default.createElement("input", {
    onChange: e => {
      setSearch(e.target.value);
      setShow(true);
    },
    className: "appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:ring w-full",
    type: "search",
    placeholder: "Search (\"/\" to focus)",
    onKeyDown: handleKeyDown,
    onFocus: () => {
      load();
      setShow(true);
    },
    ref: input,
    spellCheck: false
  }), renderList && /*#__PURE__*/React__default.createElement("ul", {
    className: "p-0 m-0 mt-1 top-full absolute divide-y z-20"
  }, results.map((res, i) => {
    return /*#__PURE__*/React__default.createElement(Item$1, {
      key: `search-item-${i}`,
      title: res.title,
      href: res.route,
      excerpt: res.excerpt,
      active: i === active,
      onMouseOver: () => setActive(i)
    });
  })));
}

var GitHubIcon = (({
  height = 40
}) => {
  return /*#__PURE__*/React__default.createElement("svg", {
    height: height,
    viewBox: "2 2 20 20",
    fill: "none"
  }, /*#__PURE__*/React__default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z",
    fill: "currentColor"
  }));
});

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

function LocaleSwitch({
  options,
  isRTL
}) {
  const {
    locale,
    asPath
  } = Router.useRouter();
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

function Navbar({
  config,
  isRTL,
  flatDirectories,
  flatPageDirectories
}) {
  const {
    locale,
    asPath
  } = Router.useRouter();
  const activeRoute = getFSRoute(asPath, locale).split('#')[0];
  const {
    menu,
    setMenu
  } = useMenuContext();
  return /*#__PURE__*/React__default.createElement("nav", {
    className: "flex items-center bg-white z-20 fixed top-0 left-0 right-0 h-16 border-b border-gray-200 px-6 dark:bg-dark dark:border-gray-900 bg-opacity-[.97] dark:bg-opacity-100"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "w-full flex items-center mr-2"
  }, /*#__PURE__*/React__default.createElement(Link, {
    href: "/"
  }, /*#__PURE__*/React__default.createElement("a", {
    className: "no-underline text-current inline-flex items-center hover:opacity-75"
  }, renderComponent(config.logo, {
    locale
  })))), flatPageDirectories ? flatPageDirectories.map(page => {
    if (page.hidden) return null;
    let href = page.route; // If it's a directory

    if (page.children) {
      href = page.firstChildRoute;
    }

    return /*#__PURE__*/React__default.createElement(Link, {
      href: href,
      key: page.route
    }, /*#__PURE__*/React__default.createElement("a", {
      className: cn('no-underline whitespace-nowrap mr-4 hidden md:inline-block', page.route === activeRoute || activeRoute.startsWith(page.route + '/') ? 'text-current' : 'text-gray-500')
    }, page.title));
  }) : null, /*#__PURE__*/React__default.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "hidden md:inline-block mr-2"
  }, config.customSearch || (config.search ? config.unstable_stork ? /*#__PURE__*/React__default.createElement(Search$1, null) : /*#__PURE__*/React__default.createElement(Search, {
    directories: flatDirectories
  }) : null))), config.darkMode ? /*#__PURE__*/React__default.createElement(ThemeSwitch, null) : null, config.i18n ? /*#__PURE__*/React__default.createElement(LocaleSwitch, {
    options: config.i18n,
    isRTL: isRTL
  }) : null, config.github ? /*#__PURE__*/React__default.createElement("a", {
    className: "text-current p-2",
    href: config.github,
    target: "_blank"
  }, /*#__PURE__*/React__default.createElement(GitHubIcon, {
    height: 24
  })) : null, /*#__PURE__*/React__default.createElement("button", {
    className: "block md:hidden p-2",
    onClick: () => setMenu(!menu)
  }, /*#__PURE__*/React__default.createElement("svg", {
    fill: "none",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /*#__PURE__*/React__default.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M4 6h16M4 12h16M4 18h16"
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "-mr-2"
  }));
}

module.exports = Navbar;
