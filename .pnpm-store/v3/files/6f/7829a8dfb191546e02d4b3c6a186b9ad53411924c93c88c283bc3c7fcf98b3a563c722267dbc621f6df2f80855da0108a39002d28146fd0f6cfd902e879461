function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Router = require('next/router');
var Router__default = _interopDefault(Router);
require('focus-visible');
var skipNav = require('@reach/skip-nav');
var nextThemes = require('next-themes');
var innerText = _interopDefault(require('react-innertext'));
var cn = _interopDefault(require('classnames'));
var getTitle = _interopDefault(require('title'));
var NextHead = _interopDefault(require('next/head'));
var Link = _interopDefault(require('next/link'));
var matchSorter = _interopDefault(require('match-sorter'));
var GraphemeSplitter = _interopDefault(require('grapheme-splitter'));
var parseGitUrl = _interopDefault(require('parse-git-url'));
var react = require('@mdx-js/react');
var Slugger = _interopDefault(require('github-slugger'));
var Highlight = require('prism-react-renderer');
var Highlight__default = _interopDefault(Highlight);
require('intersection-observer');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function getMetaTitle(meta) {
  if (typeof meta === 'string') return meta;
  if (typeof meta === 'object') return meta.title;
  return '';
}

function getMetaItemType(meta) {
  if (typeof meta === 'object') return meta.type;
  return 'docs';
}

function getMetaHidden(meta) {
  if (typeof meta === 'object') return meta.hidden || false;
  return false;
}

function normalizePages({
  list,
  locale,
  defaultLocale,
  route,
  docsRoot = ''
}) {
  let meta;

  for (let item of list) {
    if (item.name === 'meta.json') {
      if (locale === item.locale) {
        meta = item.meta;
        break;
      } // fallback


      if (!meta) {
        meta = item.meta;
      }
    }
  }

  if (!meta) {
    meta = {};
  }

  const metaKeys = Object.keys(meta);
  const hasLocale = new Map();

  if (locale) {
    list.forEach(a => a.locale === locale ? hasLocale.set(a.name, true) : null);
  } // All directories


  const directories = [];
  const flatDirectories = []; // Docs directories

  const docsDirectories = [];
  const flatDocsDirectories = []; // Page directories

  const pageDirectories = [];
  const flatPageDirectories = [];
  let activeType;
  let activeIndex;
  list.filter(a => // not meta
  a.name !== 'meta.json' && // not hidden routes
  !a.name.startsWith('_') && ( // locale matches, or fallback to default locale
  a.locale === locale || (a.locale === defaultLocale || !a.locale) && !hasLocale.get(a.name))).sort((a, b) => {
    const indexA = metaKeys.indexOf(a.name);
    const indexB = metaKeys.indexOf(b.name);
    if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  }).forEach(a => {
    const title = getMetaTitle(meta[a.name]) || getTitle(a.name);
    const type = getMetaItemType(meta[a.name]) || 'docs';
    const hidden = getMetaHidden(meta[a.name]); // If the doc is under the active page root.

    const isCurrentDocsTree = type === 'docs' && route.startsWith(docsRoot);

    if (a.route === route) {
      activeType = type;

      switch (type) {
        case 'nav':
          activeIndex = flatPageDirectories.length;
          break;

        case 'docs':
        default:
          if (isCurrentDocsTree) {
            activeIndex = flatDocsDirectories.length;
          }

      }
    }

    const normalizedChildren = a.children ? normalizePages({
      list: a.children,
      locale,
      defaultLocale,
      route,
      docsRoot: type === 'nav' ? a.route : docsRoot
    }) : undefined;

    if (normalizedChildren) {
      if (normalizedChildren.activeIndex !== undefined && normalizedChildren.activeType !== undefined) {
        activeType = normalizedChildren.activeType;

        switch (activeType) {
          case 'nav':
            activeIndex = flatPageDirectories.length + normalizedChildren.activeIndex;
            break;

          case 'docs':
            activeIndex = flatDocsDirectories.length + normalizedChildren.activeIndex;
            break;
        }
      }
    }

    const item = _extends({}, a, {
      title,
      type,
      children: normalizedChildren ? [] : undefined
    });

    const docsItem = _extends({}, a, {
      title,
      type,
      children: normalizedChildren ? [] : undefined
    });

    const pageItem = _extends({}, a, {
      title,
      type,
      hidden,
      children: normalizedChildren ? [] : undefined
    });

    if (normalizedChildren) {
      switch (type) {
        case 'nav':
          pageItem.children.push(...normalizedChildren.pageDirectories);
          docsDirectories.push(...normalizedChildren.docsDirectories); // If it's a page with non-page children, we inject itself as a page too.

          if (!normalizedChildren.flatPageDirectories.length && normalizedChildren.flatDirectories.length) {
            pageItem.firstChildRoute = normalizedChildren.flatDirectories[0].route;
            flatPageDirectories.push(pageItem);
          }

          break;

        case 'docs':
        default:
          if (isCurrentDocsTree) {
            docsItem.children.push(...normalizedChildren.docsDirectories);
            pageDirectories.push(...normalizedChildren.pageDirectories);
          }

      }

      flatDirectories.push(...normalizedChildren.flatDirectories);
      flatPageDirectories.push(...normalizedChildren.flatPageDirectories);
      flatDocsDirectories.push(...normalizedChildren.flatDocsDirectories);
      item.children.push(...normalizedChildren.directories);
    } else {
      flatDirectories.push(item);

      switch (type) {
        case 'nav':
          flatPageDirectories.push(pageItem);
          break;

        case 'docs':
        default:
          if (isCurrentDocsTree) {
            flatDocsDirectories.push(docsItem);
          }

      }
    }

    directories.push(item);

    switch (type) {
      case 'nav':
        pageDirectories.push(pageItem);
        break;

      case 'docs':
      default:
        if (isCurrentDocsTree) {
          docsDirectories.push(docsItem);
        }

    }
  });
  return {
    activeType,
    activeIndex,
    directories,
    flatDirectories,
    docsDirectories,
    flatDocsDirectories,
    pageDirectories,
    flatPageDirectories
  };
}

const renderComponent = (ComponentOrNode, props) => {
  if (!ComponentOrNode) return null;

  if (typeof ComponentOrNode === 'function') {
    return /*#__PURE__*/React__default.createElement(ComponentOrNode, props);
  }

  return ComponentOrNode;
};

function Head({
  config,
  title,
  locale,
  meta
}) {
  return /*#__PURE__*/React__default.createElement(NextHead, null, config.font ? /*#__PURE__*/React__default.createElement("link", {
    rel: "stylesheet",
    href: "https://rsms.me/inter/inter.css"
  }) : null, /*#__PURE__*/React__default.createElement("title", null, title, renderComponent(config.titleSuffix, {
    locale,
    config,
    title,
    meta
  })), config.font ? /*#__PURE__*/React__default.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: `html{font-family:Inter,sans-serif}@supports(font-variation-settings:normal){html{font-family:'Inter var',sans-serif}}`
    }
  }) : null, renderComponent(config.head, {
    locale,
    config,
    title,
    meta
  }), config.unstable_faviconGlyph ? /*#__PURE__*/React__default.createElement("link", {
    rel: "icon",
    href: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${config.unstable_faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`
  }) : null);
}

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

var ArrowRight = ((_ref) => {
  let {
    height = 24
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["height"]);

  return /*#__PURE__*/React__default.createElement("svg", _extends({
    height: height,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, props), /*#__PURE__*/React__default.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M9 5l7 7-7 7"
  }));
});

const NextLink = ({
  route,
  title,
  isRTL
}) => {
  return /*#__PURE__*/React__default.createElement(Link, {
    href: route
  }, /*#__PURE__*/React__default.createElement("a", {
    className: cn('text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center', {
      'ml-2': !isRTL,
      'mr-2': isRTL
    }),
    title: title
  }, title, /*#__PURE__*/React__default.createElement(ArrowRight, {
    className: cn('transform inline flex-shrink-0', {
      'rotate-180 mr-1': isRTL,
      'ml-1': !isRTL
    })
  })));
};

const PrevLink = ({
  route,
  title,
  isRTL
}) => {
  return /*#__PURE__*/React__default.createElement(Link, {
    href: route
  }, /*#__PURE__*/React__default.createElement("a", {
    className: cn('text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center', {
      'mr-2': !isRTL,
      'ml-2': isRTL
    }),
    title: title
  }, /*#__PURE__*/React__default.createElement(ArrowRight, {
    className: cn('transform inline flex-shrink-0', {
      'rotate-180 mr-1': !isRTL,
      'ml-1': isRTL
    })
  }), title));
};

const createEditUrl = (repository, filepath) => {
  const repo = parseGitUrl(repository);
  if (!repo) throw new Error('Invalid `docsRepositoryBase` URL!');

  switch (repo.type) {
    case 'github':
      return `https://github.com/${repo.owner}/${repo.name}/blob/${repo.branch || 'main'}/${repo.subdir || 'pages'}${filepath}`;

    case 'gitlab':
      return `https://gitlab.com/${repo.owner}/${repo.name}/-/blob/${repo.branch || 'master'}/${repo.subdir || 'pages'}${filepath}`;
  }

  return '#';
};

const EditPageLink = ({
  repository,
  text,
  filepath
}) => {
  const url = createEditUrl(repository, filepath);
  const {
    locale
  } = Router.useRouter();
  return /*#__PURE__*/React__default.createElement("a", {
    className: "text-sm",
    href: url,
    target: "_blank"
  }, text ? renderComponent(text, {
    locale
  }) : 'Edit this page');
};

const NavLinks = ({
  config,
  flatDirectories,
  currentIndex,
  isRTL
}) => {
  let prev = flatDirectories[currentIndex - 1];
  let next = flatDirectories[currentIndex + 1];
  return /*#__PURE__*/React__default.createElement("div", {
    className: "flex flex-row items-center justify-between"
  }, /*#__PURE__*/React__default.createElement("div", null, prev && config.prevLinks ? /*#__PURE__*/React__default.createElement(PrevLink, {
    route: prev.route,
    title: prev.title,
    isRTL: isRTL
  }) : null), /*#__PURE__*/React__default.createElement("div", null, config.nextLinks && next ? /*#__PURE__*/React__default.createElement(NextLink, {
    route: next.route,
    title: next.title,
    isRTL: isRTL
  }) : null));
};

const Footer = ({
  config,
  filepathWithName,
  children
}) => {
  const {
    locale
  } = Router.useRouter();
  return /*#__PURE__*/React__default.createElement("footer", {
    className: "mt-24"
  }, children, /*#__PURE__*/React__default.createElement("hr", null), config.footer ? /*#__PURE__*/React__default.createElement("div", {
    className: "mt-24 flex justify-between flex-col-reverse md:flex-row items-center md:items-end"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "text-gray-600"
  }, renderComponent(config.footerText, {
    locale
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "mt-6"
  }), config.footerEditLink ? /*#__PURE__*/React__default.createElement(EditPageLink, {
    filepath: filepathWithName,
    repository: config.docsRepositoryBase,
    text: config.footerEditLink
  }) : null) : null);
};

const ActiveAnchorContext = React.createContext();
const ActiveAnchorSetterContext = React.createContext(); // Separate the state as 2 contexts here to avoid
// re-renders of the content triggered by the state update.

const useActiveAnchor = () => React.useContext(ActiveAnchorContext);
const useActiveAnchorSet = () => React.useContext(ActiveAnchorSetterContext);
const ActiveAnchor = ({
  children
}) => {
  const state = React.useState({});
  return /*#__PURE__*/React__default.createElement(ActiveAnchorContext.Provider, {
    value: state[0]
  }, /*#__PURE__*/React__default.createElement(ActiveAnchorSetterContext.Provider, {
    value: state[1]
  }, children));
};

const THEME = {
  plain: {
    backgroundColor: 'transparent'
  },
  styles: [{
    types: ['keyword', 'builtin'],
    style: {
      color: '#ff0078',
      fontWeight: 'bold'
    }
  }, {
    types: ['comment'],
    style: {
      color: '#999',
      fontStyle: 'italic'
    }
  }, {
    types: ['variable', 'language-javascript'],
    style: {
      color: '#0076ff'
    }
  }, {
    types: ['attr-name'],
    style: {
      color: '#d9931e',
      fontStyle: 'normal'
    }
  }, {
    types: ['boolean', 'regex'],
    style: {
      color: '#d9931e'
    }
  }]
};
const ob = {};
const obCallback = {};

const createOrGetObserver = rootMargin => {
  // Only create 1 instance for performance reasons
  if (!ob[rootMargin]) {
    obCallback[rootMargin] = [];
    ob[rootMargin] = new IntersectionObserver(e => {
      obCallback[rootMargin].forEach(cb => cb(e));
    }, {
      rootMargin,
      threshold: [0, 1]
    });
  }

  return ob[rootMargin];
};

function useIntersect(margin, ref, cb) {
  React.useEffect(() => {
    const callback = entries => {
      let e;

      for (let i = 0; i < entries.length; i++) {
        if (entries[i].target === ref.current) {
          e = entries[i];
          break;
        }
      }

      if (e) cb(e);
    };

    const observer = createOrGetObserver(margin);
    obCallback[margin].push(callback);
    if (ref.current) observer.observe(ref.current);
    return () => {
      const idx = obCallback[margin].indexOf(callback);
      if (idx >= 0) obCallback[margin].splice(idx, 1);
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
} // Anchor links


const HeaderLink = (_ref) => {
  let {
    tag: Tag,
    children,
    slugger,
    withObserver = true
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["tag", "children", "slugger", "withObserver"]);

  const setActiveAnchor = useActiveAnchorSet();
  const obRef = React.useRef();
  const slug = slugger.slug(innerText(children) || '');
  const anchor = /*#__PURE__*/React__default.createElement("span", {
    className: "subheading-anchor",
    id: slug,
    ref: obRef
  }); // We are pretty sure that this header link component will not be rerendered
  // separately, so we attach a mutable index property to slugger.

  const index = slugger.index++;
  useIntersect("0px 0px -50%", obRef, e => {
    const aboveHalfViewport = e.boundingClientRect.y + e.boundingClientRect.height <= e.rootBounds.y + e.rootBounds.height;
    const insideHalfViewport = e.intersectionRatio > 0;
    setActiveAnchor(f => {
      const ret = _extends({}, f, {
        [slug]: {
          index,
          aboveHalfViewport,
          insideHalfViewport
        }
      });

      let activeSlug;
      let smallestIndexInViewport = Infinity;
      let largestIndexAboveViewport = -1;

      for (let s in f) {
        ret[s].isActive = false;

        if (ret[s].insideHalfViewport && ret[s].index < smallestIndexInViewport) {
          smallestIndexInViewport = ret[s].index;
          activeSlug = s;
        }

        if (smallestIndexInViewport === Infinity && ret[s].aboveHalfViewport && ret[s].index > largestIndexAboveViewport) {
          largestIndexAboveViewport = ret[s].index;
          activeSlug = s;
        }
      }

      if (ret[activeSlug]) ret[activeSlug].isActive = true;
      return ret;
    });
  });
  return /*#__PURE__*/React__default.createElement(Tag, props, anchor, /*#__PURE__*/React__default.createElement("a", {
    href: '#' + slug,
    className: "text-current no-underline no-outline"
  }, children, /*#__PURE__*/React__default.createElement("span", {
    className: "anchor-icon",
    "aria-hidden": true
  }, "#")));
};

const H2 = ({
  slugger
}) => (_ref2) => {
  let {
    children
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["children"]);

  return /*#__PURE__*/React__default.createElement(HeaderLink, _extends({
    tag: "h2",
    slugger: slugger
  }, props), children);
};

const H3 = ({
  slugger
}) => (_ref3) => {
  let {
    children
  } = _ref3,
      props = _objectWithoutPropertiesLoose(_ref3, ["children"]);

  return /*#__PURE__*/React__default.createElement(HeaderLink, _extends({
    tag: "h3",
    slugger: slugger
  }, props), children);
};

const H4 = ({
  slugger
}) => (_ref4) => {
  let {
    children
  } = _ref4,
      props = _objectWithoutPropertiesLoose(_ref4, ["children"]);

  return /*#__PURE__*/React__default.createElement(HeaderLink, _extends({
    tag: "h4",
    slugger: slugger
  }, props), children);
};

const H5 = ({
  slugger
}) => (_ref5) => {
  let {
    children
  } = _ref5,
      props = _objectWithoutPropertiesLoose(_ref5, ["children"]);

  return /*#__PURE__*/React__default.createElement(HeaderLink, _extends({
    tag: "h5",
    slugger: slugger
  }, props), children);
};

const H6 = ({
  slugger
}) => (_ref6) => {
  let {
    children
  } = _ref6,
      props = _objectWithoutPropertiesLoose(_ref6, ["children"]);

  return /*#__PURE__*/React__default.createElement(HeaderLink, _extends({
    tag: "h6",
    slugger: slugger
  }, props), children);
};

const A = (_ref7) => {
  let {
    children
  } = _ref7,
      props = _objectWithoutPropertiesLoose(_ref7, ["children"]);

  const isExternal = props.href && props.href.startsWith('https://');

  if (isExternal) {
    return /*#__PURE__*/React__default.createElement("a", _extends({
      target: "_blank"
    }, props), children);
  }

  return /*#__PURE__*/React__default.createElement(Link, {
    href: props.href
  }, /*#__PURE__*/React__default.createElement("a", props, children));
};

const Code = (_ref8) => {
  let {
    children,
    className,
    highlight
  } = _ref8,
      props = _objectWithoutPropertiesLoose(_ref8, ["children", "className", "highlight"]);

  const highlightedRanges = React.useMemo(() => {
    return highlight ? highlight.split(',').map(r => {
      if (r.includes('-')) {
        return r.split('-');
      }

      return +r;
    }) : [];
  }, [highlight]);
  if (!className) return /*#__PURE__*/React__default.createElement("code", props, children); // https://mdxjs.com/guides/syntax-highlighting#all-together

  const language = className.replace(/language-/, '');
  return /*#__PURE__*/React__default.createElement(Highlight__default, _extends({}, Highlight.defaultProps, {
    code: children.trim(),
    language: language,
    theme: THEME
  }), ({
    className,
    style,
    tokens,
    getLineProps,
    getTokenProps
  }) => /*#__PURE__*/React__default.createElement("code", {
    className: className,
    style: _extends({}, style)
  }, tokens.map((line, i) => /*#__PURE__*/React__default.createElement("div", _extends({
    key: i
  }, getLineProps({
    line,
    key: i
  }), {
    style: highlightedRanges.some(r => Array.isArray(r) ? r[0] <= i + 1 && i + 1 <= r[1] : r === i + 1) ? {
      background: 'var(--c-highlight)',
      margin: '0 -1rem',
      padding: '0 1rem'
    } : null
  }), line.map((token, key) => /*#__PURE__*/React__default.createElement("span", _extends({
    key: key
  }, getTokenProps({
    token,
    key
  }))))))));
};

const Table = ({
  children
}) => {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "table-container"
  }, /*#__PURE__*/React__default.createElement("table", null, children));
};

const getComponents = args => ({
  h2: H2(args),
  h3: H3(args),
  h4: H4(args),
  h5: H5(args),
  h6: H6(args),
  a: A,
  code: Code,
  table: Table
});

var Theme = (({
  children
}) => {
  const slugger = new Slugger();
  slugger.index = 0;
  return /*#__PURE__*/React__default.createElement(react.MDXProvider, {
    components: getComponents({
      slugger
    })
  }, children);
});

const TreeState = new Map();

function Folder({
  item,
  anchors
}) {
  var _TreeState$item$route;

  const {
    asPath,
    locale
  } = Router.useRouter();
  const routeOriginal = getFSRoute(asPath, locale);
  const route = routeOriginal.split('#')[0] + '/';
  const active = route === item.route + '/';
  const {
    defaultMenuCollapsed
  } = useMenuContext();
  const open = (_TreeState$item$route = TreeState[item.route]) != null ? _TreeState$item$route : !defaultMenuCollapsed;
  const [_, render] = React.useState(false);
  React.useEffect(() => {
    if (active) {
      TreeState[item.route] = true;
    }
  }, [active]);
  return /*#__PURE__*/React__default.createElement("li", {
    className: open ? 'active' : ''
  }, /*#__PURE__*/React__default.createElement("button", {
    onClick: () => {
      if (active) return;
      TreeState[item.route] = !open;
      render(x => !x);
    }
  }, item.title), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: open ? 'initial' : 'none'
    }
  }, /*#__PURE__*/React__default.createElement(Menu, {
    directories: item.children,
    base: item.route,
    anchors: anchors
  })));
}

function File({
  item,
  anchors
}) {
  const {
    setMenu
  } = useMenuContext();
  const {
    asPath,
    locale
  } = Router.useRouter();
  const route = getFSRoute(asPath, locale) + '/';
  const active = route === item.route + '/';
  const slugger = new Slugger();
  const activeAnchor = useActiveAnchor();
  const title = item.title; // if (item.title.startsWith('> ')) {
  // title = title.substr(2)

  if (anchors && anchors.length) {
    if (active) {
      let activeIndex = 0;
      const anchorInfo = anchors.map((anchor, i) => {
        const text = innerText(anchor) || '';
        const slug = slugger.slug(text);

        if (activeAnchor[slug] && activeAnchor[slug].isActive) {
          activeIndex = i;
        }

        return {
          text,
          slug
        };
      });
      return /*#__PURE__*/React__default.createElement("li", {
        className: active ? 'active' : ''
      }, /*#__PURE__*/React__default.createElement(Link, {
        href: item.route
      }, /*#__PURE__*/React__default.createElement("a", null, title)), /*#__PURE__*/React__default.createElement("ul", null, anchors.map((_, i) => {
        const {
          slug,
          text
        } = anchorInfo[i];
        const isActive = i === activeIndex;
        return /*#__PURE__*/React__default.createElement("li", {
          key: `a-${slug}`
        }, /*#__PURE__*/React__default.createElement("a", {
          href: '#' + slug,
          onClick: () => setMenu(false),
          className: isActive ? 'active-anchor' : ''
        }, /*#__PURE__*/React__default.createElement("span", {
          className: "flex text-sm"
        }, /*#__PURE__*/React__default.createElement("span", {
          className: "opacity-25"
        }, "#"), /*#__PURE__*/React__default.createElement("span", {
          className: "mr-2"
        }), /*#__PURE__*/React__default.createElement("span", {
          className: "inline-block"
        }, text))));
      })));
    }
  }

  return /*#__PURE__*/React__default.createElement("li", {
    className: active ? 'active' : ''
  }, /*#__PURE__*/React__default.createElement(Link, {
    href: item.route
  }, /*#__PURE__*/React__default.createElement("a", {
    onClick: () => setMenu(false)
  }, title)));
}

function Menu({
  directories,
  anchors
}) {
  return /*#__PURE__*/React__default.createElement("ul", null, directories.map(item => {
    if (item.children) {
      return /*#__PURE__*/React__default.createElement(Folder, {
        key: item.name,
        item: item,
        anchors: anchors
      });
    }

    return /*#__PURE__*/React__default.createElement(File, {
      key: item.name,
      item: item,
      anchors: anchors
    });
  }));
}

function Sidebar({
  directories,
  flatDirectories,
  fullDirectories,
  anchors = [],
  mdShow = true,
  config
}) {
  const {
    menu
  } = useMenuContext();
  React.useEffect(() => {
    if (menu) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [menu]);
  return /*#__PURE__*/React__default.createElement("aside", {
    className: cn('fixed h-screen bg-white dark:bg-dark flex-shrink-0 w-full md:w-64 md:sticky z-20', menu ? '' : 'hidden', mdShow ? 'md:block' : ''),
    style: {
      top: '4rem',
      height: 'calc(100vh - 4rem)'
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sidebar border-gray-200 dark:border-gray-900 w-full p-4 pb-40 md:pb-16 h-full overflow-y-auto"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mb-4 block md:hidden"
  }, config.customSearch || (config.search ? config.unstable_stork ? /*#__PURE__*/React__default.createElement(Search$1, null) : /*#__PURE__*/React__default.createElement(Search, {
    directories: flatDirectories
  }) : null)), /*#__PURE__*/React__default.createElement("div", {
    className: "hidden md:block"
  }, /*#__PURE__*/React__default.createElement(Menu, {
    directories: directories,
    anchors: anchors
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "md:hidden"
  }, /*#__PURE__*/React__default.createElement(Menu, {
    directories: fullDirectories,
    anchors: anchors
  }))));
}

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

var defaultConfig = {
  github: 'https://github.com/shuding/nextra',
  docsRepositoryBase: 'https://github.com/shuding/nextra',
  titleSuffix: ' – Nextra',
  nextLinks: true,
  prevLinks: true,
  search: true,
  darkMode: true,
  defaultMenuCollapsed: false,
  font: true,
  footer: true,
  footerText: `MIT ${new Date().getFullYear()} © Nextra.`,
  footerEditLink: 'Edit this page',
  logo: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("span", {
    className: "mr-2 font-extrabold hidden md:inline"
  }, "Nextra"), /*#__PURE__*/React__default.createElement("span", {
    className: "text-gray-600 font-normal hidden md:inline"
  }, "The Next Docs Builder")),
  head: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("meta", {
    name: "msapplication-TileColor",
    content: "#ffffff"
  }), /*#__PURE__*/React__default.createElement("meta", {
    name: "theme-color",
    content: "#ffffff"
  }), /*#__PURE__*/React__default.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }), /*#__PURE__*/React__default.createElement("meta", {
    httpEquiv: "Content-Language",
    content: "en"
  }), /*#__PURE__*/React__default.createElement("meta", {
    name: "description",
    content: "Nextra: the next docs builder"
  }), /*#__PURE__*/React__default.createElement("meta", {
    name: "twitter:card",
    content: "summary_large_image"
  }), /*#__PURE__*/React__default.createElement("meta", {
    name: "twitter:site",
    content: "@shuding_"
  }), /*#__PURE__*/React__default.createElement("meta", {
    property: "og:title",
    content: "Nextra: the next docs builder"
  }), /*#__PURE__*/React__default.createElement("meta", {
    property: "og:description",
    content: "Nextra: the next docs builder"
  }), /*#__PURE__*/React__default.createElement("meta", {
    name: "apple-mobile-web-app-title",
    content: "Nextra"
  })) // direction: 'ltr',
  // i18n: [{ locale: 'en-US', text: 'English', direction: 'ltr' }],

};

const titleType = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

function useDirectoryInfo(pageMap) {
  const {
    locale,
    defaultLocale,
    asPath
  } = Router.useRouter();
  return React.useMemo(() => {
    const fsPath = getFSRoute(asPath, locale).split('#')[0];
    return normalizePages({
      list: pageMap,
      locale,
      defaultLocale,
      route: fsPath
    });
  }, [pageMap, locale, defaultLocale, asPath]);
}

function Body({
  meta,
  config,
  toc,
  filepathWithName,
  navLinks,
  children
}) {
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(skipNav.SkipNavContent, null), meta.full ? /*#__PURE__*/React__default.createElement("article", {
    className: "relative pt-16 w-full overflow-x-hidden"
  }, children) : /*#__PURE__*/React__default.createElement("article", {
    className: "docs-container relative pt-16 pb-16 px-6 md:px-8 w-full max-w-full flex min-w-0"
  }, /*#__PURE__*/React__default.createElement("main", {
    className: "max-w-screen-md mx-auto pt-4 z-10 min-w-0"
  }, /*#__PURE__*/React__default.createElement(Theme, null, children), /*#__PURE__*/React__default.createElement(Footer, {
    config: config,
    filepathWithName: filepathWithName
  }, navLinks)), toc));
}

const Layout = ({
  filename,
  config: _config,
  pageMap,
  meta,
  children
}) => {
  const {
    route,
    locale
  } = Router.useRouter(); // @TODO: config should be in a context.

  const config = Object.assign({}, defaultConfig, _config);
  const {
    activeType,
    activeIndex,
    // pageDirectories,
    flatPageDirectories,
    docsDirectories,
    flatDirectories,
    flatDocsDirectories,
    directories
  } = useDirectoryInfo(pageMap);
  const filepath = route.slice(0, route.lastIndexOf('/') + 1);
  const filepathWithName = filepath + filename;
  const titles = React__default.Children.toArray(children).filter(child => child.props && titleType.includes(child.props.mdxType));
  const titleEl = titles.find(child => child.props && child.props.mdxType === 'h1');
  const title = meta.title || (titleEl ? innerText(titleEl.props.children) : 'Untitled');
  const anchors = titles.filter(child => child.props && (config.floatTOC || child.props.mdxType === 'h2')).map(child => child.props.children);
  const isRTL = React.useMemo(() => {
    if (!config.i18n) return config.direction === 'rtl' || null;
    const localeConfig = config.i18n.find(l => l.locale === locale);
    return localeConfig && localeConfig.direction === 'rtl';
  }, [config.i18n, locale]);
  const [menu, setMenu] = React.useState(false);

  if (activeType === 'nav') {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Head, {
      config: config,
      title: title,
      locale: locale,
      meta: meta
    }), /*#__PURE__*/React__default.createElement(MenuContext.Provider, {
      value: {
        menu,
        setMenu,
        defaultMenuCollapsed: !!config.defaultMenuCollapsed
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: cn('nextra-container main-container flex flex-col', {
        rtl: isRTL,
        page: true
      })
    }, /*#__PURE__*/React__default.createElement(Navbar, {
      config: config,
      isRTL: isRTL,
      flatDirectories: flatDirectories,
      flatPageDirectories: flatPageDirectories
    }), /*#__PURE__*/React__default.createElement(ActiveAnchor, null, /*#__PURE__*/React__default.createElement("div", {
      className: "flex flex-1 h-full"
    }, /*#__PURE__*/React__default.createElement(Sidebar, {
      directories: flatPageDirectories,
      flatDirectories: flatDirectories,
      fullDirectories: directories,
      mdShow: false,
      config: config
    }), /*#__PURE__*/React__default.createElement(Body, {
      meta: meta,
      config: config,
      filepathWithName: filepathWithName,
      navLinks: null
    }, children))))));
  } // Docs layout


  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Head, {
    config: config,
    title: title,
    locale: locale,
    meta: meta
  }), /*#__PURE__*/React__default.createElement(MenuContext.Provider, {
    value: {
      menu,
      setMenu,
      defaultMenuCollapsed: !!config.defaultMenuCollapsed
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: cn('nextra-container main-container flex flex-col', {
      rtl: isRTL
    })
  }, /*#__PURE__*/React__default.createElement(Navbar, {
    config: config,
    isRTL: isRTL,
    flatDirectories: flatDirectories,
    flatPageDirectories: flatPageDirectories
  }), /*#__PURE__*/React__default.createElement(ActiveAnchor, null, /*#__PURE__*/React__default.createElement("div", {
    className: "flex flex-1 h-full"
  }, /*#__PURE__*/React__default.createElement(Sidebar, {
    directories: docsDirectories,
    flatDirectories: flatDirectories,
    fullDirectories: directories,
    anchors: config.floatTOC ? [] : anchors,
    config: config
  }), /*#__PURE__*/React__default.createElement(Body, {
    meta: meta,
    config: config,
    filepathWithName: filepathWithName,
    toc: /*#__PURE__*/React__default.createElement(ToC, {
      titles: config.floatTOC ? titles : null
    }),
    navLinks: /*#__PURE__*/React__default.createElement(NavLinks, {
      flatDirectories: flatDocsDirectories,
      currentIndex: activeIndex,
      config: config,
      isRTL: isRTL
    })
  }, children))))));
};

var index = ((opts, config) => props => {
  return /*#__PURE__*/React__default.createElement(nextThemes.ThemeProvider, {
    attribute: "class"
  }, /*#__PURE__*/React__default.createElement(Layout, _extends({
    config: config
  }, opts, props)));
});

module.exports = index;
