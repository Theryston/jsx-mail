function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var cn = _interopDefault(require('classnames'));
var Slugger = _interopDefault(require('github-slugger'));
var Router = require('next/router');
var Router__default = _interopDefault(Router);
var Link = _interopDefault(require('next/link'));
var innerText = _interopDefault(require('react-innertext'));
var matchSorter = _interopDefault(require('match-sorter'));
var GraphemeSplitter = _interopDefault(require('grapheme-splitter'));

const ActiveAnchorContext = React.createContext();
const ActiveAnchorSetterContext = React.createContext(); // Separate the state as 2 contexts here to avoid
// re-renders of the content triggered by the state update.

const useActiveAnchor = () => React.useContext(ActiveAnchorContext);

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

module.exports = Sidebar;
